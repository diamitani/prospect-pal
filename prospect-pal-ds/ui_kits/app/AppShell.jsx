const { Logo, NavItem, StatusPill, IconButton, Badge } = window.ProspectPALDesignSystem_b8251d;

function AppShell({ view, onView, project, children }) {
  const meta = window.VIEW_META[view];
  return (
    <div style={{ display: "flex", height: "100%", background: "var(--surface-page)", fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
      <aside style={{
        width: "var(--layout-app-sidebar)", flexShrink: 0, background: "var(--surface-deep)",
        borderRight: "1px solid var(--border-deep)", display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "18px 16px 16px", borderBottom: "1px solid var(--border-deep)" }}>
          <Logo size={30} onDeep tagline="GTM Automation Architect" />
        </div>
        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
          {window.NAV.map((n) => (
            <NavItem key={n.id} {...n} active={view === n.id} onClick={() => onView(n.id)} />
          ))}
        </nav>
        {project ? (
          <div style={{ padding: "0 14px 12px" }}>
            <div style={{ fontSize: "var(--text-micro)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "var(--tracking-eyebrow)", color: "var(--ink-400)", marginBottom: 6 }}>Active engine</div>
            <div style={{
              fontSize: "var(--text-caption)", padding: "7px 10px", borderRadius: "var(--radius-sm)",
              background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-deep)", color: "var(--ink-200)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{project}</div>
          </div>
        ) : null}
        <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border-deep)", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            width: 30, height: 30, borderRadius: "var(--radius-sm)", flexShrink: 0,
            background: "var(--cobalt-600)", color: "var(--paper-0)", fontWeight: 700, fontSize: 12,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>AR</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "var(--text-caption)", fontWeight: 600, color: "var(--paper-0)" }}>Alex Rivera</div>
            <div style={{ fontSize: "var(--text-micro)", color: "var(--champagne-200)", fontWeight: 500 }}>Pro plan · BYOK</div>
          </div>
          <IconButton icon="log-out" label="Sign out" variant="deep" size={26} />
        </div>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{
          height: "var(--layout-topbar)", flexShrink: 0, background: "var(--surface-card)",
          borderBottom: "1px solid var(--border-hairline)", padding: "0 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: "var(--text-h4)", fontWeight: 700, letterSpacing: "var(--tracking-heading)" }}>{meta.title}</span>
            <span style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)" }}>{meta.crumb}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Badge tone="neutral" mono shape="square">run_id pae_9f21c</Badge>
            <StatusPill label="Engine ready" />
            <IconButton icon="circle-help" label="Help" />
          </div>
        </header>
        <main style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>{children}</main>
      </div>
    </div>
  );
}
Object.assign(window, { AppShell });
