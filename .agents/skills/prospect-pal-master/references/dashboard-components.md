# Dashboard Component Reference

React component patterns for the Prospect PAL dashboard.

---

## Page Structure

### Dashboard Layout
```
┌─────────────────────────────────────────────────────────────┐
│  TopBar (Logo, Navigation, User Menu)                       │
├────────────┬────────────────────────────────────────────────┤
│            │                                                │
│  Sidebar   │  Main Content Area                             │
│            │                                                │
│  - Home    │  ┌──────────────────────────────────────────┐  │
│  - Builder │  │  View Header                             │  │
│  - Wizard  │  ├──────────────────────────────────────────┤  │
│  - Outputs │  │                                          │  │
│  - Scripts │  │  View Content                            │  │
│  - Signals │  │                                          │  │
│  - Analyst │  │                                          │  │
│  - Academy │  │                                          │  │
│  - Projects│  │                                          │  │
│  - Settings│  └──────────────────────────────────────────┘  │
│            │                                                │
└────────────┴────────────────────────────────────────────────┘
```

---

## Intake Wizard Components

### StepIndicator
```tsx
interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  completedSteps: number[];
}

// Visual: 1 ─── 2 ─── 3 ─── 4 ─── 5 ─── 6 ─── 7
//        ●     ●     ○     ○     ○     ○     ○
```

### WizardStep
```tsx
interface WizardStepProps {
  title: string;
  description: string;
  fields: FormField[];
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}
```

### FormFields
```tsx
// Text input
<Input
  label="Company Name"
  name="company_name"
  placeholder="Enter your company name"
  required
/>

// Textarea
<Textarea
  label="Company Background"
  name="company_background"
  placeholder="Describe what your company does..."
  maxLength={500}
/>

// Multi-select
<MultiSelect
  label="Target Industries"
  name="target_industries"
  options={INDUSTRY_OPTIONS}
  maxSelections={5}
/>

// Single select
<Select
  label="Company Size"
  name="company_size"
  options={COMPANY_SIZE_OPTIONS}
/>

// Toggle
<Toggle
  label="Approval Gate"
  name="approval_gate"
  description="Require Slack approval before sending"
/>
```

---

## Campaign Workspace Components

### CampaignCard
```tsx
interface CampaignCardProps {
  campaign: Campaign;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
}

// Layout:
// ┌─────────────────────────────────┐
// │ Campaign Title        [Status] │
// │ Created: Jan 1, 2025           │
// │                                │
// │ 📊 125 leads  📧 89 sent       │
// │ 💬 12 replies 📅 3 meetings    │
// │                                │
// │ [Edit] [View] [Delete]         │
// └─────────────────────────────────┘
```

### OutputsPanel
```tsx
interface OutputsPanelProps {
  outputs: {
    workflow_json: string;
    email_framework: string;
    deploy_guide: string;
    skill_definition: string;
  };
  onDownload: (type: string) => void;
  onDeploy: () => void;
}

// Layout:
// ┌─────────────────────────────────────────┐
// │ Campaign Outputs                        │
// ├─────────────────────────────────────────┤
// │ 📄 n8n Workflow JSON       [Download]   │
// │ 📧 Email Framework         [Download]   │
// │ 📋 Deploy Guide            [Download]   │
// │ 🎯 Skill Definition        [Download]   │
// ├─────────────────────────────────────────┤
// │ [Download All]  [Deploy to n8n]         │
// └─────────────────────────────────────────┘
```

### AgentPanel
```tsx
interface AgentPanelProps {
  agents: {
    name: string;
    description: string;
    status: 'available' | 'busy' | 'offline';
    icon: string;
  }[];
  onChat: (agentName: string) => void;
}

// Layout:
// ┌─────────────────────────────────────────┐
// │ Campaign Agents                         │
// ├─────────────────────────────────────────┤
// │ 🔧 Tool Configuration      [Chat] ●     │
// │ ✍️  Copy Writer            [Chat] ●     │
// │ ⚙️  Workflow Generator     [Chat] ●     │
// │ 📊 Execution Analyst       [Chat] ●     │
// └─────────────────────────────────────────┘
```

---

