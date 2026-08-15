"use client";

import { useEffect, useRef, useState } from "react";
import type { N8nNode } from "@/lib/workflow-generator";

interface N8nCanvasProps {
  nodes: N8nNode[];
  connections: [string, string][];
  activeNodeId?: string | null;
  isBuilding?: boolean;
}

const CATEGORY_COLORS: Record<string, { bg: string; border: string; badge: string }> = {
  trigger:    { bg: "#1c1428", border: "#F59E0B", badge: "#F59E0B22" },
  api:        { bg: "#0f1929", border: "#3B82F6", badge: "#3B82F622" },
  crm:        { bg: "#1a0e0a", border: "#FF7A59", badge: "#FF7A5922" },
  enrichment: { bg: "#160d21", border: "#8B5CF6", badge: "#8B5CF622" },
  ai:         { bg: "#14102a", border: "#7C3AED", badge: "#7C3AED22" },
  logic:      { bg: "#111215", border: "#6B7280", badge: "#6B728022" },
  messaging:  { bg: "#0a1f0f", border: "#4ADE80", badge: "#4ADE8022" },
  sequencer:  { bg: "#041520", border: "#06B6D4", badge: "#06B6D422" },
  output:     { bg: "#071a12", border: "#10B981", badge: "#10B98122" },
};

const NODE_W = 220;
const NODE_H = 72;
const H_GAP  = 260;
const V_GAP  = 100;

// Layout algorithm — position nodes in a left-to-right flow with wrap
function layoutNodes(
  nodes: N8nNode[],
  connections: [string, string][]
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  // Topological sort based on connections
  const visited = new Set<string>();
  const order: string[] = [];

  const visit = (id: string) => {
    if (visited.has(id)) return;
    visited.add(id);
    const deps = connections.filter(([, to]) => to === id).map(([from]) => from);
    deps.forEach(visit);
    order.push(id);
  };

  nodes.forEach((n) => visit(n.id));

  // Assign columns (depth from root)
  const depth = new Map<string, number>();
  order.forEach((id) => {
    const parents = connections.filter(([, to]) => to === id).map(([from]) => from);
    const maxParentDepth = parents.length > 0
      ? Math.max(...parents.map((p) => depth.get(p) ?? 0))
      : -1;
    depth.set(id, maxParentDepth + 1);
  });

  // Group by column, then row within column
  const cols = new Map<number, string[]>();
  depth.forEach((d, id) => {
    if (!cols.has(d)) cols.set(d, []);
    cols.get(d)!.push(id);
  });

  // Total width wrap: at most 4 columns per row
  const COL_WRAP = 4;
  let finalRow = 0;
  let finalCol = 0;

  Array.from(cols.entries())
    .sort(([a], [b]) => a - b)
    .forEach(([, ids]) => {
      ids.forEach((id, rowIdx) => {
        const col = finalCol + (rowIdx % 1); // keep same col for now
        const row = finalRow;
        positions.set(id, { x: col * H_GAP + 40, y: row * (NODE_H + V_GAP) + 40 });
        finalRow++;
      });
      finalCol++;
      finalRow = 0;
    });

  // Override: simple linear layout for clarity
  nodes.forEach((node, i) => {
    const col = i % COL_WRAP;
    const row = Math.floor(i / COL_WRAP);
    positions.set(node.id, {
      x: col * H_GAP + 40,
      y: row * (NODE_H + V_GAP + 30) + 60,
    });
  });

  return positions;
}

// Draw bezier curve between two points
function Connector({ x1, y1, x2, y2, color, animated }: {
  x1: number; y1: number; x2: number; y2: number;
  color: string; animated: boolean;
}) {
  const mx = (x1 + x2) / 2;
  const d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  return (
    <g>
      {/* Shadow / glow */}
      <path d={d} fill="none" stroke={color} strokeWidth={4} strokeOpacity={0.15} />
      {/* Main line */}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeOpacity={0.7}
        strokeDasharray={animated ? "6 4" : "none"}
        style={animated ? { animation: "dash 0.8s linear infinite" } : undefined}
      />
      {/* Arrow head */}
      <circle cx={x2} cy={y2} r={3} fill={color} opacity={0.9} />
    </g>
  );
}

