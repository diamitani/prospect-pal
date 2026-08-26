const { Logo, Button, Badge, Icon } = window.ProspectPALDesignSystem_b8251d;

function TopStrip() {
  return (
    <div style={{
      background: "var(--surface-deep)", color: "var(--ink-200)", padding: "9px 24px",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      fontSize: "var(--text-caption)", borderBottom: "1px solid var(--border-deep)",
    }}>
      <Badge tone="deep">New</Badge>
      <span><strong style={{ color: "var(--paper-0)", fontWeight: 600 }}>Tech signals live:</strong> 1,400+ companies running n8n and hiring GTM engineers.</span>
      <a href="#signals" style={{ color: "var(--champagne-200)", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
        Explore signals <Icon name="arrow-right" size={13} color="var(--champagne-200)" />
      </a>
    </div>
  );
}

function SiteNav({ onCheckout }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 40, height: 66, padding: "0 32px",
      background: "rgba(251,250,248,0.86)", backdropFilter: "blur(14px)",
      borderBottom: "1px solid var(--border-hairline)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <Logo size={34} />
        <Badge tone="brand">Automation agent</Badge>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        {["Architecture", "Deliverables", "Signals", "Pricing"].map((l) => (
          <a key={l} href={"#" + l.toLowerCase()} style={{ fontSize: "var(--text-body-sm)", fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none" }}>{l}</a>
        ))}
        <Button variant="outline" size="md">Sign in</Button>
        <Button variant="accent" size="md" icon="zap" onClick={onCheckout}>Build my engine</Button>
      </div>
    </nav>
  );
}

function SiteFooter() {
  return (
    <footer style={{ padding: "40px 32px", borderTop: "1px solid var(--border-hairline)", background: "var(--surface-sunken)" }}>
      <div style={{ maxWidth: "var(--layout-max)", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
        <Logo size={26} />
        <div style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)" }}>© 2026 Prospect PAL · GTM automation, compiled and handed over.</div>
        <div style={{ display: "flex", gap: 18 }}>
          {["Architecture", "Security", "Docs"].map((l) => (
            <a key={l} href="#" style={{ fontSize: "var(--text-caption)", color: "var(--text-secondary)", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
Object.assign(window, { TopStrip, SiteNav, SiteFooter });
