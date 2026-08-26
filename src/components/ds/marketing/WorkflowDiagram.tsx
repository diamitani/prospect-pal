"use client";

import { Icon, IconProps } from "../core/Icon";

interface WorkflowNode {
  id: number;
  title: string;
  subtitle?: string;
  color: string;
  icon: IconProps["name"];
}

const WORKFLOW_NODES: WorkflowNode[] = [
  { id: 1, title: "Schedule Trigger", subtitle: "Daily cron", color: "#FF9500", icon: "Clock" },
  { id: 2, title: "Set Yesterday Range", subtitle: "(Deactivated)", color: "#6B7280", icon: "Braces" },
  { id: 3, title: "Get HubSpot Companies", subtitle: "Intent", color: "#FF7A59", icon: "Database" },
  { id: 4, title: "Split Each Company", subtitle: "", color: "#FF9500", icon: "GitBranch" },
  { id: 5, title: "Edit Fields", subtitle: "manual", color: "#3B82F6", icon: "Pencil" },
  { id: 6, title: "HTTP Request", subtitle: "AmpleMarket API", color: "#8B5CF6", icon: "Globe" },
  { id: 7, title: "Split Out1", subtitle: "", color: "#FF9500", icon: "GitBranch" },
  { id: 8, title: "Normalize Linkedin", subtitle: "", color: "#6B7280", icon: "Braces" },
  { id: 9, title: "normalize contacts", subtitle: "", color: "#6B7280", icon: "Braces" },
  { id: 10, title: "Split Out2", subtitle: "", color: "#FF9500", icon: "GitBranch" },
  { id: 11, title: "Filter Linkedin URLs", subtitle: "", color: "#6B7280", icon: "ListFilter" },
  { id: 12, title: "Build Amplemarket", subtitle: "", color: "#6B7280", icon: "Braces" },
];

interface WorkflowDiagramProps {
  nodes?: WorkflowNode[];
  title?: string;
}

export function WorkflowDiagram({ nodes = WORKFLOW_NODES, title }: WorkflowDiagramProps) {
  return (
    <div
      style={{
        background: "#0d0d0d",
        borderRadius: "var(--radius-xl)",
        border: "1px solid #2a2a2a",
        overflow: "hidden",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          padding: "10px 16px",
          borderBottom: "1px solid #2a2a2a",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#27ca40" }} />
          </div>
          <span
            style={{
              marginLeft: 10,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "#808080",
            }}
          >
            {title || "prospect-automation-engine.n8n.json"}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            background: "#1a1a1a",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            color: "#4ade80",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
          {nodes.length} nodes
        </div>
      </div>

      {/* Canvas with grid */}
      <div
        style={{
          padding: "32px 24px",
          overflowX: "auto",
          background: `
            linear-gradient(90deg, #1a1a1a 1px, transparent 1px),
            linear-gradient(#1a1a1a 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            minWidth: "max-content",
          }}
        >
          {/* Trigger dot */}
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#ff5f56",
              boxShadow: "0 0 12px #ff5f5680",
              marginRight: 12,
              flexShrink: 0,
            }}
          />

          {nodes.map((node, index) => (
            <div key={node.id} style={{ display: "flex", alignItems: "center" }}>
              {/* Node */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    background: "#1f1f1f",
                    border: `2px solid ${node.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <Icon name={node.icon} size={22} color={node.color} />
                  {/* Connection dots */}
                  {index > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        left: -6,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#3a3a3a",
                        border: "2px solid #2a2a2a",
                      }}
                    />
                  )}
                  {index < nodes.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        right: -6,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#3a3a3a",
                        border: "2px solid #2a2a2a",
                      }}
                    />
                  )}
                </div>
                <div style={{ textAlign: "center", maxWidth: 90 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#e0e0e0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {node.title}
                  </div>
                  {node.subtitle && (
                    <div
                      style={{
                        fontSize: 9,
                        color: "#707070",
                        marginTop: 2,
                      }}
                    >
                      {node.subtitle}
                    </div>
                  )}
                </div>
              </div>

              {/* Connection line */}
              {index < nodes.length - 1 && (
                <div
                  style={{
                    width: 40,
                    height: 2,
                    background: "linear-gradient(90deg, #3a3a3a, #4a4a4a, #3a3a3a)",
                    position: "relative",
                    marginTop: -24,
                  }}
                >
                  {/* Animated dot */}
                  <div
                    style={{
                      position: "absolute",
                      top: -3,
                      left: 0,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: node.color,
                      boxShadow: `0 0 8px ${node.color}80`,
                      animation: "flowDot 2s ease-in-out infinite",
                      animationDelay: `${index * 0.15}s`,
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "10px 16px",
          borderTop: "1px solid #2a2a2a",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 11,
          color: "#606060",
        }}
      >
        <span>n8n workflow engine</span>
        <span>Scroll to explore all nodes</span>
      </div>

      <style jsx global>{`
        @keyframes flowDot {
          0% {
            left: 0;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default WorkflowDiagram;
