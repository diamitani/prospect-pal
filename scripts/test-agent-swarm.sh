#!/bin/bash

# Agent Swarm Test Script
# Tests various routing modes and orchestration patterns

API_BASE="http://localhost:3000"

echo "🚀 Testing Agent Swarm System"
echo "================================"

# Test 1: Auto Routing - Research Task
echo ""
echo "Test 1: Auto Routing (Research Task)"
echo "Expected: Routes to Agent Swarm"
curl -X POST "$API_BASE/api/swarm/webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "user_input": "Research the top 5 B2B SaaS companies in marketing automation space",
    "project_id": "test_proj_001",
    "user_id": "test_user",
    "routing_preference": "auto"
  }' | jq .

echo ""
echo "Press Enter to continue..."
read

# Test 2: Agent-Only Mode
echo ""
echo "Test 2: Agent-Only Mode (Email Generation)"
echo "Expected: Forces agent execution"
curl -X POST "$API_BASE/api/swarm/webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "user_input": "Write a cold email for VP of Sales about improving pipeline velocity",
    "project_id": "test_proj_001",
    "user_id": "test_user",
    "routing_preference": "agent-only"
  }' | jq .

echo ""
echo "Press Enter to continue..."
read

# Test 3: Check Swarm Status
echo ""
echo "Test 3: Swarm Status"
echo "Expected: Shows agents and queue"
curl -X GET "$API_BASE/api/swarm/webhook" | jq .

echo ""
echo "Press Enter to continue..."
read

# Test 4: Parallel Orchestration
echo ""
echo "Test 4: Parallel Orchestration (3 emails)"
echo "Expected: Generates 3 emails simultaneously"
curl -X POST "$API_BASE/api/swarm/orchestrate" \
  -H "Content-Type: application/json" \
  -d '{
    "pattern": "parallel",
    "project_id": "test_proj_001",
    "tasks": [
      "Write cold email for VP of Sales",
      "Write cold email for CMO",
      "Write cold email for CTO"
    ]
  }' | jq .

echo ""
echo "Press Enter to continue..."
read

# Test 5: Sequential Orchestration
echo ""
echo "Test 5: Sequential Orchestration (Research Pipeline)"
echo "Expected: Runs 3 tasks in sequence"
curl -X POST "$API_BASE/api/swarm/orchestrate" \
  -H "Content-Type: application/json" \
  -d '{
    "pattern": "sequential",
    "project_id": "test_proj_001",
    "tasks": [
      "Find 10 companies matching ICP: B2B SaaS, 50-200 employees",
      "Analyze their tech stack and recent funding",
      "Generate priority ranking with reasoning"
    ]
  }' | jq .

echo ""
echo "================================"
echo "✅ Tests Complete"
echo ""
echo "To test specific task status:"
echo "  curl http://localhost:3000/api/swarm/webhook?task_id=TASK_ID | jq ."
echo ""
echo "To test N8N integration:"
echo "  Set n8n_webhook_url in request body"
echo "  Use routing_preference: 'n8n-only' or 'hybrid'"
