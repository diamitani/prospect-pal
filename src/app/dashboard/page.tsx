"use client";

import { useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import DashboardHome from "@/components/views/DashboardHome";
import CampaignsView from "@/components/views/CampaignsView";
import WorkflowsView from "@/components/views/WorkflowsView";
import CanvasView from "@/components/views/CanvasView";
import AnalystView from "@/components/views/AnalystView";
import SettingsView from "@/components/views/SettingsView";
import { View } from "@/types/app";

export default function DashboardPage() {
  const [view, setView] = useState<View>("home");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);

  const handleSelectCampaign = useCallback((id: string, name: string) => {
    setProjectId(id);
    setProjectName(name);
    setView("canvas");
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--surface-page)" }}>
      <Sidebar currentView={view} onViewChange={setView} projectName={projectName} />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <TopBar view={view} projectName={projectName} userName="Alex Rivera" />
        <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {view === "home" && (
            <DashboardHome
              userName="Alex"
              onNavigate={setView}
              onNewProject={() => setView("campaigns")}
            />
          )}
          {view === "campaigns" && (
            <CampaignsView onSelectCampaign={handleSelectCampaign} />
          )}
          {view === "workflows" && <WorkflowsView />}
          {view === "canvas" && <CanvasView projectId={projectId} projectName={projectName} />}
          {view === "analyst" && <AnalystView />}
          {view === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
