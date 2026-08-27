"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const ChatView = dynamic(
  () => import("@/components/views/ChatView"),
  {
    ssr: false,
    loading: () => (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: "var(--text-muted)",
        fontSize: "var(--text-body-sm)",
      }}>
        Loading Agent Swarm...
      </div>
    ),
  }
);

export default function EngineerView() {
  const [outputs, setOutputs] = useState<Record<string, unknown> | null>(null);

  const handleOutputReady = (output: Record<string, unknown>) => {
    setOutputs(output);
    console.log('Workflow outputs ready:', output);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <ChatView projectId={null} onOutputReady={handleOutputReady} />
    </div>
  );
}
