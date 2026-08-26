"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Edge,
  MarkerType,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import N8nNodeComponent, { type N8nNodeData } from "./N8nNode";
import type { N8nNode } from "@/lib/workflow-generator";

interface WorkflowCanvasProps {
  nodes: N8nNode[];
  connections: [string, string][];
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string | null) => void;
}

const H_GAP = 300;
const V_GAP = 120;

const nodeTypes = {
  n8nNode: N8nNodeComponent,
};

const CATEGORY_COLORS: Record<string, string> = {
  trigger: "#FF9500",
  api: "#3B82F6",
  crm: "#FF7A59",
  enrichment: "#8B5CF6",
  ai: "#7C3AED",
  logic: "#6B7280",
  messaging: "#4ADE80",
  sequencer: "#06B6D4",
  output: "#10B981",
};

export default function WorkflowCanvas({
  nodes: n8nNodes,
  connections,
  selectedNodeId,
  onNodeSelect,
}: WorkflowCanvasProps) {
  const nodes = useMemo(() => {
    return n8nNodes.map((node, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      return {
        id: node.id,
        type: "n8nNode",
        position: { x: col * H_GAP + 60, y: row * V_GAP + 60 },
        data: {
          label: node.label,
          subtitle: node.subtitle,
          icon: node.icon,
          category: node.category,
          type: node.type,
          config: node.config,
        } as N8nNodeData,
        selected: selectedNodeId === node.id,
      };
    });
  }, [n8nNodes, selectedNodeId]);

  const edges: Edge[] = useMemo(() => {
    return connections.map(([source, target], index) => {
      const sourceNode = n8nNodes.find((n) => n.id === source);
      const edgeColor = sourceNode
        ? CATEGORY_COLORS[sourceNode.category] || "#6B7280"
        : "#6B7280";

      return {
        id: `e${index}`,
        source,
        target,
        type: "smoothstep",
        animated: false,
        style: {
          stroke: edgeColor,
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColor,
          width: 20,
          height: 20,
        },
      };
    });
  }, [connections, n8nNodes]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      onNodeSelect(node.id);
    },
    [onNodeSelect]
  );

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  return (
    <div style={{ width: "100%", height: "100%", background: "#ffffff" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#e0e0e0"
        />
        <Controls
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        />
      </ReactFlow>
    </div>
  );
}
