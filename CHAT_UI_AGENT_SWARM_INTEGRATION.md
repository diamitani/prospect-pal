# Chat UI Agent Swarm Integration

**Integrated the Agent Swarm system into the chat UI with selectable agent types**

---

## What Was Changed

### 1. **Chat UI Component** (`src/components/views/ChatView.tsx`)

#### Added Agent Selection Bar

Users can now select from 5 specialized agent types:

| Agent | Icon | Description | Use Case |
|-------|------|-------------|----------|
| **Architect** 🏗️ | Design systems & workflows | System planning, architecture design |
| **Orchestrator** 🎼 | Multi-step automation | Complex workflow orchestration |
| **Analyst** 📊 | Debug & diagnose issues | Error analysis, troubleshooting |
| **Copywriter** ✍️ | Email & content generation | Cold emails, sales copy |
| **Researcher** 🔬 | Data research & analysis | Competitive intel, market research |

#### Added Routing Mode Toggle

- **⚡ Auto** - System automatically routes to best agent or N8N
- **🤖 Agent-Only** - Force execution via agent swarm (AI processing)

#### Visual Changes

**Before:**
- Generic "PAL Agent" avatar (P)
- No agent selection
- Direct API call to `/api/pal/chat`

**After:**
- Agent-specific emoji avatars (🏗️ 📊 ✍️ 🔬 🎼)
- Agent selection toolbar at top
- Routing mode toggle
- Integration with `/api/swarm/webhook`
- Shows routing info (phase, priority) in responses

---

## User Experience

### Starting a Chat Session

1. **Select Agent Type** - Click on desired agent button
2. **Set Routing Mode** - Toggle between Auto or Agent-Only
3. **Ask Question** - Type naturally, agent handles the rest

### Example Workflows

#### Architecture & Design
```
User: [Architect selected] Design a lead generation workflow
Agent: 🏗️ Analyzing requirements...
       Phase: Design
       Priority: 6.2 (queued)
       
       Recommended architecture:
       1. Trigger (Cron/Webhook)
       2. Lead Source (Apollo)
       3. Enrichment (Clay)
       ...
```

#### Content Generation
```
User: [Copywriter selected] Write 3 cold email variations for VP Sales
Agent: ✍️ Generating email variations...
       Phase: Development
       Priority: 5.8 (queued)
       
       Email 1 - Problem-First:
       Subject: Struggling with pipeline velocity?
       ...
```

#### Debugging
```
User: [Analyst selected] Why is my Apollo node failing with 429 errors?
Agent: 📊 Diagnosing error...
       Phase: Debugging
       Priority: 8.5 (immediate)
       
       Root Cause: Rate limiting
       Apollo API limit: 100 req/min
       Fix: Add 2s delay between calls
```

---

## Technical Integration

### API Flow

```
User Input (Frontend)
    ↓
ChatView.tsx
    ├─ selectedAgent: "architect"
    ├─ routingMode: "auto"
    ↓
POST /api/swarm/webhook
    {
      user_input: "Design workflow",
      agent_type_hint: "architect",
      routing_preference: "auto"
    }
    ↓
PAL Compiler (with agent hint override)
    ↓
NPAO Classifier (Phase + Priority)
    ↓
Integration Router (Agent or N8N)
    ↓
Agent Swarm Execution
    ↓
Response (with routing metadata)
    ↓
Display in Chat UI
```

### Modified Files

1. **`src/components/views/ChatView.tsx`**
   - Added agent selection state
   - Added routing mode toggle
   - Updated welcome message
   - Changed API endpoint to `/api/swarm/webhook`
   - Display agent-specific avatars
   - Show routing info in responses

2. **`src/lib/rostr/pal-compiler.ts`**
   - Added `agentTypeHint` parameter
   - Override agent type based on user selection
   - Map "architect" → "designer"

3. **`src/app/api/swarm/webhook/route.ts`**
   - Accept `agent_type_hint` from frontend
   - Pass hint to PAL compiler

---

## Agent Type Mappings

Frontend selection maps to agent swarm types:

| Frontend | Backend Agent Type |
|----------|-------------------|
| Architect | designer |
| Orchestrator | orchestrator |
| Analyst | analyst |
| Copywriter | copywriter |
| Researcher | researcher |

---

## UI Components

### Agent Selection Toolbar

```tsx
<div className="flex items-center gap-3">
  <span>Agent Type:</span>
  <button onClick={() => setSelectedAgent("architect")} 
          className={selectedAgent === "architect" ? "active" : ""}>
    🏗️ Architect
  </button>
  <button onClick={() => setSelectedAgent("analyst")}>
    📊 Analyst
  </button>
  {/* ... other agents */}
</div>
```

### Routing Mode Toggle

```tsx
<button onClick={() => setRoutingMode(mode === "auto" ? "agent-only" : "auto")}>
  {mode === "auto" ? "⚡ Auto" : "🤖 Agent-Only"}
</button>
```

### Agent Avatar Display

```tsx
{msg.role === "assistant" && (
  <div className="avatar">
    {AGENT_OPTIONS.find(a => a.value === msg.agentType)?.icon || "A"}
  </div>
)}
```

---

## Features

✅ **5 Specialized Agents** - Architecture, Orchestration, Analysis, Copywriting, Research  
✅ **Smart Routing** - Auto or Agent-Only modes  
✅ **Visual Agent Selection** - Click to switch agents  
✅ **Agent-Specific Avatars** - Emoji icons per agent type  
✅ **Routing Transparency** - Shows phase, priority, destination  
✅ **Seamless Integration** - Works with existing chat UI  
✅ **Phase-Aware** - Uses ROSTR 5D phase taxonomy  
✅ **Priority-Based** - 4D priority scoring  

