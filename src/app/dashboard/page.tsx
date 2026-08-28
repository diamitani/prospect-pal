"use client";

import { useState, useCallback, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import DashboardHome from "@/components/views/DashboardHome";
import StudioView from "@/components/views/StudioView";
import WizardView from "@/components/views/WizardView";
import BuilderView from "@/components/views/BuilderView";
import OutputsView from "@/components/views/OutputsView";
import AnalystView from "@/components/views/AnalystView";
import SettingsView from "@/components/views/SettingsView";
import CoreSdrView from "@/components/views/CoreSdrView";
import BlueprintsView from "@/components/views/ProjectsView";
import { View } from "@/types/app";
import { IntakeData } from "@/components/views/WizardView";

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
  const [wizardData, setWizardData] = useState<IntakeData | null>(null);

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
    setView("builder");
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
              onNewProject={() => setView("studio")}
            />
          )}
          {view === "studio" && <StudioView onComplete={() => setView("outputs")} />}
          {view === "wizard" && <WizardView onComplete={(data) => { setWizardData(data); setView("builder"); }} />}
          {view === "builder" && <BuilderView wizardData={wizardData} onCompiled={() => setView("outputs")} />}
          {view === "outputs" && <OutputsView />}
          {view === "analyst" && <AnalystView />}
          {view === "core-sdr" && <CoreSdrView />}
          {view === "blueprints" && <BlueprintsView />}
          {view === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
