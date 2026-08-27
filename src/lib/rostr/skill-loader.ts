import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Skill Loader
 *
 * Loads and parses skill files from .agents/skills/ directory.
 * Skills define specialized agent behaviors, instructions, tools, and sub-agent dependencies.
 */

export interface Skill {
  name: string;
  description: string;
  instructions: string;
  tools: string[];
  dependencies: string[]; // Sub-skills this skill can invoke
  metadata: {
    domain?: string;
    complexity?: 'low' | 'medium' | 'high';
    estimatedTokens?: number;
  };
}

/**
 * Load a skill from disk by name
 */
export async function loadSkill(skillName: string): Promise<Skill> {
  try {
    const skillPath = join(process.cwd(), '.agents', 'skills', skillName, 'SKILL.md');
    const content = readFileSync(skillPath, 'utf8');

    return parseSkill(skillName, content);
  } catch (error) {
    console.error(`Failed to load skill: ${skillName}`, error);
    throw new Error(`Skill not found: ${skillName}`);
  }
}

/**
 * Parse markdown skill file into structured Skill object
 */
function parseSkill(name: string, markdown: string): Skill {
  // Extract sections using markdown headers
  const sections = extractSections(markdown);

  return {
    name,
    description: extractDescription(sections),
    instructions: extractInstructions(sections),
    tools: extractTools(sections),
    dependencies: extractDependencies(sections),
    metadata: extractMetadata(sections),
  };
}

/**
 * Extract all markdown sections (## Header)
 */
function extractSections(markdown: string): Map<string, string> {
  const sections = new Map<string, string>();
  const lines = markdown.split('\n');

  let currentHeader: string | null = null;
  let currentContent: string[] = [];

  for (const line of lines) {
    // Check for markdown header (## Header)
    const headerMatch = line.match(/^##\s+(.+)$/);

    if (headerMatch) {
      // Save previous section
      if (currentHeader) {
        sections.set(currentHeader.toLowerCase(), currentContent.join('\n').trim());
      }

      // Start new section
      currentHeader = headerMatch[1];
      currentContent = [];
    } else if (currentHeader) {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentHeader) {
    sections.set(currentHeader.toLowerCase(), currentContent.join('\n').trim());
  }

  return sections;
}

/**
 * Extract skill description
 */
function extractDescription(sections: Map<string, string>): string {
  return (
    sections.get('description') ||
    sections.get('overview') ||
    sections.get('purpose') ||
    'No description available'
  );
}

/**
 * Extract core instructions for the agent
 */
function extractInstructions(sections: Map<string, string>): string {
  const instructionSections = [
    'instructions',
    'system prompt',
    'behavior',
    'core instructions',
    'agent instructions',
  ];

  for (const key of instructionSections) {
    const content = sections.get(key);
    if (content) return content;
  }

  // Fallback: concatenate all sections except metadata
  const excludedSections = ['tools', 'dependencies', 'sub-agents', 'metadata', 'references'];
  const allInstructions: string[] = [];

  for (const [key, value] of sections.entries()) {
    if (!excludedSections.some(excluded => key.includes(excluded))) {
      allInstructions.push(value);
    }
  }

  return allInstructions.join('\n\n');
}

/**
 * Extract required tools
 */
function extractTools(sections: Map<string, string>): string[] {
  const toolsContent = sections.get('tools') || sections.get('required tools') || '';

  if (!toolsContent) return [];

  // Extract tool names from lists or comma-separated values
  const tools: string[] = [];
  const lines = toolsContent.split('\n');

  for (const line of lines) {
    // Match list items: - tool_name or * tool_name
    const listMatch = line.match(/^[-*]\s+`?([a-z_]+)`?/i);
    if (listMatch) {
      tools.push(listMatch[1]);
      continue;
    }

    // Match inline code blocks: `tool_name`
    const codeMatches = line.matchAll(/`([a-z_]+)`/gi);
    for (const match of codeMatches) {
      tools.push(match[1]);
    }
  }

  return [...new Set(tools)]; // Deduplicate
}

/**
 * Extract sub-skill dependencies
 */
function extractDependencies(sections: Map<string, string>): string[] {
  const depContent =
    sections.get('dependencies') ||
    sections.get('sub-agents') ||
    sections.get('sub-skills') ||
    sections.get('delegation') ||
    '';

  if (!depContent) return [];

  const dependencies: string[] = [];
  const lines = depContent.split('\n');

  for (const line of lines) {
    // Match skill names in various formats
    // - prospect-pal-analyst
    // * `prospect-pal-copywriter`
    // Delegates to: prospect-pal-tools
    const match = line.match(/[`-]?(prospect-pal-[a-z-]+)[`]?/i);
    if (match) {
      dependencies.push(match[1]);
    }
  }

  return [...new Set(dependencies)]; // Deduplicate
}

/**
 * Extract metadata (domain, complexity, etc.)
 */
function extractMetadata(sections: Map<string, string>): Skill['metadata'] {
  const metadataContent = sections.get('metadata') || '';

  const metadata: Skill['metadata'] = {};

  // Extract domain
  const domainMatch = metadataContent.match(/domain:\s*([a-z]+)/i);
  if (domainMatch) {
    metadata.domain = domainMatch[1];
  }

  // Extract complexity
  const complexityMatch = metadataContent.match(/complexity:\s*(low|medium|high)/i);
  if (complexityMatch) {
    metadata.complexity = complexityMatch[1].toLowerCase() as 'low' | 'medium' | 'high';
  }

  // Extract estimated tokens
  const tokensMatch = metadataContent.match(/estimated[_\s]tokens:\s*(\d+)/i);
  if (tokensMatch) {
    metadata.estimatedTokens = parseInt(tokensMatch[1], 10);
  }

  return metadata;
}

/**
 * Load multiple skills in parallel
 */
export async function loadSkills(skillNames: string[]): Promise<Map<string, Skill>> {
  const skillMap = new Map<string, Skill>();

  const results = await Promise.allSettled(
    skillNames.map(name => loadSkill(name))
  );

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      skillMap.set(skillNames[index], result.value);
    } else {
      console.warn(`Failed to load skill ${skillNames[index]}:`, result.reason);
    }
  });

  return skillMap;
}

/**
 * List all available skills
 */
export function listAvailableSkills(): string[] {
  try {
    const { readdirSync } = require('fs');
    const skillsDir = join(process.cwd(), '.agents', 'skills');
    const entries = readdirSync(skillsDir, { withFileTypes: true });

    return entries
      .filter((entry: any) => entry.isDirectory())
      .map((entry: any) => entry.name)
      .filter((name: string) => name.startsWith('prospect-pal-'));
  } catch (error) {
    console.error('Failed to list skills:', error);
    return [];
  }
}
