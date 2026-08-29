import { buildNodeSequence } from "./src/lib/workflow-generator";
console.log(buildNodeSequence({ icpPrompt: "", leadSource: "apollo", enrichment: [], crm: "hubspot", sequencer: "smartlead", approvalGate: false, slackAlerts: false, companyUrls: [], companyPrompt: "" }));
