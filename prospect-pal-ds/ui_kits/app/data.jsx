const NINE_NODES = [
  { title: "Intake & Cron", subtitle: "Schedule / Webhook / CSV", icon: "zap", stage: "trigger", binding: "n8n-nodes-base.scheduleTrigger" },
  { title: "Data Normalizer", subtitle: "Domain sanitize + schema map", icon: "braces", stage: "logic", binding: "n8n-nodes-base.code" },
  { title: "CRM Dedupe Shield", subtitle: "Halt on active deals", icon: "shield-check", stage: "shield", binding: "n8n-nodes-base.hubspot" },
  { title: "Data Tool Adapter", subtitle: "Apollo waterfall reveal", icon: "search", stage: "data", binding: "httpRequest → apollo.io" },
  { title: "AI Research & PAS Copy", subtitle: "3-sentence problem-agitate-solve", icon: "sparkles", stage: "ai", binding: "langchain.agent + Claude" },
  { title: "Approval Switch", subtitle: "Slack review vs. full-auto", icon: "scale", stage: "logic", binding: "n8n-nodes-base.if" },
  { title: "CRM Contact Creation", subtitle: "Upsert back to CRM", icon: "database", stage: "shield", binding: "n8n-nodes-base.hubspot" },
  { title: "Sequence Enrollment", subtitle: "Smartlead enrol + warmup", icon: "send", stage: "sequence", binding: "httpRequest → smartlead" },
  { title: "Review Alert", subtitle: "1-click Slack approval", icon: "message-square", stage: "logic", binding: "n8n-nodes-base.slack" },
];

const NAV = [
  { id: "home", label: "Dashboard", icon: "layout-grid" },
  { id: "builder", label: "Workflow Builder", icon: "workflow" },
  { id: "wizard", label: "Intake Wizard", icon: "wand-sparkles" },
  { id: "outputs", label: "Outputs & Deploy", icon: "package" },
  { id: "signals", label: "Tech Signals", icon: "radio", badge: "1.4k" },
  { id: "settings", label: "Integrations & Keys", icon: "plug" },
];

const VIEW_META = {
  home: { title: "Dashboard", crumb: "Welcome back" },
  builder: { title: "Workflow Builder", crumb: "Intake → bindings → compile" },
  wizard: { title: "Intake Wizard", crumb: "PAL intake gate · 8 steps" },
  outputs: { title: "Outputs & Deploy", crumb: "Review, download, push to n8n" },
  signals: { title: "Tech Signals", crumb: "n8n stack detection & hiring intent" },
  settings: { title: "Integrations & Keys", crumb: "Connect tools · nothing stored" },
};

Object.assign(window, { NINE_NODES, NAV, VIEW_META });