---

## Example Usage

### 1. Architecture Design

**Agent:** 🏗️ Architect  
**Mode:** Auto  
**Input:** "Design a workflow for Apollo → Clay → HubSpot → Smartlead"

**Response:**
```
Phase: Design
Priority: 6.5 (queued)
Routed to: agent-swarm

Workflow Architecture:
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ Apollo  │──▶│  Clay   │──▶│ HubSpot │──▶│Smartlead│
│ Search  │   │ Enrich  │   │  CRM    │   │Sequence │
└─────────┘   └─────────┘   └─────────┘   └─────────┘

Nodes: 9 total (trigger, normalizer, dedupe, search, enrich, research, create, enroll, notify)
Estimated: 15-20 leads/hour
...
```

### 2. Email Copywriting

**Agent:** ✍️ Copywriter  
**Mode:** Agent-Only  
**Input:** "Write cold email for VP Sales about pipeline velocity"

**Response:**
```
Phase: Development
Priority: 5.8 (queued)
Routed to: agent-swarm

Subject: Cut your sales cycle by 30%?

Hey {{FirstName}},

I noticed {{Company}} recently expanded to {{City}}. Congrats!

Quick question: Is pipeline velocity keeping up with your growth?

We've helped 47 B2B teams like {{Company}} slash their sales cycle from 90 to 63 days.

Worth a 15-min chat?

Best,
{{YourName}}

---

Personalization Variables:
- {{FirstName}} - Prospect first name
- {{Company}} - Company name
- {{City}} - Recent expansion location
```

### 3. Debugging

**Agent:** 📊 Analyst  
**Mode:** Auto  
**Input:** "My Apollo node keeps failing with 429 errors"

**Response:**
```
Phase: Debugging
Priority: 8.5 (immediate)
Routed to: agent-swarm

Root Cause Analysis:

Error: 429 Too Many Requests
Symptom: Intermittent failures on Apollo node
Diagnosis: Hitting API rate limits

Apollo API Limits:
- Basic: 50 req/min
- Pro: 100 req/min
- Enterprise: 500 req/min

Current Workflow:
- Batch size: 50 leads
- No delay between calls
- Rate: ~60 req/min

Fix:
1. Add Wait node (2 seconds) before Apollo node
2. Reduce batch size to 25 leads
3. Enable retry with 5s backoff

Estimated Impact:
- Reduce throughput by 30%
- Eliminate 429 errors
- Success rate: 95% → 99.5%
```

---

## Updated Suggestions

**Before:**
- "I sell an AI sales tool to VP Sales..."
- "I'm an agency looking to generate leads..."

**After:**
- "Design a lead generation workflow architecture" (Architect)
- "Research top 10 B2B SaaS companies" (Researcher)
- "Write 3 cold email variations" (Copywriter)
- "Analyze why Apollo node fails with 429" (Analyst)
- "Build my workflow for B2B fintech" (Orchestrator)

---

## Routing Transparency

Every response now includes routing metadata:

```
*Routed to: agent-swarm (Development phase, priority: 6.5)*
```

Shows:
- **Destination** - agent-swarm or n8n
- **Phase** - PreD, Design, Development, Deployment, or Debugging
- **Priority Score** - 0-10 (immediate: ≥7.0, queued: 4.0-6.9, backlog: <4.0)

---

## Testing

### Test Agent Selection

```bash
npm run dev
```

1. Navigate to chat view
2. Select "Architect" agent
3. Ask: "Design a workflow"
4. Verify response shows 🏗️ avatar
5. Check routing info at bottom

### Test Routing Modes

**Auto Mode:**
- Research questions → agent-swarm
- CRM updates → n8n (if webhook provided)

**Agent-Only Mode:**
- Everything → agent-swarm
- Forces AI processing

### Test Agent Types

1. **Architect** - Ask for system design
2. **Analyst** - Ask to debug an error
3. **Copywriter** - Ask for email copy
4. **Researcher** - Ask for competitive intel
5. **Orchestrator** - Ask to build multi-step workflow

---

## Future Enhancements

### Phase 1 (Current) ✅
- Agent selection toolbar
- Routing mode toggle
- Agent-specific avatars
- Integration with swarm API

### Phase 2 (Next)
- [ ] Real-time agent status (load, capacity)
- [ ] Agent performance metrics display
- [ ] Multi-agent orchestration from UI
- [ ] Save agent preferences per project

### Phase 3 (Future)
- [ ] Custom agent creation
- [ ] Agent skill customization
- [ ] Advanced routing rules
- [ ] Agent collaboration (multiple agents on one task)

---

## Summary

**Integrated agent swarm into chat UI with:**

✅ 5 specialized agent types (Architect, Orchestrator, Analyst, Copywriter, Researcher)  
✅ Visual agent selection toolbar  
✅ Routing mode toggle (Auto vs Agent-Only)  
✅ Agent-specific emoji avatars  
✅ Routing transparency (phase, priority, destination)  
✅ Seamless API integration via `/api/swarm/webhook`  
✅ Updated suggestions for each agent type  

**Users can now:**
1. Select specialized agent for their task
2. Toggle routing between Auto and Agent-Only
3. See which agent is responding (emoji avatar)
4. Understand routing decisions (metadata)
5. Get phase-aware, priority-scored responses

**Ready to use!** Start `npm run dev` and test the new agent selection in chat view.
