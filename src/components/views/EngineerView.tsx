"use client";

import dynamic from "next/dynamic";

const AssistantChat = dynamic(
  () => import("@/components/chat/AssistantChat"),
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
        Loading chat...
      </div>
    ),
  }
);

export default function AnalystView() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <AssistantChat />
    </div>
  );
}
