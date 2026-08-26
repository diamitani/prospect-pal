"use client";

import { useState, useCallback, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import DashboardHome from "@/components/views/DashboardHome";
import CampaignsView from "@/components/views/CampaignsView";
import WorkflowsView from "@/components/views/WorkflowsView";
import CanvasView from "@/components/views/CanvasView";
import EngineerView from "@/components/views/EngineerView";
import SettingsView from "@/components/views/SettingsView";
import { View } from "@/types/app";

interface UserSession {
  id: string;
  email: string;
  name: string;
  plan: "free" | "pro" | "agency";
}

export default function DashboardPage() {
  const [view, setView] = useState<View>("home");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current user session
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch session:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSelectCampaign = useCallback((id: string, name: string) => {
    setProjectId(id);
    setProjectName(name);
    setView("canvas");
  }, []);

  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const firstName = userName.split(" ")[0];

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div style={{ color: "var(--text-muted)" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--surface-page)" }}>
      <Sidebar
        currentView={view}
        onViewChange={setView}
        projectName={projectName}
        userName={userName}
        userEmail={userEmail}
      />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <TopBar view={view} projectName={projectName} userName={userName} />
        <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {view === "home" && (
            <DashboardHome
              userName={firstName}
              onNavigate={setView}
              onNewProject={() => setView("campaigns")}
            />
          )}
          {view === "campaigns" && (
            <CampaignsView onSelectCampaign={handleSelectCampaign} />
          )}
          {view === "workflows" && <WorkflowsView />}
          {view === "canvas" && <CanvasView projectId={projectId} projectName={projectName} />}
          {view === "engineer" && <EngineerView />}
          {view === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
