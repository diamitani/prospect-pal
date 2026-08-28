export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  stack: {
    trigger: string;
    dataSource: string;
    enrichment: string;
    crm: string;
    sequencer: string;
    llm: string;
  };
}

export const TEMPLATES: WorkflowTemplate[] = [
  {
    id: "apollo-hubspot-smartlead",
    name: "Apollo → HubSpot → Smartlead",
    description: "Classic B2B SaaS stack",
    icon: "Zap",
    stack: {
      trigger: "cron",
      dataSource: "apollo",
      enrichment: "apollo",
      crm: "hubspot",
      sequencer: "smartlead",
      llm: "anthropic",
    },
  },
  {
    id: "clay-salesforce-instantly",
    name: "Clay → Salesforce → Instantly",
    description: "Enterprise with waterfall enrichment",
    icon: "Building2",
    stack: {
      trigger: "cron",
      dataSource: "clay",
      enrichment: "clay",
      crm: "salesforce",
      sequencer: "instantly",
      llm: "anthropic",
    },
  },
  {
    id: "csv-pipedrive-lemlist",
    name: "CSV → Pipedrive → Lemlist",
    description: "Import your own list",
    icon: "FileSpreadsheet",
    stack: {
      trigger: "webhook",
      dataSource: "csv",
      enrichment: "apollo",
      crm: "pipedrive",
      sequencer: "lemlist",
      llm: "openai",
    },
  },
  {
    id: "zoominfo-attio-hubspot-seq",
    name: "ZoomInfo → Attio → HubSpot Seq",
    description: "Premium data with modern CRM",
    icon: "Target",
    stack: {
      trigger: "cron",
      dataSource: "zoominfo",
      enrichment: "zoominfo",
      crm: "attio",
      sequencer: "hubspot_seq",
      llm: "anthropic",
    },
  },
];

export const DEFAULT_STACK = TEMPLATES[0].stack;
