/**
 * Agent Swarm API Examples
 * TypeScript/JavaScript usage examples
 */

// ============================================================================
// Example 1: Simple Task Submission (Auto-Route)
// ============================================================================

async function example1_autoRoute() {
  const response = await fetch("http://localhost:3000/api/swarm/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_input: "Research the top 10 SaaS companies in marketing automation",
      project_id: "proj_123",
      user_id: "user_456",
      routing_preference: "auto", // System decides
    }),
  });

  const result = await response.json();
  console.log("Phase:", result.phase);
  console.log("Priority:", result.priority);
  console.log("Routed to:", result.routing.destination);
  console.log("Result:", result.result);
}

// ============================================================================
// Example 2: Force Agent Swarm Execution
// ============================================================================

async function example2_agentOnly() {
  const response = await fetch("http://localhost:3000/api/swarm/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_input:
        "Write 3 variations of a cold email for VP of Sales about pipeline velocity",
      routing_preference: "agent-only", // Force agent swarm
    }),
  });

  const result = await response.json();
  console.log("Task ID:", result.result.task_id);
  console.log("Status:", result.result.status);
  console.log("Output:", result.result.result?.output);
}

// ============================================================================
// Example 3: N8N Integration (CRM Update)
// ============================================================================

async function example3_n8nOnly() {
  const response = await fetch("http://localhost:3000/api/swarm/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_input: "Update contact in HubSpot with new lead score",
      routing_preference: "n8n-only",
      n8n_webhook_url: "https://n8n.example.com/webhook/hubspot-update",
    }),
  });

  const result = await response.json();
  console.log("N8N Success:", result.result.success);
  console.log("N8N Response:", result.result.response);
}

// ============================================================================
// Example 4: Hybrid Mode (Research + Enroll)
// ============================================================================

async function example4_hybrid() {
  const response = await fetch("http://localhost:3000/api/swarm/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_input:
        "Research Acme Corp and enroll key decision makers in Q1 outbound campaign",
      routing_preference: "hybrid", // Use both
      n8n_webhook_url: "https://n8n.example.com/webhook/enroll-sequence",
    }),
  });

  const result = await response.json();
  console.log("Agent Result:", result.result.agent_result);
  console.log("N8N Result:", result.result.n8n_result);
}

// ============================================================================
// Example 5: Parallel Orchestration (Email Generation)
// ============================================================================

async function example5_parallel() {
  const response = await fetch("http://localhost:3000/api/swarm/orchestrate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pattern: "parallel", // Run simultaneously
      project_id: "proj_123",
      tasks: [
        {
          user_input: "Write cold email for VP of Sales",
          context: { pain_point: "low pipeline velocity" },
        },
        {
          user_input: "Write cold email for CMO",
          context: { pain_point: "lead quality issues" },
        },
        {
          user_input: "Write cold email for CEO",
          context: { pain_point: "revenue growth" },
        },
      ],
    }),
  });

  const result = await response.json();
  console.log("Orchestration ID:", result.orchestration_id);
  console.log("Status:", result.status);

  result.tasks.forEach((task: any, i: number) => {
    console.log(`\nTask ${i + 1}:`);
    console.log("  Phase:", task.phase);
    console.log("  Status:", task.status);
    console.log("  Output:", task.result?.output?.substring(0, 100) + "...");
  });
}

// ============================================================================
// Example 6: Sequential Pipeline (Research → Analyze → Report)
// ============================================================================

async function example6_sequential() {
  const response = await fetch("http://localhost:3000/api/swarm/orchestrate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pattern: "sequential", // Run in order
      project_id: "proj_123",
      tasks: [
        "Find 20 companies matching ICP: B2B SaaS, 50-200 employees, Series A-B",
        "Enrich each company with funding, tech stack, and recent news",
        "Score each company for fit (0-100) based on ICP criteria",
        "Generate top 10 priority list with reasoning for each",
      ],
    }),
  });

  const result = await response.json();
  console.log("Pipeline Status:", result.status);

  result.tasks.forEach((task: any, i: number) => {
    console.log(`\nStep ${i + 1}:`);
    console.log("  Status:", task.status);
    console.log("  Duration:", task.result?.duration_ms, "ms");
  });
}

// ============================================================================
// Example 7: Check Task Status
// ============================================================================

