import { Skill, loadSkill } from './skill-loader';
import { SkillName, requiresSubSkills, getOrchestratorSubSkills } from './skill-router';
import { AgentManifest } from './pal-compiler';
import { executeAgentWithBedrock } from './bedrock-executor';

/**
 * Skill Executor
 *
 * Executes skills with support for sub-skill delegation.
 * Orchestrator skill can invoke analyst, copywriter, tools, and workflow sub-skills.
 */

export interface SkillExecutionConfig {
  apiKey?: string;
  maxSubSkillDepth?: number;
  timeout?: number;
  enableParallelExecution?: boolean;
}

export interface SkillResult {
  skillName: string;
  output: any;
  subSkillResults?: Map<string, SkillResult>;
  executionTime: number;
  tokensUsed?: {
    input: number;
    output: number;
  };
}

/**
 * Execute a skill with optional sub-skill delegation
 */
export async function executeSkill(
  skillName: SkillName,
  manifest: AgentManifest,
  config: SkillExecutionConfig = {}
): Promise<SkillResult> {
  const startTime = Date.now();
  const maxDepth = config.maxSubSkillDepth ?? 1; // Default: allow 1 level of delegation

  // Load skill instructions
  const skill = await loadSkill(skillName);

  // Check if this skill requires sub-skill delegation
  if (requiresSubSkills(skillName) && maxDepth > 0) {
    // Orchestrator skill: delegate to sub-skills
    return await executeOrchestratorSkill(skill, manifest, config, maxDepth);
  } else {
    // Regular skill: execute directly
    return await executeSingleSkill(skill, manifest, config, startTime);
  }
}

/**
 * Execute orchestrator skill with sub-skill delegation
 */
async function executeOrchestratorSkill(
  skill: Skill,
  manifest: AgentManifest,
  config: SkillExecutionConfig,
  maxDepth: number
): Promise<SkillResult> {
  const startTime = Date.now();
  const subSkills = getOrchestratorSubSkills();
  const subSkillResults = new Map<string, SkillResult>();

  // Execute sub-skills in sequence
  // 1. Analyst: Research ICP, competitors, pain points
  // 2. Tools: Configure integrations
  // 3. Copywriter: Generate email copy
  // 4. Workflow: Compile n8n JSON

  let aggregatedOutput: any = {
    research: null,
    tools: null,
    copy: null,
    workflow: null,
  };

  for (const subSkillName of subSkills) {
    try {
      // Create sub-manifest with skill-specific context
      const subManifest = createSubManifest(manifest, subSkillName, aggregatedOutput);

      // Execute sub-skill (with decreased depth to prevent infinite recursion)
      const subResult = await executeSkill(subSkillName, subManifest, {
        ...config,
        maxSubSkillDepth: maxDepth - 1,
      });

      subSkillResults.set(subSkillName, subResult);

      // Aggregate results for next sub-skill
      if (subSkillName === 'prospect-pal-analyst') {
        aggregatedOutput.research = subResult.output;
      } else if (subSkillName === 'prospect-pal-tools') {
        aggregatedOutput.tools = subResult.output;
      } else if (subSkillName === 'prospect-pal-copywriter') {
        aggregatedOutput.copy = subResult.output;
      } else if (subSkillName === 'prospect-pal-workflow') {
        aggregatedOutput.workflow = subResult.output;
      }
    } catch (error) {
      console.error(`Sub-skill execution failed: ${subSkillName}`, error);
      // Continue with other sub-skills
    }
  }

  const executionTime = Date.now() - startTime;

  return {
    skillName: skill.name,
    output: aggregatedOutput,
    subSkillResults,
    executionTime,
  };
}

/**
 * Execute a single skill without delegation
 */
async function executeSingleSkill(
  skill: Skill,
  manifest: AgentManifest,
  config: SkillExecutionConfig,
  startTime: number
): Promise<SkillResult> {
  // Inject skill instructions into manifest system prompt
  const enhancedManifest: AgentManifest = {
    ...manifest,
    instructions: {
      ...manifest.instructions,
      system: skill.instructions,
      task_description: manifest.instructions.task_description + '\n\n' + skill.description,
    },
    tools_enabled: {
      allow: [...(manifest.tools_enabled?.allow || []), ...skill.tools],
      deny: manifest.tools_enabled?.deny || [],
    },
  };

  // Execute agent with skill-enhanced manifest
  const result = await executeAgentWithBedrock(enhancedManifest);

  const executionTime = Date.now() - startTime;

  return {
    skillName: skill.name,
    output: result,
    executionTime,
    tokensUsed: result.usage ? { input: result.usage.input_tokens, output: result.usage.output_tokens } : undefined,
  };
}

/**
 * Create sub-manifest for sub-skill execution
 *
 * Passes context from previous sub-skills to the next one.
 */
function createSubManifest(
  parentManifest: AgentManifest,
  subSkillName: SkillName,
  priorResults: any
): AgentManifest {
  let taskDescription = parentManifest.instructions.task_description;

  // Inject context from prior sub-skills
  if (subSkillName === 'prospect-pal-tools' && priorResults.research) {
    taskDescription += `\n\nResearch Results:\n${JSON.stringify(priorResults.research, null, 2)}`;
  } else if (subSkillName === 'prospect-pal-copywriter' && priorResults.research) {
    taskDescription += `\n\nResearch Results:\n${JSON.stringify(priorResults.research, null, 2)}`;
    taskDescription += `\n\nTools Configuration:\n${JSON.stringify(priorResults.tools, null, 2)}`;
  } else if (subSkillName === 'prospect-pal-workflow') {
    taskDescription += `\n\nResearch Results:\n${JSON.stringify(priorResults.research, null, 2)}`;
    taskDescription += `\n\nTools Configuration:\n${JSON.stringify(priorResults.tools, null, 2)}`;
    taskDescription += `\n\nEmail Copy:\n${JSON.stringify(priorResults.copy, null, 2)}`;
  }

  return {
    ...parentManifest,
    instructions: {
      ...parentManifest.instructions,
      task_description: taskDescription,
    },
  };
}

/**
 * Execute multiple skills in parallel (if supported)
 */
export async function executeSkillsParallel(
  skillNames: SkillName[],
  manifest: AgentManifest,
  config: SkillExecutionConfig = {}
): Promise<Map<string, SkillResult>> {
  const results = new Map<string, SkillResult>();

  if (!config.enableParallelExecution) {
    // Sequential execution
    for (const skillName of skillNames) {
      const result = await executeSkill(skillName, manifest, config);
      results.set(skillName, result);
    }
  } else {
    // Parallel execution
    const promises = skillNames.map(async skillName => {
      const result = await executeSkill(skillName, manifest, config);
      return { skillName, result };
    });

    const settled = await Promise.allSettled(promises);

    settled.forEach(result => {
      if (result.status === 'fulfilled') {
        results.set(result.value.skillName, result.value.result);
      } else {
        console.error('Skill execution failed:', result.reason);
      }
    });
  }

  return results;
}
