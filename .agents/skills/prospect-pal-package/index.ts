/**
 * Prospect PAL Skills Package Index
 * Export all skills for programmatic access
 */

export const PROSPECT_PAL_SKILLS = {
  orchestrator: {
    name: 'prospect-pal-orchestrator',
    path: '../prospect-pal-orchestrator/SKILL.md',
    description: '11-step automation workflow orchestrator',
    version: '2.0.0',
  },
  master: {
    name: 'prospect-pal-master',
    path: '../prospect-pal-master/SKILL.md',
    description: 'Master campaign coordination agent',
    version: '2.0.0',
  },
  workflow: {
    name: 'prospect-pal-workflow',
    path: '../prospect-pal-workflow/SKILL.md',
    description: 'n8n workflow generator',
    version: '2.0.0',
  },
  copywriter: {
    name: 'prospect-pal-copywriter',
    path: '../prospect-pal-copywriter/SKILL.md',
    description: 'Email and messaging copy writer',
    version: '2.0.0',
  },
  tools: {
    name: 'prospect-pal-tools',
    path: '../prospect-pal-tools/SKILL.md',
    description: 'Tool configuration and MCP integration',
    version: '2.0.0',
  },
  n8nEngineer: {
    name: 'prospect-pal-n8n-engineer',
    path: '../prospect-pal-n8n-engineer/SKILL.md',
    description: 'Self-service workflow building',
    version: '2.0.0',
  },
  analyst: {
    name: 'prospect-pal-analyst',
    path: '../prospect-pal-analyst/SKILL.md',
    description: 'Execution monitoring and diagnostics',
    version: '2.0.0',
  },
} as const;

export const SKILL_LIST = Object.values(PROSPECT_PAL_SKILLS);

export function getSkillByName(name: string) {
  return SKILL_LIST.find(s => s.name === name);
}

export function getAllSkillPaths() {
  return SKILL_LIST.map(s => s.path);
}