async function example7_checkStatus(taskId: string) {
  const response = await fetch(
    `http://localhost:3000/api/swarm/webhook?task_id=${taskId}`
  );

  const result = await response.json();
  console.log("Task Status:", result.status);
  console.log("Phase:", result.phase);
  console.log("Priority:", result.priority);

  if (result.status === "completed") {
    console.log("Result:", result.result);
  } else if (result.status === "failed") {
    console.log("Error:", result.error);
  } else {
    console.log("Task is", result.status);
  }
}

// ============================================================================
// Example 8: Monitor Swarm Health
// ============================================================================

async function example8_swarmStatus() {
  const response = await fetch("http://localhost:3000/api/swarm/webhook");
  const status = await response.json();

  console.log("Queue Size:", status.queue_size);
  console.log("Running Tasks:", status.running_tasks);
  console.log("Completed Tasks:", status.completed_tasks);

  console.log("\nAgents:");
  status.agents.forEach((agent: any) => {
    console.log(`\n  ${agent.name}:`);
    console.log(`    Load: ${agent.current_load}/${agent.max_capacity}`);
    console.log(`    Completed: ${agent.performance.tasks_completed}`);
    console.log(
      `    Avg Duration: ${agent.performance.avg_completion_minutes.toFixed(1)}m`
    );
    console.log(
      `    Success Rate: ${(agent.performance.success_rate * 100).toFixed(1)}%`
    );
  });
}

// ============================================================================
// Example 9: Combine Agent Swarm + Existing Orchestrator
// ============================================================================

async function example9_fullPipeline() {
  // Phase 1: Use agent swarm for ICP research
  const researchResponse = await fetch(
    "http://localhost:3000/api/swarm/webhook",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_input: `Research target ICP and generate campaign plan:
        - Industry focus
        - Company size
        - Key personas and pain points
        - Buying signals to track
        - Recommended tool stack`,
        routing_preference: "agent-only",
      }),
    }
  );

  const research = await researchResponse.json();
  console.log("Research Complete:", research.result.result?.output);

  // Phase 2: Use existing orchestrator to build n8n workflow
  const workflowResponse = await fetch(
    "http://localhost:3000/api/automation/start",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: "Your Company",
        campaignTitle: "Q1 Outbound",
        campaignIcp: research.result.result?.output, // Pass research findings
        userPersona: "VP of Sales, Director of Revenue",
        companyProduct: "Your product",
        companyBackground: "Your background",
        targetSignals: "Funding, hiring, expansion",
        toolStack: {
          leadSource: "apollo",
          enrichment: ["clay"],
          crm: "hubspot",
          sequencer: "smartlead",
        },
      }),
    }
  );

  const workflow = await workflowResponse.json();
  console.log("Workflow ID:", workflow.workflowId);
  console.log("Status URL:", workflow.statusUrl);
}

// ============================================================================
// Example 10: Error Handling
// ============================================================================

async function example10_errorHandling() {
  try {
    const response = await fetch("http://localhost:3000/api/swarm/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_input: "Test task",
        routing_preference: "auto",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("API Error:", error);
      return;
    }

    const result = await response.json();

    if (result.result.status === "failed") {
      console.error("Task Failed:", result.result.error);
      return;
    }

    console.log("Success:", result);
  } catch (error) {
    console.error("Network Error:", error);
  }
}

// ============================================================================
// Example 11: Polling for Async Tasks
// ============================================================================

async function example11_pollTask() {
  // Submit task
  const submitResponse = await fetch(
    "http://localhost:3000/api/swarm/webhook",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_input: "Long running research task",
        routing_preference: "agent-only",
      }),
    }
  );

  const submit = await submitResponse.json();
  const taskId = submit.result.task_id;

  console.log("Task submitted:", taskId);

  // Poll for completion
  let completed = false;
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes

  while (!completed && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5s

    const statusResponse = await fetch(
      `http://localhost:3000/api/swarm/webhook?task_id=${taskId}`
    );
    const status = await statusResponse.json();

    console.log(`Status: ${status.status} (attempt ${attempts + 1})`);

    if (status.status === "completed" || status.status === "failed") {
      completed = true;
      console.log("Final result:", status.result);
    }

    attempts++;
  }

  if (!completed) {
    console.log("Task timed out");
  }
}

// ============================================================================
// Export examples
// ============================================================================

export {
  example1_autoRoute,
  example2_agentOnly,
  example3_n8nOnly,
  example4_hybrid,
  example5_parallel,
  example6_sequential,
  example7_checkStatus,
  example8_swarmStatus,
  example9_fullPipeline,
  example10_errorHandling,
  example11_pollTask,
};
