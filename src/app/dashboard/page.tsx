"use client";

import { useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import DashboardHome from "@/components/views/DashboardHome";
import BuilderView from "@/components/views/BuilderView";
import WizardView from "@/components/views/WizardView";
import OutputsView from "@/components/views/OutputsView";
import ScriptsStudioView from "@/components/views/ScriptsStudioView";
import SignalsLeadFinderView from "@/components/views/SignalsLeadFinderView";
import AnalystView from "@/components/views/AnalystView";
import AcademyView from "@/components/views/AcademyView";
import ProjectsView from "@/components/views/ProjectsView";
import SettingsView from "@/components/views/SettingsView";
import { View } from "@/types/app";

export default function DashboardPage() {
  const [view, setView] = useState<View>("home");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [output, setOutput] = useState<Record<string, unknown> | null>(null);

  const handleOutputReady = useCallback((out: Record<string, unknown>) => {
    setOutput(out);
    setView("outputs");
  }, []);

  const handleWizardComplete = useCallback((id: string, name: string) => {
    setProjectId(id);
    setProjectName(name);
    setView("builder");
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#fafaf8" }}>
      <Sidebar currentView={view} onViewChange={setView} projectName={projectName} />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <TopBar view={view} projectName={projectName} userName="Alex Rivera" />
        <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {view === "home" && (
            <DashboardHome
              userName="Alex"
              onNavigate={setView}
              onNewProject={() => setView("builder")}
            />
          )}
          {view === "builder" && <BuilderView onOutputReady={handleOutputReady} />}
          {view === "wizard" && <WizardView onComplete={handleWizardComplete} />}
          {view === "outputs" && <OutputsView palOutput={output} projectId={projectId} />}
          {view === "scripts" && <ScriptsStudioView />}
          {view === "signals" && <SignalsLeadFinderView />}
          {view === "analyst" && <AnalystView />}
          {view === "academy" && <AcademyView />}
          {view === "projects" && (
            <ProjectsView
              onSelect={(id, name) => {
                setProjectId(id);
                setProjectName(name);
                setView("builder");
              }}
            />
          )}
          {view === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