export default function N8nCanvas({
  nodes,
  connections,
  activeNodeId,
  isBuilding = false,
}: N8nCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 500 });

  const positions = layoutNodes(nodes, connections);

  // Compute canvas bounds
  const maxX = Math.max(...Array.from(positions.values()).map((p) => p.x + NODE_W), 800);
  const maxY = Math.max(...Array.from(positions.values()).map((p) => p.y + NODE_H), 400);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-auto"
      style={{ background: "#111118" }}
    >
      <style>{`
        @keyframes dash { to { stroke-dashoffset: -20; } }
        @keyframes node-appear {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 0 currentColor; }
          50%       { box-shadow: 0 0 0 4px currentColor; }
        }
      `}</style>

      {/* Grid dots background */}
      <svg
        width={maxX + 80}
        height={maxY + 80}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="#ffffff10" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Connections */}
        {connections.map(([fromId, toId], i) => {
          const from = positions.get(fromId);
          const to   = positions.get(toId);
          if (!from || !to) return null;

          const fromNode = nodes.find((n) => n.id === fromId);
          const color = fromNode ? CATEGORY_COLORS[fromNode.category]?.border || "#555" : "#555";

          return (
            <Connector
              key={i}
              x1={from.x + NODE_W}
              y1={from.y + NODE_H / 2}
              x2={to.x}
              y2={to.y + NODE_H / 2}
              color={color}
              animated={activeNodeId === toId}
            />
          );
        })}
      </svg>

      {/* Node Cards */}
      {nodes.map((node, i) => {
        const pos = positions.get(node.id);
        if (!pos) return null;

        const colors = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.api;
        const isActive = activeNodeId === node.id;
        const isDone   = nodes.findIndex((n) => n.id === activeNodeId) > i;

        return (
          <div
            key={node.id}
            style={{
              position: "absolute",
              left: pos.x,
              top:  pos.y,
              width: NODE_W,
              height: NODE_H,
              background: colors.bg,
              border: `1.5px solid ${colors.border}${isActive ? "ff" : isDone ? "99" : "55"}`,
              borderRadius: 10,
              padding: "10px 12px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: isActive
                ? `0 0 0 2px ${colors.border}44, 0 4px 20px ${colors.border}22`
                : isDone
                ? `0 2px 8px rgba(0,0,0,0.4)`
                : `0 2px 4px rgba(0,0,0,0.3)`,
              animation: `node-appear 0.4s ease forwards`,
              animationDelay: `${i * 0.08}s`,
              opacity: 0,
              cursor: "default",
              transition: "box-shadow 0.3s, border-color 0.3s",
            }}
          >
            {/* Left accent bar */}
            <div style={{
              position: "absolute", left: 0, top: 8, bottom: 8,
              width: 3, borderRadius: "0 2px 2px 0",
              background: colors.border,
              opacity: isDone ? 1 : isActive ? 1 : 0.5,
            }} />

            {/* Icon */}
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: colors.badge,
              border: `1px solid ${colors.border}33`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, flexShrink: 0,
            }}>
              {node.icon}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 12, fontWeight: 600,
                color: "#f0f0f0",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {node.label}
              </div>
              <div style={{
                fontSize: 10, color: "#888",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                marginTop: 2,
              }}>
                {node.subtitle}
              </div>
            </div>

            {/* Status indicator */}
            <div style={{ flexShrink: 0 }}>
              {isActive && isBuilding ? (
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: colors.border,
                  animation: "pulse 1s ease-in-out infinite",
                }} />
              ) : isDone ? (
                <div style={{ color: "#4ADE80", fontSize: 11, fontWeight: 700 }}>✓</div>
              ) : (
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#333" }} />
              )}
            </div>
          </div>
        );
      })}

      {/* Building indicator overlay */}
      {isBuilding && nodes.length === 0 && (
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            border: "3px solid #333", borderTopColor: "#7C3AED",
            animation: "spin 0.8s linear infinite",
          }} />
          <div style={{ color: "#666", fontSize: 13 }}>Building workflow...</div>
        </div>
      )}

      {/* Empty state */}
      {!isBuilding && nodes.length === 0 && (
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 8,
        }}>
          <div style={{ fontSize: 32, opacity: 0.3 }}>⬡</div>
          <div style={{ color: "#444", fontSize: 13 }}>Workflow canvas will appear here</div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(1.5); } }
      `}</style>
    </div>
  );
}
