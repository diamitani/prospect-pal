"use client";

import { useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import DashboardHome from "@/components/views/DashboardHome";
import BuilderView from "@/components/views/BuilderView";
import OutputsView from "@/components/views/OutputsView";
import ProjectsView from "@/components/views/ProjectsView";
import SettingsView from "@/components/views/SettingsView";

export type View = "home" | "builder" | "outputs" | "projects" | "settings";

export default function DashboardPage() {
  const [view,        setView]        = useState<View>("home");
  const [projectId,   setProjectId]   = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [output,      setOutput]      = useState<Record<string, unknown> | null>(null);

  const handleOutputReady = useCallback((out: Record<string, unknown>) => {
    setOutput(out);
    setView("outputs");
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#fafaf8" }}>
      <Sidebar currentView={view} onViewChange={setView} projectName={projectName} />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <TopBar view={view} projectName={projectName} userName="Alex" />
        <main style={{ flex: 1, overflow: "hidden" }}>
          {view === "home"     && <DashboardHome userName="Alex" onNavigate={setView} onNewProject={() => setView("builder")} />}
          {view === "builder"  && <BuilderView onOutputReady={handleOutputReady} />}
          {view === "outputs"  && <OutputsView palOutput={output} projectId={projectId} />}
          {view === "projects" && <ProjectsView onSelect={(id, name) => { setProjectId(id); setProjectName(name); setView("builder"); }} />}
          {view === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
