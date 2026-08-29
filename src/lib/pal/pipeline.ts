import type {
  ParsedIntent,
  ToolSelection,
  AmbiguityReport,
  JTBD,
  ExpandedDesign,
  WorkflowNode,
  InstructionPack,
  RiskItem,
} from './types';

/**
 * PAL Pipeline - Parse → Ambiguity Scan → Latent Intent → Expand → Compile
 */
export class PALPipeline {
  parse(intake: Record<string, string>): ParsedIntent {
    return {
      companyName: intake.company_name || '',
      companyBackground: intake.company_background || '',
      productOffer: intake.company_product || '',
      icpDescription: intake.campaign_icp || '',
      personaDescription: intake.user_persona || '',
      signals: intake.target_signals?.split(',').map(s => s.trim()).filter(Boolean) || [],
      selectedTools: {
        leadSource: intake.tool_lead_source || '',
        enrichment: intake.tool_enrichment || intake.tool_lead_source || '',
        crm: intake.tool_crm || '',
        sequencer: intake.tool_sequencer || '',
        llm: (intake.tool_llm as ToolSelection['llm']) || 'claude',
      },
      triggerType: (intake.trigger_type as ParsedIntent['triggerType']) || 'search',
      approvalPolicy: (intake.approval_policy as ParsedIntent['approvalPolicy']) || 'human-approval',
    };
  }

  ambiguityScan(parsed: ParsedIntent): AmbiguityReport {
    const missing: string[] = [];
    const questions: string[] = [];

    if (!parsed.productOffer) {
      missing.push('productOffer');
      questions.push('What specific outcome does your product deliver?');
    }
    if (!parsed.icpDescription) {
      missing.push('icpDescription');
      questions.push('Describe your ideal customer company (size, industry, tech stack)');
    }

    return { missingFields: missing, suggestedQuestions: questions, confidenceScore: Math.max(0, 100 - missing.length * 15) };
  }

  extractJTBD(parsed: ParsedIntent): JTBD {
    const isFirst = !parsed.companyBackground?.includes('existing');
    const isHighVolume = parsed.triggerType === 'search' || parsed.approvalPolicy === 'auto-send';
    
    return {
      primaryJob: isFirst && isHighVolume 
        ? 'Launch first automated outbound at scale with quality safeguards'
        : isFirst 
          ? 'Test automated outbound with human oversight'
          : 'Scale existing outreach while maintaining quality',
      successMetrics: ['Booked meetings', 'Reply rates > 5%', 'No CRM duplicates', 'Review time < 10 min/day'],
      currentApproach: parsed.companyBackground || 'Manual outreach',
      constraints: parsed.approvalPolicy === 'human-approval' ? ['Requires human review'] : [],
    };
  }

  expand(jtbd: JTBD, parsed: ParsedIntent): ExpandedDesign {
    return {
      icpSegments: ['Primary segment'],
      messagingFramework: { pasSequences: [], variableFields: [], toneVoice: 'Professional' },
      workflowNodes: this.buildNodes(parsed),
      analyticsPlan: { kpis: ['Email sent', 'Reply rate'], trackingEvents: ['enrichment'], reportingSchedule: 'daily' },
      riskMitigation: parsed.approvalPolicy === 'auto-send' 
        ? [{ risk: 'Auto-send without review', mitigation: 'Rate limit 50/day', severity: 'high' }]
        : [],
    };
  }

  compile(expanded: ExpandedDesign, parsed: ParsedIntent): InstructionPack {
    return {
      workflowJson: { name: 'Prospect PAL Workflow', nodes: expanded.workflowNodes, settings: {} },
      setupInstructions: [
        `Connect ${parsed.selectedTools.crm} OAuth`,
        `Add ${parsed.selectedTools.leadSource} API key`,
        `Configure ${parsed.selectedTools.sequencer}`,
        'Test with single record',
      ],
      testingPlan: ['Verify data flow', 'Check duplicates', 'Review AI output'],
      monitoringConfig: { alertWebhook: '/api/webhooks/workflow-alert', dailyDigest: true },
    };
  }

  private buildNodes(parsed: ParsedIntent): WorkflowNode[] {
    const tools = parsed.selectedTools;
    return [
      { id: 'n01', nodeNumber: 1, name: 'Intake & Cron', type: parsed.triggerType, config: {}, dependencies: [] },
      { id: 'n02', nodeNumber: 2, name: 'Normalizer', type: 'code', config: {}, dependencies: ['n01'] },
      { id: 'n03', nodeNumber: 3, name: 'Shield', type: tools.crm, toolBinding: tools.crm, config: {}, dependencies: ['n02'] },
      { id: 'n04', nodeNumber: 4, name: 'Adapter', type: tools.leadSource, toolBinding: tools.leadSource, config: {}, dependencies: ['n03'] },
      { id: 'n05', nodeNumber: 5, name: 'AI', type: 'ai_agent', toolBinding: tools.llm, config: {}, dependencies: ['n04'] },
      { id: 'n06', nodeNumber: 6, name: 'Approval', type: 'if', config: { policy: parsed.approvalPolicy }, dependencies: ['n05'] },
      { id: 'n07', nodeNumber: 7, name: 'CRM', type: tools.crm, toolBinding: tools.crm, config: {}, dependencies: ['n06'] },
      { id: 'n08', nodeNumber: 8, name: 'Enroll', type: tools.sequencer, toolBinding: tools.sequencer, config: {}, dependencies: ['n07'] },
      { id: 'n09', nodeNumber: 9, name: 'Alert', type: 'slack', config: {}, dependencies: ['n08'] },
    ];
  }
}

export const palPipeline = new PALPipeline();