## n8n Canvas Component

### N8nCanvas
```tsx
interface N8nCanvasProps {
  nodes: N8nNode[];
  connections: [string, string][];
  onNodeClick: (nodeId: string) => void;
  onZoom: (level: number) => void;
  onPan: (x: number, y: number) => void;
}

// Node styling by category
const NODE_COLORS = {
  trigger: '#F59E0B',    // Amber
  api: '#3B82F6',        // Blue
  crm: '#FF7A59',        // HubSpot Orange
  enrichment: '#8B5CF6', // Purple
  ai: '#7C3AED',         // Violet
  logic: '#6B7280',      // Gray
  messaging: '#4ADE80',  // Green
  sequencer: '#06B6D4',  // Cyan
};
```

### NodeCard
```tsx
interface NodeCardProps {
  node: N8nNode;
  isSelected: boolean;
  isConnected: boolean;
}

// Layout:
// ┌─────────────────────────┐
// │ 🔶 HubSpot CRM Check    │
// │ Skip if contact exists  │
// └─────────────────────────┘
```

---

## Chat Interface Component

### ChatView
```tsx
interface ChatViewProps {
  messages: Message[];
  onSend: (message: string) => void;
  isLoading: boolean;
  agent: string;
}

// Layout:
// ┌─────────────────────────────────────────┐
// │ Chat with Copy Writer Agent             │
// ├─────────────────────────────────────────┤
// │ ┌───────────────────────────────────┐   │
// │ │ User: Write cold emails for...   │   │
// │ └───────────────────────────────────┘   │
// │ ┌───────────────────────────────────┐   │
// │ │ Agent: Here are 3 email variants │   │
// │ │ with PAS framework...            │   │
// │ └───────────────────────────────────┘   │
// ├─────────────────────────────────────────┤
// │ [Type a message...]          [Send]     │
// └─────────────────────────────────────────┘
```

---

## Analytics Components

### StatCard
```tsx
interface StatCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon: string;
}

// Layout:
// ┌──────────────────┐
// │ 📊 Leads Found   │
// │ 1,234            │
// │ ↑ 12% vs last wk │
// └──────────────────┘
```

### PipelineVisualization
```tsx
// Funnel visualization
// ┌───────────────────────────────────────┐
// │ Leads Found          │████████│ 1000 │
// │ Enriched             │██████│   800  │
// │ Researched           │█████│    700  │
// │ Emails Generated     │████│     600  │
// │ Sent                 │███│      500  │
// │ Replies              │█│        50   │
// │ Meetings             │         10    │
// └───────────────────────────────────────┘
```

---

## Settings Components

### ApiKeyInput
```tsx
interface ApiKeyInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onTest: () => void;
  testStatus: 'idle' | 'testing' | 'success' | 'error';
}

// Layout:
// ┌─────────────────────────────────────────┐
// │ Apollo API Key                          │
// │ [••••••••••••••••] [Show] [Test] ✓      │
// └─────────────────────────────────────────┘
```

### IntegrationCard
```tsx
interface IntegrationCardProps {
  name: string;
  icon: string;
  connected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

// Layout:
// ┌─────────────────────────────────────────┐
// │ 🔶 HubSpot                              │
// │ Connected as: user@company.com          │
// │ Last sync: 5 minutes ago                │
// │ [Disconnect] [Refresh]                  │
// └─────────────────────────────────────────┘
```

---

## Component Library Reference

All components use the existing Prospect PAL design system:
- `/src/components/ui/` - Base components (Button, Card, Input, etc.)
- Tailwind CSS with HSL color variables
- Framer Motion for animations
- Lucide React for icons

### Color Variables
```css
--primary: 221.2 83.2% 53.3%;     /* Blue */
--secondary: 210 40% 96.1%;       /* Light gray */
--destructive: 0 84.2% 60.2%;     /* Red */
--accent: 210 40% 96.1%;          /* Light blue */
--muted: 210 40% 96.1%;           /* Muted gray */
```

### Typography
```css
/* Headings */
.text-2xl.font-bold.tracking-tight

/* Body */
.text-base.text-foreground

/* Muted */
.text-sm.text-muted-foreground
```
