import { Phase } from './npao-classifier';

/**
 * Skill Router
 *
 * Maps NPAO phases to appropriate skills for specialized agent execution.
 * Each phase of the development lifecycle requires different expertise.
 */

export type SkillName =
  | 'prospect-pal-analyst'
  | 'prospect-pal-master'
  | 'prospect-pal-orchestrator'
  | 'prospect-pal-workflow'
  | 'prospect-pal-copywriter'
  | 'prospect-pal-tools'
  | 'prospect-pal-n8n-engineer';

/**
 * Map NPAO phases to primary skills
 *
 * Phase taxonomy:
 * - PreD: Research and problem definition (analyst skill)
 * - Design: Planning and architecture (master skill)
 * - Development: Building the workflow (orchestrator skill)
 * - Deployment: Pushing to n8n (workflow skill)
 * - Debugging: Diagnosing issues (analyst skill)
 */
const PHASE_SKILL_MAP: Record<Phase, SkillName> = {
  PreD: 'prospect-pal-analyst',        // Research phase → analyst investigates ICP, tools, competitors
  Design: 'prospect-pal-master',       // Planning phase → master designs campaign structure
  Development: 'prospect-pal-orchestrator', // Building phase → orchestrator delegates to sub-skills
  Deployment: 'prospect-pal-workflow', // Deployment phase → workflow generates n8n JSON
  Debugging: 'prospect-pal-analyst',   // Diagnosis phase → analyst root-causes failures
};

/**
 * Select the appropriate skill for a given NPAO phase
 */
export function selectSkillForPhase(phase: Phase): SkillName {
  return PHASE_SKILL_MAP[phase] || 'prospect-pal-orchestrator';
}

/**
 * Map agent type (from PAL Compiler) to skill name
 *
 * This provides backward compatibility for existing PAL Compiler outputs
 * that specify agent_type instead of phase.
 */
const AGENT_TYPE_SKILL_MAP: Record<string, SkillName> = {
  builder: 'prospect-pal-orchestrator',
  researcher: 'prospect-pal-analyst',
  reviewer: 'prospect-pal-analyst',
  designer: 'prospect-pal-master',
  deployer: 'prospect-pal-workflow',
  debugger: 'prospect-pal-analyst',
  orchestrator: 'prospect-pal-orchestrator',
  analyst: 'prospect-pal-analyst',
  copywriter: 'prospect-pal-copywriter',
};

/**
 * Select skill by agent type (fallback for PAL Compiler)
 */
export function selectSkillByAgentType(agentType: string): SkillName {
  return AGENT_TYPE_SKILL_MAP[agentType] || 'prospect-pal-orchestrator';
}

/**
 * Determine if a skill requires sub-skill delegation
 *
 * Orchestrator skill delegates to:
 * - copywriter (email generation)
 * - analyst (ICP research)
 * - tools (integration configuration)
 * - workflow (n8n JSON compilation)
 */
export function requiresSubSkills(skillName: SkillName): boolean {
  return skillName === 'prospect-pal-orchestrator';
}

/**
 * Get ordered sub-skills for orchestrator execution
 *
 * Orchestrator skill executes in this sequence:
 * 1. Analyst: Research ICP, competitors, pain points
 * 2. Tools: Configure integrations (CRM, enrichment, sequencer)
 * 3. Copywriter: Generate PAS email templates
 * 4. Workflow: Compile n8n JSON with all artifacts
 */
export function getOrchestratorSubSkills(): SkillName[] {
  return [
    'prospect-pal-analyst',
    'prospect-pal-tools',
    'prospect-pal-copywriter',
    'prospect-pal-workflow',
  ];
}

/**
 * Validate skill name
 */
export function isValidSkillName(name: string): name is SkillName {
  const validSkills: SkillName[] = [
    'prospect-pal-analyst',
    'prospect-pal-master',
    'prospect-pal-orchestrator',
    'prospect-pal-workflow',
    'prospect-pal-copywriter',
    'prospect-pal-tools',
    'prospect-pal-n8n-engineer',
  ];

  return validSkills.includes(name as SkillName);
}

/**
 * Get skill priority for execution order
 *
 * When multiple skills are applicable, execute in this order:
 * 1. Analyst (research first)
 * 2. Master (plan second)
 * 3. Tools (configure third)
 * 4. Copywriter (write fourth)
 * 5. Workflow (compile fifth)
 * 6. Orchestrator (coordinate if needed)
 */
const SKILL_PRIORITY: Record<SkillName, number> = {
  'prospect-pal-analyst': 1,
  'prospect-pal-master': 2,
  'prospect-pal-tools': 3,
  'prospect-pal-copywriter': 4,
  'prospect-pal-workflow': 5,
  'prospect-pal-orchestrator': 6,
  'prospect-pal-n8n-engineer': 7,
};

/**
 * Sort skills by execution priority
 */
export function sortSkillsByPriority(skills: SkillName[]): SkillName[] {
  return [...skills].sort((a, b) => SKILL_PRIORITY[a] - SKILL_PRIORITY[b]);
}
