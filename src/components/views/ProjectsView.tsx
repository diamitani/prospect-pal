"use client";

import { useState, useEffect } from "react";

interface Project { id: string; name: string; description?: string; status: string; createdAt: string; }
interface ProjectsViewProps { onSelect: (id: string, name: string) => void; }

export default function ProjectsView({ onSelect }: ProjectsViewProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d: { projects: Project[] }) => { setProjects(d.projects || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statusBadge = (s: string) => {
    if (s === "deployed")    return <span className="badge-green">Deployed</span>;
    if (s === "configured")  return <span className="badge-brand">Configured</span>;
    return <span className="badge-gray">Draft</span>;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-ink text-lg">All Campaigns</h2>
        <button className="btn-brand">+ New Campaign</button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => (
            <div key={i} className="bg-surface-100 rounded-2xl h-20 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-surface-200 rounded-2xl p-12 text-center shadow-card">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="font-bold text-ink mb-1">No campaigns yet</h3>
          <p className="text-sm text-ink-secondary mb-5">Start your first campaign using the guided wizard or chat with PAL.</p>
          <button className="btn-brand">Launch Wizard</button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p.id, p.name)}
              className="w-full text-left bg-white border border-surface-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-ink">{p.name}</div>
                  <div className="text-sm text-ink-secondary mt-0.5 line-clamp-1">{p.description || "No description"}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {statusBadge(p.status)}
                  <span className="text-xs text-ink-muted">{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
