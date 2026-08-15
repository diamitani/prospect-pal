"use client";

import { View } from "@/types/app";

interface DashboardHomeProps {
  userName: string;
  onNavigate: (view: View) => void;
  onNewProject: () => void;
}

const quickActions = [
  {
    id: "builder",
    icon: "⚡",
    title: "Build New Workflow",
    description: "Walk through tools, ICP, and generate your n8n workflow",
    color: "bg-brand-700 text-white",
    iconBg: "bg-brand-600",
    view: "builder" as View,
  },
  {
    id: "outputs",
    icon: "↓",
    title: "Download Outputs",
    description: "Get your n8n JSON, deploy guide & email template",
    color: "bg-white border border-surface-200",
    iconBg: "bg-surface-100",
    view: "outputs" as View,
  },
  {
    id: "projects",
    icon: "◫",
    title: "My Campaigns",
    description: "View all your generated workflows",
    color: "bg-white border border-surface-200",
    iconBg: "bg-surface-100",
    view: "projects" as View,
  },
  {
    id: "settings",
    icon: "◎",
    title: "Connect Tools",
    description: "Add Apollo, HubSpot, Smartlead credentials",
    color: "bg-white border border-surface-200",
    iconBg: "bg-surface-100",
    view: "settings" as View,
  },
];

const palStages = [
  { num: 1, name: "Extract", desc: "Parse your ICP description" },
  { num: 2, name: "Categorize", desc: "Classify industry & persona" },
  { num: 3, name: "Enhance", desc: "Add pain points & triggers" },
  { num: 4, name: "Instruct", desc: "Write AI system prompt" },
  { num: 5, name: "Compile", desc: "Generate n8n workflow" },
];

const stats = [
  { label: "Leads/Day", value: "25-50", unit: "auto", color: "text-brand-700" },
  { label: "Speed to Lead", value: "15", unit: "min", color: "text-blue-600" },
  { label: "Bounce Rate", value: "<2", unit: "%", color: "text-emerald-600" },
  { label: "Time Saved", value: "10+", unit: "hrs/wk", color: "text-violet-600" },
];

export default function DashboardHome({ userName, onNavigate, onNewProject }: DashboardHomeProps) {
  return (
    <div style={{ padding: "32px", maxWidth: 960, margin: "0 auto", overflowY: "auto", height: "100%" }}>

      {/* Quick Actions Grid */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-ink-muted uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onNavigate(action.view)}
              className={`text-left p-5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover ${action.color}`}
            >
              <div className={`w-10 h-10 rounded-xl ${action.iconBg} flex items-center justify-center text-xl mb-3 ${action.color.includes("brand-700") ? "bg-brand-600" : ""}`}>
                {action.icon}
              </div>
              <div className={`font-semibold text-sm mb-1 ${action.color.includes("brand-700") ? "text-white" : "text-ink"}`}>
                {action.title}
              </div>
              <div className={`text-xs leading-relaxed ${action.color.includes("brand-700") ? "text-brand-200" : "text-ink-secondary"}`}>
                {action.description}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Stats Row */}
      <section className="mb-10">
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-surface-200 rounded-2xl p-5 shadow-card">
              <div className={`text-2xl font-bold tracking-tight mb-1 ${stat.color}`}>
                {stat.value}
                <span className="text-sm font-medium ml-1">{stat.unit}</span>
              </div>
              <div className="text-xs text-ink-muted font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PAL Pipeline Explainer */}
      <section className="mb-8">
        <div className="bg-white border border-surface-200 rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-ink">How the PAL Pipeline Works</h2>
              <p className="text-sm text-ink-secondary mt-0.5">5 AI stages transform your description into a complete automation</p>
            </div>
            <button
              onClick={() => onNavigate("builder")}
              className="btn-brand text-xs px-4 py-2"
            >
              Start Building →
            </button>
          </div>
          <div className="flex items-center gap-2">
            {palStages.map((stage, i) => (
              <div key={stage.num} className="flex items-center gap-2 flex-1">
                <div className="flex-1 bg-surface-50 border border-surface-200 rounded-xl p-3 text-center">
                  <div className="w-6 h-6 rounded-full bg-brand-700 text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">
                    {stage.num}
                  </div>
                  <div className="text-xs font-semibold text-ink">{stage.name}</div>
                  <div className="text-[10px] text-ink-muted mt-0.5 leading-tight">{stage.desc}</div>
                </div>
                {i < palStages.length - 1 && (
                  <div className="text-ink-muted text-sm flex-shrink-0">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section>
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white text-lg flex-shrink-0">✦</div>
            <div className="flex-1">
              <h3 className="font-bold text-ink mb-1">Ready to automate your outbound?</h3>
              <p className="text-sm text-ink-secondary mb-4">
                Start by describing what you sell and who you target. The PAL Agent will extract your ICP,
                categorize your ideal buyer, enhance with pain points and triggers, write the AI agent system prompt,
                and compile your entire n8n workflow — all in under 2 minutes.
              </p>
              <div className="flex gap-3">
                <button onClick={() => onNavigate("builder")} className="btn-brand">
                  Launch Guided Wizard
                </button>
                <button onClick={() => onNavigate("builder")} className="btn-outline">
                  Chat with PAL Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
