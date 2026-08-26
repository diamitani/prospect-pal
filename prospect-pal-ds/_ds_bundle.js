/* @ds-bundle: {"format":4,"namespace":"ProspectPALDesignSystem_b8251d","components":[{"name":"ChatBubble","sourcePath":"components/app/ChatBubble.jsx"},{"name":"Modal","sourcePath":"components/app/Modal.jsx"},{"name":"NavItem","sourcePath":"components/app/NavItem.jsx"},{"name":"StatTile","sourcePath":"components/app/StatTile.jsx"},{"name":"StepIndicator","sourcePath":"components/app/StepIndicator.jsx"},{"name":"ToolOptionCard","sourcePath":"components/app/ToolOptionCard.jsx"},{"name":"TypingDots","sourcePath":"components/app/TypingDots.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Label","sourcePath":"components/core/Label.jsx"},{"name":"Select","sourcePath":"components/core/Select.jsx"},{"name":"StatusPill","sourcePath":"components/core/StatusPill.jsx"},{"name":"Textarea","sourcePath":"components/core/Textarea.jsx"},{"name":"DeliverableCard","sourcePath":"components/marketing/DeliverableCard.jsx"},{"name":"IntegrationCard","sourcePath":"components/marketing/IntegrationCard.jsx"},{"name":"LeadSignalCard","sourcePath":"components/marketing/LeadSignalCard.jsx"},{"name":"PricingCard","sourcePath":"components/marketing/PricingCard.jsx"},{"name":"SectionHeading","sourcePath":"components/marketing/SectionHeading.jsx"},{"name":"NodeCard","sourcePath":"components/pipeline/NodeCard.jsx"},{"name":"PipelineRail","sourcePath":"components/pipeline/PipelineRail.jsx"}],"sourceHashes":{"components/app/ChatBubble.jsx":"ab6df89de551","components/app/Modal.jsx":"0cbfdbdd1b5e","components/app/NavItem.jsx":"d1016b19d564","components/app/StatTile.jsx":"0408d74102ac","components/app/StepIndicator.jsx":"1643aef88e36","components/app/ToolOptionCard.jsx":"d0d07896d933","components/app/TypingDots.jsx":"a0af12db178a","components/brand/Logo.jsx":"5fd758937561","components/core/Badge.jsx":"2f9cd69637b8","components/core/Button.jsx":"ed262c69c54e","components/core/Card.jsx":"456d72a4039d","components/core/Icon.jsx":"c39bdcc06ca1","components/core/IconButton.jsx":"8b97cb3b44e2","components/core/Input.jsx":"6a74a9beabed","components/core/Label.jsx":"1556726fbeb6","components/core/Select.jsx":"b01213e67945","components/core/StatusPill.jsx":"4b04d27175b9","components/core/Textarea.jsx":"3e6717e9f3e7","components/marketing/DeliverableCard.jsx":"1f4c126b2bca","components/marketing/IntegrationCard.jsx":"52492ae77cc3","components/marketing/LeadSignalCard.jsx":"7c04b84b0d15","components/marketing/PricingCard.jsx":"a7b5f8cff582","components/marketing/SectionHeading.jsx":"96fb2e01cdfe","components/pipeline/NodeCard.jsx":"7a4138252b13","components/pipeline/PipelineRail.jsx":"5317bead5c60","ui_kits/app/AppShell.jsx":"3fc2c74ebf36","ui_kits/app/BuilderScreen.jsx":"31fe0ac66b07","ui_kits/app/DashboardScreen.jsx":"b55dbcbccb46","ui_kits/app/OutputsScreen.jsx":"cb919bbc40b0","ui_kits/app/SettingsScreen.jsx":"f729f4b0aba0","ui_kits/app/SignalsScreen.jsx":"74a2a2e02c8f","ui_kits/app/WizardScreen.jsx":"db62cfc61cb4","ui_kits/app/data.jsx":"6f52fea42615","ui_kits/marketing/Hero.jsx":"00d75980ae03","ui_kits/marketing/Sections.jsx":"86ae3f0a8bc2","ui_kits/marketing/SiteChrome.jsx":"36b3db9b74fa"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ProspectPALDesignSystem_b8251d = window.ProspectPALDesignSystem_b8251d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/app/ChatBubble.jsx
try { (() => {
function ChatBubble({
  role = "assistant",
  children,
  style
}) {
  const user = role === "user";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: user ? "flex-end" : "flex-start",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: user ? "82%" : "88%",
      padding: "10px 14px",
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-body-sm)",
      lineHeight: "var(--leading-normal)",
      whiteSpace: "pre-wrap",
      borderRadius: "var(--radius-lg)",
      borderBottomRightRadius: user ? "var(--radius-xs)" : undefined,
      borderBottomLeftRadius: user ? undefined : "var(--radius-xs)",
      background: user ? "var(--ink-800)" : "var(--surface-card)",
      color: user ? "var(--paper-0)" : "var(--text-primary)",
      border: user ? "none" : "1px solid var(--border-hairline)",
      boxShadow: user ? "none" : "var(--shadow-hairline)"
    }
  }, children));
}
Object.assign(__ds_scope, { ChatBubble });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/app/ChatBubble.jsx", error: String((e && e.message) || e) }); }

// components/app/StatTile.jsx
try { (() => {
function StatTile({
  value,
  unit,
  label,
  tone = "ink"
}) {
  const colors = {
    ink: "var(--text-primary)",
    brand: "var(--cobalt-600)",
    verified: "var(--signal-verified)",
    premium: "var(--champagne-500)"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-lg)",
      padding: "16px 20px",
      boxShadow: "var(--shadow-hairline)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-h2)",
      fontWeight: "var(--weight-bold)",
      letterSpacing: "var(--tracking-heading)",
      color: colors[tone] || colors.ink,
      lineHeight: 1.1
    }
  }, value, unit ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-caption)",
      fontWeight: "var(--weight-medium)",
      color: "var(--text-muted)",
      marginLeft: 5
    }
  }, unit) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-micro)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-muted)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-eyebrow)",
      marginTop: 5
    }
  }, label));
}
Object.assign(__ds_scope, { StatTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/app/StatTile.jsx", error: String((e && e.message) || e) }); }

// components/app/TypingDots.jsx
try { (() => {
function TypingDots({
  label = "Compiling"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-4)",
      padding: "8px 14px",
      borderRadius: "var(--radius-lg)",
      background: "var(--surface-sunken)",
      border: "1px solid var(--border-hairline)",
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-caption)",
      color: "var(--text-secondary)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      gap: 3
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: "var(--cobalt-400)",
      animation: "pp-typing 1.4s var(--ease-standard) infinite",
      animationDelay: i * 0.2 + "s"
    }
  }))), label);
}
Object.assign(__ds_scope, { TypingDots });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/app/TypingDots.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
/* Wordmark + mark lockup. Asset files live in /assets (logo-mark.svg, logo-lockup.svg). */
function Logo({
  variant = "lockup",
  size = 32,
  onDeep = false,
  tagline,
  style
}) {
  const ink = onDeep ? "var(--paper-0)" : "var(--ink-800)";
  const markBg = onDeep ? "var(--paper-0)" : "var(--ink-800)";
  const nodeFill = onDeep ? "var(--ink-800)" : "var(--paper-50)";
  const accent = "var(--champagne-300)";
  const mark = /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    style: {
      flexShrink: 0,
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("rect", {
    width: "48",
    height: "48",
    rx: "13",
    fill: markBg
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 32.5 L24 24 L34 15.5",
    stroke: accent,
    strokeWidth: "2.2",
    strokeLinecap: "square",
    fill: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "14",
    cy: "32.5",
    r: "3.4",
    fill: nodeFill
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "24",
    r: "3.4",
    fill: nodeFill
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "34",
    cy: "15.5",
    r: "4.6",
    fill: accent
  }));
  if (variant === "mark") return /*#__PURE__*/React.createElement("span", {
    style: style
  }, mark);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: Math.round(size * 0.34),
      ...style
    }
  }, mark, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      lineHeight: 1.1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: "var(--weight-bold)",
      fontSize: Math.round(size * 0.52),
      letterSpacing: "var(--tracking-heading)",
      color: ink,
      whiteSpace: "nowrap"
    }
  }, "Prospect", " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: onDeep ? "var(--champagne-200)" : "var(--cobalt-600)",
      letterSpacing: "0.02em"
    }
  }, "PAL")), tagline ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: Math.round(size * 0.3),
      color: onDeep ? "var(--ink-300)" : "var(--text-muted)",
      fontWeight: "var(--weight-medium)",
      marginTop: 2
    }
  }, tagline) : null));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function Card({
  children,
  tone = "paper",
  pad = 20,
  interactive = false,
  radius = "var(--radius-lg)",
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const tones = {
    paper: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-hairline)",
      color: "var(--text-primary)"
    },
    sunken: {
      background: "var(--surface-sunken)",
      border: "1px solid var(--border-hairline)",
      color: "var(--text-primary)"
    },
    deep: {
      background: "var(--surface-deep-raised)",
      border: "1px solid var(--border-deep)",
      color: "var(--paper-0)"
    },
    accent: {
      background: "var(--surface-brand-tint)",
      border: "1px solid var(--cobalt-100)",
      color: "var(--text-primary)"
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      borderRadius: radius,
      padding: pad,
      boxShadow: "var(--shadow-card)",
      transition: "var(--transition-surface)",
      cursor: interactive ? "pointer" : undefined,
      ...tones[tone],
      ...(interactive && hover ? {
        boxShadow: "var(--shadow-card-hover)",
        transform: "var(--lift-hover)"
      } : null),
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
/* Renders a Lucide glyph. Requires the Lucide UMD script on the page:
   <script src="https://unpkg.com/lucide@0.544.0/dist/umd/lucide.js"></script> */
function Icon({
  name,
  size = 16,
  strokeWidth = 1.75,
  color = "currentColor",
  style
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = "";
    const i = document.createElement("i");
    i.setAttribute("data-lucide", name);
    el.appendChild(i);
    window.lucide.createIcons({
      attrs: {
        width: size,
        height: size,
        "stroke-width": strokeWidth,
        stroke: color
      },
      nameAttr: "data-lucide",
      root: el
    });
  }, [name, size, strokeWidth, color]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    "aria-hidden": "true",
    style: {
      display: "inline-flex",
      width: size,
      height: size,
      flexShrink: 0,
      ...style
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/app/NavItem.jsx
try { (() => {
function NavItem({
  label,
  icon,
  active = false,
  onClick,
  badge
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: "var(--space-5)",
      padding: "8px 12px",
      marginBottom: 2,
      borderRadius: "var(--radius-sm)",
      border: "none",
      cursor: "pointer",
      textAlign: "left",
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-body-sm)",
      fontWeight: active ? "var(--weight-semibold)" : "var(--weight-medium)",
      background: active ? "rgba(255,255,255,0.08)" : hover ? "rgba(255,255,255,0.04)" : "transparent",
      color: active ? "var(--paper-0)" : "var(--ink-300)",
      boxShadow: active ? "inset 2px 0 0 var(--champagne-300)" : "none",
      transition: "var(--transition-control)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, label), badge ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-data)",
      fontSize: "var(--text-micro)",
      color: "var(--champagne-200)",
      background: "rgba(199,158,62,0.14)",
      padding: "1px 6px",
      borderRadius: "var(--radius-xs)"
    }
  }, badge) : null);
}
Object.assign(__ds_scope, { NavItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/app/NavItem.jsx", error: String((e && e.message) || e) }); }

// components/app/StepIndicator.jsx
try { (() => {
function StepIndicator({
  steps = [],
  current = 0,
  onStep
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      flexWrap: "wrap"
    }
  }, steps.map((label, i) => {
    const done = i < current,
      active = i === current;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: label
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onStep && onStep(i),
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-3)",
        padding: "5px 10px",
        borderRadius: "var(--radius-pill)",
        cursor: "pointer",
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-micro)",
        fontWeight: active ? "var(--weight-semibold)" : "var(--weight-medium)",
        background: active ? "var(--ink-800)" : done ? "var(--signal-verified-bg)" : "var(--surface-sunken)",
        color: active ? "var(--paper-0)" : done ? "var(--signal-verified)" : "var(--text-muted)",
        border: "1px solid " + (active ? "var(--ink-800)" : "transparent"),
        transition: "var(--transition-control)"
      }
    }, done ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "check",
      size: 12
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-data)",
        opacity: 0.8
      }
    }, String(i + 1).padStart(2, "0")), label), i < steps.length - 1 ? /*#__PURE__*/React.createElement("span", {
      style: {
        width: 10,
        height: 1,
        background: "var(--border-strong)"
      }
    }) : null);
  }));
}
Object.assign(__ds_scope, { StepIndicator });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/app/StepIndicator.jsx", error: String((e && e.message) || e) }); }

// components/app/ToolOptionCard.jsx
try { (() => {
function ToolOptionCard({
  icon,
  title,
  caption,
  selected = false,
  onClick,
  meta
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: "var(--space-6)",
      width: "100%",
      textAlign: "left",
      padding: "13px 14px",
      cursor: "pointer",
      borderRadius: "var(--radius-md)",
      fontFamily: "var(--font-body)",
      border: "var(--border-width-emphasis) solid " + (selected ? "var(--cobalt-500)" : hover ? "var(--border-strong)" : "var(--border-hairline)"),
      background: selected ? "var(--surface-brand-tint)" : "var(--surface-card)",
      boxShadow: selected ? "var(--focus-ring)" : "none",
      transition: "var(--transition-control)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: "var(--radius-sm)",
      flexShrink: 0,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: selected ? "var(--cobalt-100)" : "var(--surface-sunken)",
      color: selected ? "var(--cobalt-700)" : "var(--ink-500)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 17
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-h4)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-primary)"
    }
  }, title), meta ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-data)",
      fontSize: "var(--text-micro)",
      color: "var(--text-muted)"
    }
  }, meta) : null), caption ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: "var(--text-caption)",
      color: "var(--text-secondary)",
      lineHeight: "var(--leading-normal)",
      marginTop: 2
    }
  }, caption) : null), selected ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "circle-check",
    size: 16,
    color: "var(--cobalt-600)"
  }) : null);
}
Object.assign(__ds_scope, { ToolOptionCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/app/ToolOptionCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const TONES = {
  neutral: {
    background: "var(--surface-sunken)",
    color: "var(--ink-600)",
    border: "var(--border-hairline)"
  },
  brand: {
    background: "var(--cobalt-50)",
    color: "var(--cobalt-700)",
    border: "var(--cobalt-100)"
  },
  premium: {
    background: "var(--champagne-50)",
    color: "var(--champagne-500)",
    border: "var(--champagne-100)"
  },
  verified: {
    background: "var(--signal-verified-bg)",
    color: "var(--signal-verified)",
    border: "transparent"
  },
  attention: {
    background: "var(--signal-attention-bg)",
    color: "var(--signal-attention)",
    border: "transparent"
  },
  blocked: {
    background: "var(--signal-blocked-bg)",
    color: "var(--signal-blocked)",
    border: "transparent"
  },
  deep: {
    background: "rgba(255,255,255,0.08)",
    color: "var(--ink-100)",
    border: "rgba(255,255,255,0.14)"
  }
};
function Badge({
  children,
  tone = "neutral",
  icon,
  mono = false,
  shape = "pill",
  style
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-2)",
      padding: mono ? "3px 8px" : "3px 9px",
      borderRadius: shape === "pill" ? "var(--radius-pill)" : "var(--radius-xs)",
      fontFamily: mono ? "var(--font-data)" : "var(--font-body)",
      fontSize: "var(--text-micro)",
      fontWeight: "var(--weight-semibold)",
      letterSpacing: mono ? "var(--tracking-mono)" : "0.01em",
      background: t.background,
      color: t.color,
      border: "1px solid " + t.border,
      whiteSpace: "nowrap",
      ...style
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 12
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const SIZES = {
  sm: {
    padding: "6px 12px",
    fontSize: "var(--text-caption)",
    radius: "var(--radius-sm)",
    icon: 14
  },
  md: {
    padding: "9px 16px",
    fontSize: "var(--text-body-sm)",
    radius: "var(--radius-md)",
    icon: 16
  },
  lg: {
    padding: "15px 28px",
    fontSize: "var(--text-body)",
    radius: "var(--radius-lg)",
    icon: 18
  }
};
const VARIANTS = {
  primary: {
    background: "var(--action-primary)",
    color: "var(--text-inverse)",
    border: "1px solid var(--action-primary)",
    boxShadow: "var(--shadow-action)"
  },
  accent: {
    background: "var(--action-accent)",
    color: "var(--text-inverse)",
    border: "1px solid var(--action-accent)",
    boxShadow: "var(--shadow-action-accent)"
  },
  outline: {
    background: "var(--surface-card)",
    color: "var(--ink-700)",
    border: "var(--border-width-emphasis) solid var(--border-strong)",
    boxShadow: "var(--shadow-hairline)"
  },
  ghost: {
    background: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid transparent",
    boxShadow: "none"
  },
  inverse: {
    background: "var(--paper-0)",
    color: "var(--ink-800)",
    border: "1px solid var(--paper-0)",
    boxShadow: "none"
  }
};
function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
  style
}) {
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const hoverStyle = disabled ? null : hover ? {
    primary: {
      background: "var(--action-primary-hover)"
    },
    accent: {
      background: "var(--action-accent-hover)"
    },
    outline: {
      borderColor: "var(--cobalt-300)",
      color: "var(--text-brand)",
      background: "var(--surface-brand-tint)"
    },
    ghost: {
      background: "var(--surface-sunken)",
      color: "var(--text-primary)"
    },
    inverse: {
      background: "var(--paper-100)"
    }
  }[variant] : null;
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-3)",
      fontFamily: "var(--font-body)",
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "-0.005em",
      whiteSpace: "nowrap",
      cursor: disabled ? "not-allowed" : "pointer",
      padding: s.padding,
      fontSize: s.fontSize,
      borderRadius: s.radius,
      width: fullWidth ? "100%" : undefined,
      transition: "var(--transition-control)",
      opacity: disabled ? 0.4 : 1,
      transform: press ? "var(--press-scale)" : hover && !disabled ? "var(--lift-hover)" : "none",
      ...v,
      ...hoverStyle,
      ...style
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.icon
  }) : null, children, iconRight ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.icon
  }) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function IconButton({
  icon,
  label,
  size = 28,
  variant = "outline",
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const base = variant === "outline" ? {
    background: "var(--paper-50)",
    border: "1px solid var(--border-hairline)",
    color: "var(--text-secondary)"
  } : variant === "deep" ? {
    background: "var(--surface-deep-raised)",
    border: "1px solid var(--border-deep)",
    color: "var(--ink-200)"
  } : {
    background: "transparent",
    border: "1px solid transparent",
    color: "var(--text-muted)"
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    "aria-label": label,
    title: label,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: size,
      height: size,
      borderRadius: "var(--radius-sm)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "var(--transition-control)",
      ...base,
      ...(hover ? {
        color: "var(--text-primary)",
        borderColor: "var(--border-strong)"
      } : null),
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: Math.round(size * 0.5)
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/app/Modal.jsx
try { (() => {
function Modal({
  open = true,
  title,
  eyebrow,
  onClose,
  footer,
  width = 620,
  tone = "paper",
  children
}) {
  if (!open) return null;
  const deep = tone === "deep";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 999,
      padding: "var(--space-10)",
      background: "rgba(11,15,22,0.55)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "pp-fade-up var(--duration-base) var(--ease-entrance)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: width,
      borderRadius: "var(--radius-xl)",
      background: deep ? "var(--surface-deep)" : "var(--surface-card)",
      border: "1px solid " + (deep ? "var(--border-deep)" : "var(--border-hairline)"),
      boxShadow: "var(--shadow-overlay)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: "var(--space-8)",
      padding: "20px 22px 16px",
      borderBottom: "1px solid " + (deep ? "var(--border-deep)" : "var(--border-hairline)")
    }
  }, /*#__PURE__*/React.createElement("div", null, eyebrow ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-eyebrow)",
      fontWeight: "var(--weight-semibold)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-eyebrow)",
      color: deep ? "var(--champagne-200)" : "var(--text-brand)",
      marginBottom: 5
    }
  }, eyebrow) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-h3)",
      fontWeight: "var(--weight-bold)",
      letterSpacing: "var(--tracking-heading)",
      color: deep ? "var(--paper-0)" : "var(--text-primary)"
    }
  }, title)), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Close",
    onClick: onClose,
    variant: deep ? "deep" : "ghost"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 22px",
      color: deep ? "var(--ink-200)" : "var(--text-primary)"
    }
  }, children), footer ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 22px",
      display: "flex",
      justifyContent: "flex-end",
      gap: "var(--space-6)",
      borderTop: "1px solid " + (deep ? "var(--border-deep)" : "var(--border-hairline)"),
      background: deep ? "transparent" : "var(--surface-sunken)"
    }
  }, footer) : null));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/app/Modal.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  mono = false,
  disabled = false,
  invalid = false,
  fullWidth = true,
  onSubmitKey,
  style
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: fullWidth ? "100%" : undefined
    }
  }, icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 11,
      top: "50%",
      transform: "translateY(-50%)",
      color: "var(--text-muted)",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 15
  })) : null, /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter" && onSubmitKey) onSubmitKey();
    },
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: "100%",
      boxSizing: "border-box",
      padding: icon ? "9px 12px 9px 32px" : "9px 12px",
      fontFamily: mono ? "var(--font-data)" : "var(--font-body)",
      fontSize: "var(--text-body-sm)",
      color: "var(--text-primary)",
      background: disabled ? "var(--surface-sunken)" : "var(--surface-card)",
      border: "var(--border-width-emphasis) solid " + (invalid ? "var(--signal-blocked)" : focus ? "var(--border-focus)" : "var(--border-hairline)"),
      borderRadius: "var(--radius-md)",
      outline: "none",
      boxShadow: focus ? "var(--focus-ring)" : "none",
      transition: "var(--transition-control)",
      ...style
    }
  }));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Label.jsx
try { (() => {
function Label({
  children,
  htmlFor,
  step,
  hint
}) {
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: htmlFor,
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: "var(--space-3)",
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-body-sm)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--ink-600)",
      marginBottom: "var(--space-3)"
    }
  }, step != null ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-data)",
      fontSize: "var(--text-micro)",
      color: "var(--text-muted)",
      fontWeight: "var(--weight-medium)"
    }
  }, String(step).padStart(2, "0")) : null, /*#__PURE__*/React.createElement("span", null, children), hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: "var(--weight-regular)",
      fontSize: "var(--text-caption)",
      color: "var(--text-muted)"
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Label });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Label.jsx", error: String((e && e.message) || e) }); }

// components/core/Select.jsx
try { (() => {
function Select({
  value,
  onChange,
  options = [],
  disabled = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: value,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.value),
    style: {
      width: "100%",
      boxSizing: "border-box",
      appearance: "none",
      padding: "9px 34px 9px 12px",
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-body-sm)",
      color: "var(--text-primary)",
      background: "var(--surface-card)",
      border: "var(--border-width-emphasis) solid var(--border-hairline)",
      borderRadius: "var(--radius-md)",
      outline: "none",
      cursor: "pointer",
      transition: "var(--transition-control)",
      ...style
    }
  }, options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 11,
      top: "50%",
      transform: "translateY(-50%)",
      color: "var(--text-muted)",
      pointerEvents: "none",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 15
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Select.jsx", error: String((e && e.message) || e) }); }

// components/core/StatusPill.jsx
try { (() => {
function StatusPill({
  label,
  tone = "verified",
  pulse = true,
  onDeep = false,
  style
}) {
  const map = {
    verified: {
      fg: "var(--signal-verified)",
      bg: "var(--signal-verified-bg)",
      dot: "var(--signal-verified)"
    },
    attention: {
      fg: "var(--signal-attention)",
      bg: "var(--signal-attention-bg)",
      dot: "var(--signal-attention)"
    },
    blocked: {
      fg: "var(--signal-blocked)",
      bg: "var(--signal-blocked-bg)",
      dot: "var(--signal-blocked)"
    },
    brand: {
      fg: "var(--cobalt-700)",
      bg: "var(--cobalt-50)",
      dot: "var(--cobalt-500)"
    }
  };
  const t = map[tone] || map.verified;
  const fg = onDeep ? "var(--ink-100)" : t.fg;
  const bg = onDeep ? "rgba(255,255,255,0.08)" : t.bg;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-3)",
      padding: "4px 11px",
      borderRadius: "var(--radius-pill)",
      background: bg,
      color: fg,
      border: "1px solid " + (onDeep ? "rgba(255,255,255,0.14)" : "transparent"),
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-micro)",
      fontWeight: "var(--weight-semibold)",
      whiteSpace: "nowrap",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: t.dot,
      flexShrink: 0,
      animation: pulse ? "pp-pulse var(--duration-ambient) var(--ease-standard) infinite" : "none"
    }
  }), label);
}
Object.assign(__ds_scope, { StatusPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatusPill.jsx", error: String((e && e.message) || e) }); }

// components/core/Textarea.jsx
try { (() => {
function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled = false,
  style
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("textarea", {
    value: value,
    placeholder: placeholder,
    rows: rows,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.value),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: "100%",
      boxSizing: "border-box",
      padding: "10px 12px",
      resize: "vertical",
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-body-sm)",
      lineHeight: "var(--leading-normal)",
      color: "var(--text-primary)",
      background: "var(--surface-card)",
      border: "var(--border-width-emphasis) solid " + (focus ? "var(--border-focus)" : "var(--border-hairline)"),
      borderRadius: "var(--radius-md)",
      outline: "none",
      boxShadow: focus ? "var(--focus-ring)" : "none",
      transition: "var(--transition-control)",
      ...style
    }
  });
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/marketing/DeliverableCard.jsx
try { (() => {
function DeliverableCard({
  file,
  label,
  description,
  badge
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      flexDirection: "column",
      padding: "22px",
      borderRadius: "var(--radius-xl)",
      background: "var(--surface-card)",
      border: "1px solid var(--border-hairline)",
      boxShadow: hover ? "var(--shadow-card-hover)" : "var(--shadow-card)",
      transform: hover ? "var(--lift-hover)" : "none",
      transition: "var(--transition-surface)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-data)",
      fontSize: "var(--text-caption)",
      fontWeight: "var(--weight-medium)",
      color: "var(--cobalt-700)",
      background: "var(--cobalt-50)",
      padding: "3px 8px",
      borderRadius: "var(--radius-xs)"
    }
  }, file), badge ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-micro)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-muted)",
      background: "var(--surface-sunken)",
      padding: "2px 8px",
      borderRadius: "var(--radius-pill)"
    }
  }, badge) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-h3)",
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--tracking-heading)",
      marginBottom: 6
    }
  }, label), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-body-sm)",
      color: "var(--text-secondary)",
      lineHeight: "var(--leading-relaxed)"
    }
  }, description));
}
Object.assign(__ds_scope, { DeliverableCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/DeliverableCard.jsx", error: String((e && e.message) || e) }); }

// components/marketing/IntegrationCard.jsx
try { (() => {
function IntegrationCard({
  name,
  description,
  icon = "plug",
  capability,
  connected = false
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: "var(--space-7)",
      padding: "16px 18px",
      borderRadius: "var(--radius-lg)",
      background: "var(--surface-card)",
      border: "1px solid var(--border-hairline)",
      boxShadow: hover ? "var(--shadow-card-hover)" : "var(--shadow-hairline)",
      transform: hover ? "var(--lift-hover)" : "none",
      transition: "var(--transition-surface)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: "var(--radius-md)",
      flexShrink: 0,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--surface-sunken)",
      color: "var(--ink-600)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 19
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      marginBottom: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-h4)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-primary)"
    }
  }, name), connected ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "circle-check",
    size: 14,
    color: "var(--signal-verified)"
  }) : null), capability ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-data)",
      fontSize: "var(--text-micro)",
      color: "var(--text-muted)",
      marginBottom: 4
    }
  }, capability) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-caption)",
      color: "var(--text-secondary)",
      lineHeight: "var(--leading-normal)"
    }
  }, description)));
}
Object.assign(__ds_scope, { IntegrationCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/IntegrationCard.jsx", error: String((e && e.message) || e) }); }

// components/marketing/LeadSignalCard.jsx
try { (() => {
function LeadSignalCard({
  company,
  round,
  stack = [],
  trigger,
  contact,
  verified = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 20px",
      borderRadius: "var(--radius-xl)",
      background: "var(--surface-deep-raised)",
      border: "1px solid var(--border-deep)",
      boxShadow: "var(--shadow-inset-deep)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-h3)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--paper-0)",
      letterSpacing: "var(--tracking-heading)"
    }
  }, company), round ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-micro)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--champagne-200)",
      background: "rgba(199,158,62,0.14)",
      border: "1px solid rgba(199,158,62,0.28)",
      padding: "2px 9px",
      borderRadius: "var(--radius-pill)"
    }
  }, round) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-3)",
      marginBottom: "var(--space-6)"
    }
  }, stack.map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    style: {
      fontFamily: "var(--font-data)",
      fontSize: "var(--text-micro)",
      color: "var(--ink-200)",
      background: "rgba(255,255,255,0.06)",
      padding: "2px 7px",
      borderRadius: "var(--radius-xs)"
    }
  }, s))), trigger ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-4)",
      alignItems: "flex-start",
      fontSize: "var(--text-caption)",
      color: "var(--ink-200)",
      marginBottom: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "radio",
    size: 14,
    color: "var(--champagne-300)"
  }), /*#__PURE__*/React.createElement("span", null, trigger)) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: "var(--space-6)",
      borderTop: "1px solid var(--border-deep)",
      fontSize: "var(--text-caption)",
      color: "var(--ink-300)"
    }
  }, /*#__PURE__*/React.createElement("span", null, contact), verified ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      color: "var(--paper-0)",
      fontWeight: "var(--weight-semibold)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "circle-check",
    size: 13,
    color: "#5BD1AE"
  }), " Verified") : null));
}
Object.assign(__ds_scope, { LeadSignalCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/LeadSignalCard.jsx", error: String((e && e.message) || e) }); }

// components/marketing/PricingCard.jsx
try { (() => {
function PricingCard({
  name,
  price,
  cadence,
  note,
  description,
  features = [],
  cta,
  featured = false,
  tone = "paper"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      padding: "28px 26px",
      borderRadius: "var(--radius-2xl)",
      background: tone === "sunken" ? "var(--surface-sunken)" : "var(--surface-card)",
      border: featured ? "var(--border-width-emphasis) solid var(--cobalt-500)" : "1px solid var(--border-hairline)",
      boxShadow: featured ? "var(--shadow-raised)" : "var(--shadow-hairline)",
      position: "relative"
    }
  }, featured ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: -11,
      left: 26,
      background: "var(--cobalt-600)",
      color: "var(--paper-0)",
      fontSize: "var(--text-micro)",
      fontWeight: "var(--weight-semibold)",
      padding: "3px 11px",
      borderRadius: "var(--radius-pill)",
      letterSpacing: "0.04em"
    }
  }, "Most teams start here") : null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-eyebrow)",
      fontWeight: "var(--weight-semibold)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-eyebrow)",
      color: featured ? "var(--text-brand)" : "var(--text-muted)",
      marginBottom: "var(--space-6)"
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-h1)",
      fontWeight: "var(--weight-bold)",
      letterSpacing: "var(--tracking-display)"
    }
  }, price), cadence ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-body-sm)",
      color: "var(--text-muted)"
    }
  }, cadence) : null), note ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-caption)",
      color: "var(--text-muted)",
      marginTop: 4
    }
  }, note) : null, description ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "var(--space-8) 0 var(--space-9)",
      fontSize: "var(--text-body-sm)",
      color: "var(--text-secondary)",
      lineHeight: "var(--leading-relaxed)"
    }
  }, description) : null, /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: "0 0 var(--space-10)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-5)",
      flex: 1
    }
  }, features.map(t => /*#__PURE__*/React.createElement("li", {
    key: t,
    style: {
      display: "flex",
      gap: "var(--space-5)",
      fontSize: "var(--text-body-sm)",
      color: "var(--ink-700)",
      lineHeight: "var(--leading-normal)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 15,
    color: "var(--signal-verified)"
  }), /*#__PURE__*/React.createElement("span", null, t)))), cta);
}
Object.assign(__ds_scope, { PricingCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/PricingCard.jsx", error: String((e && e.message) || e) }); }

// components/marketing/SectionHeading.jsx
try { (() => {
function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  onDeep = false,
  action,
  style
}) {
  const centred = align === "center";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: centred ? "center" : "flex-end",
      justifyContent: centred ? "center" : "space-between",
      flexDirection: centred ? "column" : "row",
      gap: "var(--space-8)",
      textAlign: centred ? "center" : "left",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: centred ? 680 : undefined
    }
  }, eyebrow ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-eyebrow)",
      fontWeight: "var(--weight-semibold)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-eyebrow)",
      color: onDeep ? "var(--champagne-200)" : "var(--text-brand)",
      marginBottom: "var(--space-4)"
    }
  }, eyebrow) : null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-display-2)",
      fontWeight: "var(--weight-bold)",
      letterSpacing: "var(--tracking-display)",
      lineHeight: "var(--leading-snug)",
      color: onDeep ? "var(--paper-0)" : "var(--text-primary)",
      textWrap: "pretty"
    }
  }, title), description ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "var(--space-6) 0 0",
      fontSize: "var(--text-body)",
      lineHeight: "var(--leading-relaxed)",
      color: onDeep ? "var(--ink-300)" : "var(--text-secondary)",
      maxWidth: 640,
      marginInline: centred ? "auto" : undefined,
      textWrap: "pretty"
    }
  }, description) : null), action && !centred ? /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, action) : null);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/pipeline/NodeCard.jsx
try { (() => {
const STAGE = {
  trigger: "var(--stage-trigger)",
  shield: "var(--stage-shield)",
  data: "var(--stage-data)",
  ai: "var(--stage-ai)",
  sequence: "var(--stage-sequence)",
  logic: "var(--stage-logic)"
};
function NodeCard({
  step,
  title,
  subtitle,
  icon,
  stage = "logic",
  binding,
  selected = false,
  onDeep = true,
  onClick,
  style
}) {
  const c = STAGE[stage] || STAGE.logic;
  const [hover, setHover] = React.useState(false);
  const bg = onDeep ? selected ? "var(--surface-deep-raised)" : "rgba(255,255,255,0.03)" : selected ? "var(--surface-brand-tint)" : "var(--surface-card)";
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      minWidth: 158,
      padding: "13px 14px",
      cursor: onClick ? "pointer" : "default",
      borderRadius: "var(--radius-lg)",
      background: bg,
      border: "var(--border-width-emphasis) solid " + (selected ? c : onDeep ? "var(--border-deep)" : "var(--border-hairline)"),
      boxShadow: selected ? "0 0 22px " + (onDeep ? "rgba(255,255,255,0.06)" : "rgba(16,27,45,0.10)") : "none",
      transform: hover && onClick && !selected ? "translateY(-1px)" : "none",
      transition: "var(--transition-control)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-data)",
      fontSize: "var(--text-micro)",
      fontWeight: "var(--weight-semibold)",
      color: c,
      letterSpacing: "var(--tracking-mono)"
    }
  }, String(step).padStart(2, "0")), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      borderRadius: "var(--radius-xs)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: onDeep ? "rgba(255,255,255,0.06)" : "var(--surface-sunken)",
      color: c
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-body-sm)",
      fontWeight: "var(--weight-semibold)",
      marginBottom: 3,
      color: onDeep ? "var(--paper-0)" : "var(--text-primary)"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-micro)",
      color: onDeep ? "var(--ink-300)" : "var(--text-secondary)",
      lineHeight: "var(--leading-snug)"
    }
  }, subtitle), binding ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 9,
      paddingTop: 8,
      borderTop: "1px solid " + (onDeep ? "var(--border-deep)" : "var(--border-hairline)"),
      fontFamily: "var(--font-data)",
      fontSize: "var(--text-micro)",
      color: onDeep ? "var(--ink-400)" : "var(--text-muted)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, binding) : null);
}
Object.assign(__ds_scope, { NodeCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/pipeline/NodeCard.jsx", error: String((e && e.message) || e) }); }

// components/pipeline/PipelineRail.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function PipelineRail({
  nodes = [],
  activeIndex = 0,
  onSelect,
  onDeep = true,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "stretch",
      gap: 0,
      overflowX: "auto",
      paddingBottom: 4,
      ...style
    }
  }, nodes.map((n, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: n.title
  }, /*#__PURE__*/React.createElement(__ds_scope.NodeCard, _extends({}, n, {
    step: n.step != null ? n.step : i + 1,
    selected: i === activeIndex,
    onDeep: onDeep,
    onClick: () => onSelect && onSelect(i)
  })), i < nodes.length - 1 ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "0 6px",
      color: onDeep ? "var(--ink-500)" : "var(--text-subtle)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 16
  })) : null)));
}
Object.assign(__ds_scope, { PipelineRail });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/pipeline/PipelineRail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/AppShell.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Logo,
  NavItem,
  StatusPill,
  IconButton,
  Badge
} = window.ProspectPALDesignSystem_b8251d;
function AppShell({
  view,
  onView,
  project,
  children
}) {
  const meta = window.VIEW_META[view];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      height: "100%",
      background: "var(--surface-page)",
      fontFamily: "var(--font-body)",
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      width: "var(--layout-app-sidebar)",
      flexShrink: 0,
      background: "var(--surface-deep)",
      borderRight: "1px solid var(--border-deep)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 16px 16px",
      borderBottom: "1px solid var(--border-deep)"
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 30,
    onDeep: true,
    tagline: "GTM Automation Architect"
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      flex: 1,
      padding: "10px 8px",
      overflowY: "auto"
    }
  }, window.NAV.map(n => /*#__PURE__*/React.createElement(NavItem, _extends({
    key: n.id
  }, n, {
    active: view === n.id,
    onClick: () => onView(n.id)
  })))), project ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 14px 12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-micro)",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-eyebrow)",
      color: "var(--ink-400)",
      marginBottom: 6
    }
  }, "Active engine"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-caption)",
      padding: "7px 10px",
      borderRadius: "var(--radius-sm)",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid var(--border-deep)",
      color: "var(--ink-200)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, project)) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 14px",
      borderTop: "1px solid var(--border-deep)",
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: "var(--radius-sm)",
      flexShrink: 0,
      background: "var(--cobalt-600)",
      color: "var(--paper-0)",
      fontWeight: 700,
      fontSize: 12,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, "AR"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-caption)",
      fontWeight: 600,
      color: "var(--paper-0)"
    }
  }, "Alex Rivera"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-micro)",
      color: "var(--champagne-200)",
      fontWeight: 500
    }
  }, "Pro plan \xB7 BYOK")), /*#__PURE__*/React.createElement(IconButton, {
    icon: "log-out",
    label: "Sign out",
    variant: "deep",
    size: 26
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      height: "var(--layout-topbar)",
      flexShrink: 0,
      background: "var(--surface-card)",
      borderBottom: "1px solid var(--border-hairline)",
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-h4)",
      fontWeight: 700,
      letterSpacing: "var(--tracking-heading)"
    }
  }, meta.title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-caption)",
      color: "var(--text-muted)"
    }
  }, meta.crumb)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral",
    mono: true,
    shape: "square"
  }, "run_id pae_9f21c"), /*#__PURE__*/React.createElement(StatusPill, {
    label: "Engine ready"
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "circle-help",
    label: "Help"
  }))), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      minHeight: 0,
      overflow: "hidden"
    }
  }, children)));
}
Object.assign(window, {
  AppShell
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/BuilderScreen.jsx
try { (() => {
const {
  Button,
  Input,
  Select,
  Textarea,
  Label,
  ChatBubble,
  TypingDots,
  PipelineRail,
  NodeCard,
  StatusPill,
  Badge,
  Icon
} = window.ProspectPALDesignSystem_b8251d;
function BuilderScreen({
  onCompiled
}) {
  const [tab, setTab] = React.useState("chat");
  const [msgs, setMsgs] = React.useState([{
    role: "assistant",
    text: "I'm your GTM automation architect. Tell me who you sell to, which tools hold your data, and how leads should enter the system."
  }]);
  const [draft, setDraft] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const [active, setActive] = React.useState(2);
  const [crm, setCrm] = React.useState("hubspot");
  const [compiling, setCompiling] = React.useState(false);
  const send = () => {
    if (!draft.trim()) return;
    const next = [...msgs, {
      role: "user",
      text: draft.trim()
    }];
    setMsgs(next);
    setDraft("");
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMsgs([...next, {
        role: "assistant",
        text: "Understood. I've bound CRM dedupe to HubSpot (OAuth2) and enrichment to Apollo (API key). Two credentials still need connecting — compile when you're ready."
      }]);
    }, 1100);
  };
  const compile = () => {
    setCompiling(true);
    setTimeout(() => {
      setCompiling(false);
      onCompiled();
    }, 1200);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      height: "100%",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "var(--layout-pane)",
      flexShrink: 0,
      background: "var(--surface-card)",
      borderRight: "1px solid var(--border-hairline)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 18px",
      borderBottom: "1px solid var(--border-hairline)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-h4)",
      fontWeight: 700
    }
  }, "PAE workflow compiler"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-micro)",
      color: "var(--text-muted)"
    }
  }, "PAL intake gate \xB7 9-node reference pattern")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      background: "var(--surface-sunken)",
      padding: 3,
      borderRadius: "var(--radius-sm)"
    }
  }, [["chat", "Chat"], ["form", "Form"]].map(([id, label]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => setTab(id),
    style: {
      padding: "4px 11px",
      fontSize: "var(--text-micro)",
      fontWeight: 600,
      cursor: "pointer",
      border: "none",
      borderRadius: "var(--radius-xs)",
      fontFamily: "inherit",
      background: tab === id ? "var(--surface-card)" : "transparent",
      color: tab === id ? "var(--text-brand)" : "var(--text-muted)",
      boxShadow: tab === id ? "var(--shadow-hairline)" : "none"
    }
  }, label)))), tab === "chat" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "16px 18px",
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, msgs.map((m, i) => /*#__PURE__*/React.createElement(ChatBubble, {
    key: i,
    role: m.role
  }, m.text)), thinking ? /*#__PURE__*/React.createElement(TypingDots, {
    label: "Resolving tool bindings"
  }) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px",
      borderTop: "1px solid var(--border-hairline)",
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: draft,
    onChange: setDraft,
    onSubmitKey: send,
    placeholder: "e.g. VP Sales at Series A SaaS, HubSpot + Apollo\u2026"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: send,
    icon: "arrow-up"
  }, "Send")), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    fullWidth: true,
    icon: "zap",
    onClick: compile,
    disabled: compiling
  }, compiling ? "Compiling engine…" : "Compile GTM engine"))) : /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "18px",
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    step: 1,
    hint: "no gate"
  }, "Ingestion trigger"), /*#__PURE__*/React.createElement(Select, {
    value: "schedule",
    options: [{
      value: "schedule",
      label: "Daily cron (schedule trigger)"
    }, {
      value: "csv",
      label: "Spreadsheet upload"
    }, {
      value: "webhook",
      label: "Live intent webhook"
    }]
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    step: 2,
    hint: "hard gate"
  }, "CRM shield"), /*#__PURE__*/React.createElement(Select, {
    value: crm,
    onChange: setCrm,
    options: [{
      value: "hubspot",
      label: "HubSpot CRM (OAuth2)"
    }, {
      value: "salesforce",
      label: "Salesforce (OAuth2)"
    }, {
      value: "attio",
      label: "Attio (API key)"
    }]
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    step: 3,
    hint: "hard gate"
  }, "Data & enrichment"), /*#__PURE__*/React.createElement(Select, {
    value: "apollo",
    options: [{
      value: "apollo",
      label: "Apollo.io (API key)"
    }, {
      value: "clay",
      label: "Clay waterfall (API key)"
    }]
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    step: 4,
    hint: "hard gate"
  }, "Deploy target"), /*#__PURE__*/React.createElement(Input, {
    icon: "link",
    mono: true,
    value: "https://acme.n8n.cloud"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    step: 5
  }, "Target ICP & titles"), /*#__PURE__*/React.createElement(Textarea, {
    rows: 3,
    placeholder: "VP of Sales, Head of RevOps at US B2B SaaS, 50\u2013500 employees\u2026"
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    fullWidth: true,
    icon: "zap",
    onClick: compile
  }, "Generate & compile engine"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: "var(--surface-deep)",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 20px",
      borderBottom: "1px solid var(--border-deep)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-data)",
      fontSize: "var(--text-caption)",
      color: "var(--ink-300)"
    }
  }, "prospect-pal-engine.json"), /*#__PURE__*/React.createElement(StatusPill, {
    label: "9-node graph connected",
    onDeep: true
  })), /*#__PURE__*/React.createElement(Badge, {
    tone: "deep",
    mono: true,
    shape: "square"
  }, "trigger: SCHEDULE")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: "auto",
      padding: "22px 20px"
    }
  }, /*#__PURE__*/React.createElement(PipelineRail, {
    nodes: window.NINE_NODES,
    activeIndex: active,
    onSelect: setActive
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-deep-raised)",
      border: "1px solid var(--border-deep)",
      borderRadius: "var(--radius-xl)",
      padding: "18px 20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-eyebrow)",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-eyebrow)",
      color: "var(--champagne-200)",
      marginBottom: 6
    }
  }, "Node ", String(active + 1).padStart(2, "0"), " specification"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-h3)",
      fontWeight: 600,
      color: "var(--paper-0)",
      marginBottom: 6
    }
  }, window.NINE_NODES[active].title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-body-sm)",
      color: "var(--ink-300)",
      lineHeight: "var(--leading-relaxed)"
    }
  }, window.NINE_NODES[active].subtitle, ". Bound to ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-data)",
      color: "var(--ink-100)"
    }
  }, window.NINE_NODES[active].binding), ". Secrets stay as ENV references; nothing is written to Prospect PAL.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(NodeCard, {
    step: 6,
    stage: "logic",
    icon: "scale",
    title: "Approval switch",
    subtitle: "Always present \u2014 no silent sends"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(255,255,255,0.03)",
      border: "1px solid var(--border-deep)",
      borderRadius: "var(--radius-lg)",
      padding: "12px 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-micro)",
      color: "var(--ink-400)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-eyebrow)",
      fontWeight: 600,
      marginBottom: 8
    }
  }, "Requires connection"), ["ENV:CLAY_API_KEY", "ENV:SMARTLEAD_API_KEY"].map(k => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      fontFamily: "var(--font-data)",
      fontSize: "var(--text-micro)",
      color: "var(--ink-200)",
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "key-round",
    size: 12,
    color: "var(--champagne-300)"
  }), k))))))));
}
Object.assign(window, {
  BuilderScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/BuilderScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/DashboardScreen.jsx
try { (() => {
const {
  StatTile,
  Card,
  Button,
  PipelineRail,
  Badge
} = window.ProspectPALDesignSystem_b8251d;
const ACTIONS = [{
  id: "builder",
  icon: "workflow",
  title: "Workflow Builder",
  desc: "Chat or form intake, compiled to a 9-node graph",
  primary: true
}, {
  id: "wizard",
  icon: "wand-sparkles",
  title: "Intake Wizard",
  desc: "Eight gated steps: trigger, CRM, outreach, approval"
}, {
  id: "outputs",
  icon: "package",
  title: "Outputs & Deploy",
  desc: "Ack JSON, workflow.json, BUILD_PROMPT.md"
}, {
  id: "signals",
  icon: "radio",
  title: "Tech Signals",
  desc: "Companies running n8n and hiring GTM engineers"
}];
function DashboardScreen({
  onView
}) {
  const {
    Icon
  } = window.ProspectPALDesignSystem_b8251d;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      overflowY: "auto",
      padding: "28px 32px 40px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-h1)",
      fontWeight: 700,
      letterSpacing: "var(--tracking-display)"
    }
  }, "Good afternoon, Alex"), /*#__PURE__*/React.createElement(Badge, {
    tone: "premium",
    icon: "key-round"
  }, "BYOK workspace")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 24px",
      fontSize: "var(--text-body-sm)",
      color: "var(--text-secondary)"
    }
  }, "Your last compile is approved and waiting to deploy to ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-data)"
    }
  }, "acme.n8n.cloud"), "."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 12,
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement(StatTile, {
    value: "9-node",
    label: "Canonical graph"
  }), /*#__PURE__*/React.createElement(StatTile, {
    value: "100",
    unit: "% guard",
    label: "Dedupe accuracy",
    tone: "verified"
  }), /*#__PURE__*/React.createElement(StatTile, {
    value: "4",
    unit: "engines",
    label: "Compiled this month",
    tone: "brand"
  }), /*#__PURE__*/React.createElement(StatTile, {
    value: "2",
    unit: "pending",
    label: "Connections needed",
    tone: "premium"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-eyebrow)",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-eyebrow)",
      color: "var(--text-muted)",
      marginBottom: 10
    }
  }, "Workspace"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 12,
      marginBottom: 26
    }
  }, ACTIONS.map(a => /*#__PURE__*/React.createElement(Card, {
    key: a.id,
    interactive: true,
    pad: 20,
    onClick: () => onView(a.id),
    tone: a.primary ? "accent" : "paper",
    style: {
      display: "flex",
      gap: 14,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: "var(--radius-md)",
      flexShrink: 0,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: a.primary ? "var(--cobalt-600)" : "var(--surface-sunken)",
      color: a.primary ? "var(--paper-0)" : "var(--ink-600)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a.icon,
    size: 19
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: "var(--text-h4)",
      fontWeight: 600,
      marginBottom: 3
    }
  }, a.title), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: "var(--text-caption)",
      color: "var(--text-secondary)",
      lineHeight: "var(--leading-normal)"
    }
  }, a.desc))))), /*#__PURE__*/React.createElement(Card, {
    pad: 22
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 16,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-h3)",
      fontWeight: 600,
      letterSpacing: "var(--tracking-heading)"
    }
  }, "The canonical 9-node architecture"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-caption)",
      color: "var(--text-secondary)",
      marginTop: 3
    }
  }, "Every compiled engine specialises this graph \u2014 only the bindings change.")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "workflow",
    onClick: () => onView("builder")
  }, "Open builder")), /*#__PURE__*/React.createElement(PipelineRail, {
    nodes: window.NINE_NODES.slice(0, 5),
    activeIndex: -1,
    onDeep: false
  }))));
}
Object.assign(window, {
  DashboardScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/DashboardScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/OutputsScreen.jsx
try { (() => {
const {
  Card,
  Badge,
  Button,
  DeliverableCard,
  StatusPill,
  Icon,
  IntegrationCard
} = window.ProspectPALDesignSystem_b8251d;
const ACK = `{
  "artifact_type": "pae-compile-ack",
  "run_id": "pae_9f21c",
  "status": "approved",
  "resolved_bindings": [
    { "capability": "crm-read-write",
      "concrete_binding": "n8n-nodes-base.hubspot",
      "auth_mode": "OAuth2", "already_connected": true },
    { "capability": "contact-enrichment",
      "concrete_binding": "httpRequest → apollo.io",
      "auth_mode": "API key", "already_connected": false }
  ],
  "workflow": { "node_count": 9 },
  "requires_connection": ["ENV:CLAY_API_KEY", "ENV:SMARTLEAD_API_KEY"],
  "next_actions": ["review_workflow", "edit_intake", "connect_and_deploy"]
}`;
function OutputsScreen({
  onDeploy
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      overflowY: "auto",
      padding: "26px 32px 40px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 16,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-h1)",
      fontWeight: 700,
      letterSpacing: "var(--tracking-display)"
    }
  }, "Compile approved"), /*#__PURE__*/React.createElement(StatusPill, {
    label: "9 nodes \xB7 quality checks passed"
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-body-sm)",
      color: "var(--text-secondary)"
    }
  }, "Two credentials still need connecting. You can deploy now and wire them in n8n, or connect first.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    icon: "download"
  }, "Download JSON"), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    icon: "rocket",
    onClick: onDeploy
  }, "Connect & deploy"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.1fr 1fr",
      gap: 16,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Card, {
    pad: 0,
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px",
      borderBottom: "1px solid var(--border-hairline)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-data)",
      fontSize: "var(--text-caption)",
      color: "var(--text-brand)"
    }
  }, "ack.json"), /*#__PURE__*/React.createElement(Badge, {
    tone: "verified",
    icon: "check"
  }, "approved")), /*#__PURE__*/React.createElement("pre", {
    style: {
      margin: 0,
      padding: "14px 16px",
      fontFamily: "var(--font-data)",
      fontSize: 11.5,
      lineHeight: 1.65,
      color: "var(--ink-700)",
      background: "var(--surface-sunken)",
      overflowX: "auto"
    }
  }, ACK)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Card, {
    pad: 18
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-eyebrow)",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-eyebrow)",
      color: "var(--text-muted)",
      marginBottom: 10
    }
  }, "Requires connection"), ["ENV:CLAY_API_KEY", "ENV:SMARTLEAD_API_KEY"].map(k => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "8px 0",
      borderBottom: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "var(--font-data)",
      fontSize: "var(--text-caption)",
      color: "var(--ink-700)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "key-round",
    size: 13,
    color: "var(--signal-attention)"
  }), k), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    iconRight: "arrow-up-right"
  }, "Connect")))), /*#__PURE__*/React.createElement(IntegrationCard, {
    name: "HubSpot",
    capability: "crm-read-write",
    description: "OAuth2 connected \xB7 dedupe + upsert",
    connected: true
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(DeliverableCard, {
    file: "workflow.n8n.json",
    badge: "Import ready",
    label: "Production workflow",
    description: "Nine wired nodes with error catchers and expressions."
  }), /*#__PURE__*/React.createElement(DeliverableCard, {
    file: "BUILD_PROMPT.md",
    badge: "Documentation",
    label: "Deploy checklist",
    description: "Every ENV var and OAuth flow still to wire, in order."
  }), /*#__PURE__*/React.createElement(DeliverableCard, {
    file: "email-framework.md",
    badge: "Copywriting",
    label: "3-sentence PAS scripts",
    description: "Problem-agitate-solve templates with variable maps."
  }))));
}
Object.assign(window, {
  OutputsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/OutputsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/SettingsScreen.jsx
try { (() => {
const {
  Card,
  Badge,
  Button,
  Input,
  Label,
  StatusPill,
  Icon,
  IntegrationCard
} = window.ProspectPALDesignSystem_b8251d;
const APPS = [{
  name: "Apollo",
  icon: "search",
  capability: "contact-enrichment",
  description: "Lead discovery & contact search",
  connected: true
}, {
  name: "HubSpot",
  icon: "database",
  capability: "crm-read-write",
  description: "CRM sync & deduplication",
  connected: true
}, {
  name: "Salesforce",
  icon: "cloud",
  capability: "crm-read-write",
  description: "Enterprise CRM integration"
}, {
  name: "Slack",
  icon: "message-square",
  capability: "approval-gate",
  description: "Approval gate & daily summaries",
  connected: true
}, {
  name: "Gmail",
  icon: "mail",
  capability: "sequencer",
  description: "Email sending fallback"
}, {
  name: "LinkedIn",
  icon: "linkedin",
  capability: "lead-source",
  description: "Professional network prospecting"
}];
function SettingsScreen() {
  const [saved, setSaved] = React.useState(false);
  const [tested, setTested] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      overflowY: "auto",
      padding: "28px 32px 40px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 860,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "0 0 4px",
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-h1)",
      fontWeight: 700,
      letterSpacing: "var(--tracking-display)"
    }
  }, "Integrations & keys"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 22px",
      fontSize: "var(--text-body-sm)",
      color: "var(--text-secondary)"
    }
  }, "Connect your tools over OAuth \u2014 no API keys to copy-paste."), /*#__PURE__*/React.createElement(Card, {
    tone: "accent",
    pad: 16,
    style: {
      marginBottom: 26,
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "link-2",
    size: 18,
    color: "var(--cobalt-700)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-h4)",
      fontWeight: 600
    }
  }, "OAuth broker active"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-caption)",
      color: "var(--text-secondary)",
      marginTop: 2
    }
  }, "Connections are OAuth-managed. Credentials are never stored on Prospect PAL servers.")), /*#__PURE__*/React.createElement(StatusPill, {
    label: "Active",
    tone: "brand"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-eyebrow)",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-eyebrow)",
      color: "var(--text-muted)",
      marginBottom: 12
    }
  }, "Tool connections"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      marginBottom: 30
    }
  }, APPS.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.name,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(IntegrationCard, a), /*#__PURE__*/React.createElement(Button, {
    variant: a.connected ? "ghost" : "outline",
    size: "sm",
    fullWidth: true,
    icon: a.connected ? "check" : "plug",
    disabled: a.connected
  }, a.connected ? "Connected" : "Connect " + a.name)))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-eyebrow)",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-eyebrow)",
      color: "var(--text-muted)",
      marginBottom: 12
    }
  }, "n8n instance \u2014 push workflows directly"), /*#__PURE__*/React.createElement(Card, {
    pad: 22,
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: "var(--radius-md)",
      background: "var(--surface-sunken)",
      color: "var(--ink-600)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "workflow",
    size: 19
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-h4)",
      fontWeight: 600
    }
  }, "n8n workspace"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-caption)",
      color: "var(--text-secondary)"
    }
  }, "After a compile, push the workflow straight into your canvas.")), tested ? /*#__PURE__*/React.createElement(Badge, {
    tone: "verified",
    icon: "check"
  }, "12 workflows") : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Instance URL"), /*#__PURE__*/React.createElement(Input, {
    icon: "link",
    mono: true,
    value: "https://acme.app.n8n.cloud"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-micro)",
      color: "var(--text-muted)",
      marginTop: 5,
      fontFamily: "var(--font-data)"
    }
  }, "self-hosted: http://localhost:5678 \xB7 cloud: https://name.app.n8n.cloud")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    hint: "browser only, never our storage"
  }, "API key"), /*#__PURE__*/React.createElement(Input, {
    icon: "key-round",
    mono: true,
    type: "password",
    value: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-micro)",
      color: "var(--text-muted)",
      marginTop: 5
    }
  }, "In n8n: Settings \u2192 API \u2192 Create API key")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    icon: "activity",
    onClick: () => setTested(true)
  }, "Test connection"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: saved ? "check" : "save",
    onClick: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }
  }, saved ? "Saved" : "Save")))), /*#__PURE__*/React.createElement(Card, {
    tone: "sunken",
    pad: 16,
    style: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 15,
    color: "var(--text-muted)"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-caption)",
      color: "var(--text-secondary)",
      lineHeight: "var(--leading-relaxed)"
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: 600,
      color: "var(--ink-700)"
    }
  }, "Security."), " OAuth tokens are held by the broker, never on Prospect PAL servers. Your n8n API key lives in your browser only and is sent directly to your instance."))));
}
Object.assign(window, {
  SettingsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/SettingsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/SignalsScreen.jsx
try { (() => {
const {
  LeadSignalCard,
  Select,
  Label,
  Button,
  Badge,
  Icon,
  Card
} = window.ProspectPALDesignSystem_b8251d;
const LEADS = [{
  company: "NexusFlow Data",
  domain: "nexusflow.io · Data infra · 84 emp",
  round: "Series A · $12M",
  stack: ["n8n self-hosted", "HubSpot", "Apollo"],
  trigger: "Hiring GTM Automation Engineer — job posted 6 days ago",
  contact: "Marcus Vance, VP RevOps"
}, {
  company: "HyperScale AI",
  domain: "hyperscale.ai · AI tooling · 210 emp",
  round: "Series B · $28M",
  stack: ["n8n cloud", "Salesforce", "Clay", "Smartlead"],
  trigger: "Hiring Head of Outbound Growth — 2 open roles",
  contact: "Elena Rostova, Head of Growth"
}, {
  company: "CloudPulse Systems",
  domain: "cloudpulse.dev · DevOps · 31 emp",
  round: "Seed · $4.5M",
  stack: ["n8n self-hosted", "Attio", "Instantly"],
  trigger: "Hiring Founding GTM Specialist — posted this week",
  contact: "Devon Chen, Co-founder"
}, {
  company: "Lattice Freight",
  domain: "latticefreight.com · Logistics · 140 emp",
  round: "Series A · $9M",
  stack: ["n8n cloud", "HubSpot", "Lemlist"],
  trigger: "Hiring RevOps Manager — replacing manual prospecting",
  contact: "Priya Raman, Director of Revenue"
}, {
  company: "Northgate Health",
  domain: "northgate.health · Health SaaS · 320 emp",
  round: "Series C · $55M",
  stack: ["n8n self-hosted", "Salesforce", "ZoomInfo"],
  trigger: "Hiring Automation Engineer, GTM — team of 3",
  contact: "Tom Werner, VP Revenue Ops"
}, {
  company: "Silverline Labs",
  domain: "silverline.dev · Dev tools · 22 emp",
  round: "Pre-seed · $1.8M",
  stack: ["n8n self-hosted", "Attio", "Apollo"],
  trigger: "Founder running outbound solo — n8n detected 3 weeks ago",
  contact: "Ana Duarte, Co-founder & CEO"
}];
function SignalsScreen() {
  const [copied, setCopied] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 32px",
      background: "var(--surface-card)",
      borderBottom: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 16,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 3
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-h2)",
      fontWeight: 700,
      letterSpacing: "var(--tracking-heading)"
    }
  }, "n8n tech signals & GTM hiring leads"), /*#__PURE__*/React.createElement(Badge, {
    tone: "verified",
    icon: "check"
  }, LEADS.length, " matches")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-caption)",
      color: "var(--text-secondary)"
    }
  }, "Companies running n8n in their stack and actively recruiting GTM automation talent.")), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    icon: "refresh-cw"
  }, "Refresh stream")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 220
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Technology signal"), /*#__PURE__*/React.createElement(Select, {
    value: "n8n",
    options: [{
      value: "n8n",
      label: "n8n (self-hosted / cloud)"
    }, {
      value: "hubspot",
      label: "HubSpot CRM"
    }, {
      value: "apollo",
      label: "Apollo.io"
    }, {
      value: "all",
      label: "All stack signals"
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 220
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Hiring trigger"), /*#__PURE__*/React.createElement(Select, {
    value: "all",
    options: [{
      value: "all",
      label: "All GTM roles"
    }, {
      value: "gtm",
      label: "GTM Automation Engineer"
    }, {
      value: "revops",
      label: "RevOps Manager"
    }, {
      value: "growth",
      label: "Head of Growth / Outbound"
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 200
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Funding event"), /*#__PURE__*/React.createElement(Select, {
    value: "all",
    options: [{
      value: "all",
      label: "All stages"
    }, {
      value: "seed",
      label: "Seed"
    }, {
      value: "a",
      label: "Series A"
    }, {
      value: "b",
      label: "Series B"
    }]
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "22px 32px 36px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 16
    }
  }, LEADS.map(l => /*#__PURE__*/React.createElement("div", {
    key: l.company,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(LeadSignalCard, {
    company: l.company,
    round: l.round,
    stack: l.stack,
    trigger: l.trigger,
    contact: l.contact
  }), /*#__PURE__*/React.createElement(Card, {
    pad: 12,
    tone: "sunken",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-data)",
      fontSize: "var(--text-micro)",
      color: "var(--text-muted)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, l.domain), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: copied === l.company ? "check" : "copy",
    onClick: () => {
      setCopied(l.company);
      setTimeout(() => setCopied(null), 1600);
    }
  }, copied === l.company ? "Copied" : "Copy email"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: 22,
      fontSize: "var(--text-caption)",
      color: "var(--text-secondary)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield-check",
    size: 15,
    color: "var(--signal-verified)"
  }), "Contact emails are revealed through your own enrichment credentials \u2014 Prospect PAL never resells lead data.")));
}
Object.assign(window, {
  SignalsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/SignalsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/WizardScreen.jsx
try { (() => {
const {
  StepIndicator,
  ToolOptionCard,
  Button,
  Card,
  Badge,
  Label,
  Input,
  Icon
} = window.ProspectPALDesignSystem_b8251d;
const STEPS = ["Trigger", "CRM", "Outreach", "Deploy target", "Data tool", "LLM", "Approval", "Review"];
const OPTIONS = {
  0: [["upload", "Spreadsheet upload", "CSV of accounts or contacts", ""], ["database", "CRM import", "Daily cron over your CRM", "cron"], ["webhook", "Live data-tool search", "Search on intent signals", "webhook"]],
  1: [["database", "HubSpot", "Dedupe + contact upsert", "OAuth2"], ["cloud", "Salesforce", "Enterprise pipeline guard", "OAuth2"], ["sparkle", "Attio", "Real-time CRM of record", "API key"]],
  2: [["send", "Smartlead", "Multi-inbox warmup + sending", "API key"], ["mail", "Instantly", "High-volume cold sequencing", "API key"], ["inbox", "HubSpot Sales", "Native sequence enrolment", "OAuth2"]]
};
function WizardScreen({
  onFinish
}) {
  const [step, setStep] = React.useState(1);
  const [picked, setPicked] = React.useState({
    0: 1,
    1: 0,
    2: 0
  });
  const opts = OPTIONS[step] || OPTIONS[0];
  const hardGate = step !== 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      overflowY: "auto",
      padding: "26px 32px 40px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(StepIndicator, {
    steps: STEPS,
    current: step,
    onStep: setStep
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-h1)",
      fontWeight: 700,
      letterSpacing: "var(--tracking-display)"
    }
  }, step === 0 ? "How should leads enter the system?" : step === 1 ? "Which platform holds your contact data today?" : "Which platform should send the messages?"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 0",
      fontSize: "var(--text-body-sm)",
      color: "var(--text-secondary)",
      maxWidth: 560,
      lineHeight: "var(--leading-relaxed)"
    }
  }, "We only ask which provider \u2014 never a key. Credentials are exchanged later, in your browser, directly with the provider.")), /*#__PURE__*/React.createElement(Badge, {
    tone: hardGate ? "attention" : "neutral",
    icon: hardGate ? "lock" : "circle-dashed"
  }, hardGate ? "Hard gate" : "Optional")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      marginTop: 20
    }
  }, opts.map(([icon, title, caption, meta], i) => /*#__PURE__*/React.createElement(ToolOptionCard, {
    key: title,
    icon: icon,
    title: title,
    caption: caption,
    meta: meta,
    selected: picked[step] === i,
    onClick: () => setPicked({
      ...picked,
      [step]: i
    })
  }))), step === 1 ? /*#__PURE__*/React.createElement(Card, {
    pad: 18,
    tone: "sunken",
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Label, {
    hint: "never stored"
  }, "Instance the workflow deploys to"), /*#__PURE__*/React.createElement(Input, {
    icon: "link",
    mono: true,
    value: "https://acme.n8n.cloud"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      alignItems: "flex-start",
      marginTop: 10,
      fontSize: "var(--text-caption)",
      color: "var(--text-secondary)",
      lineHeight: "var(--leading-normal)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield-check",
    size: 14,
    color: "var(--signal-verified)"
  }), /*#__PURE__*/React.createElement("span", null, "The compiled workflow lives entirely on your instance. Prospect PAL keeps no credentials after the deploy call."))) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    icon: "arrow-left",
    onClick: () => setStep(Math.max(0, step - 1))
  }, "Back"), step < 2 ? /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    iconRight: "arrow-right",
    onClick: () => setStep(step + 1)
  }, "Continue") : /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    iconRight: "arrow-right",
    onClick: onFinish
  }, "Review intake JSON"))));
}
Object.assign(window, {
  WizardScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/WizardScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.jsx
try { (() => {
const NINE_NODES = [{
  title: "Intake & Cron",
  subtitle: "Schedule / Webhook / CSV",
  icon: "zap",
  stage: "trigger",
  binding: "n8n-nodes-base.scheduleTrigger"
}, {
  title: "Data Normalizer",
  subtitle: "Domain sanitize + schema map",
  icon: "braces",
  stage: "logic",
  binding: "n8n-nodes-base.code"
}, {
  title: "CRM Dedupe Shield",
  subtitle: "Halt on active deals",
  icon: "shield-check",
  stage: "shield",
  binding: "n8n-nodes-base.hubspot"
}, {
  title: "Data Tool Adapter",
  subtitle: "Apollo waterfall reveal",
  icon: "search",
  stage: "data",
  binding: "httpRequest → apollo.io"
}, {
  title: "AI Research & PAS Copy",
  subtitle: "3-sentence problem-agitate-solve",
  icon: "sparkles",
  stage: "ai",
  binding: "langchain.agent + Claude"
}, {
  title: "Approval Switch",
  subtitle: "Slack review vs. full-auto",
  icon: "scale",
  stage: "logic",
  binding: "n8n-nodes-base.if"
}, {
  title: "CRM Contact Creation",
  subtitle: "Upsert back to CRM",
  icon: "database",
  stage: "shield",
  binding: "n8n-nodes-base.hubspot"
}, {
  title: "Sequence Enrollment",
  subtitle: "Smartlead enrol + warmup",
  icon: "send",
  stage: "sequence",
  binding: "httpRequest → smartlead"
}, {
  title: "Review Alert",
  subtitle: "1-click Slack approval",
  icon: "message-square",
  stage: "logic",
  binding: "n8n-nodes-base.slack"
}];
const NAV = [{
  id: "home",
  label: "Dashboard",
  icon: "layout-grid"
}, {
  id: "builder",
  label: "Workflow Builder",
  icon: "workflow"
}, {
  id: "wizard",
  label: "Intake Wizard",
  icon: "wand-sparkles"
}, {
  id: "outputs",
  label: "Outputs & Deploy",
  icon: "package"
}, {
  id: "signals",
  label: "Tech Signals",
  icon: "radio",
  badge: "1.4k"
}, {
  id: "settings",
  label: "Integrations & Keys",
  icon: "plug"
}];
const VIEW_META = {
  home: {
    title: "Dashboard",
    crumb: "Welcome back"
  },
  builder: {
    title: "Workflow Builder",
    crumb: "Intake → bindings → compile"
  },
  wizard: {
    title: "Intake Wizard",
    crumb: "PAL intake gate · 8 steps"
  },
  outputs: {
    title: "Outputs & Deploy",
    crumb: "Review, download, push to n8n"
  },
  signals: {
    title: "Tech Signals",
    crumb: "n8n stack detection & hiring intent"
  },
  settings: {
    title: "Integrations & Keys",
    crumb: "Connect tools · nothing stored"
  }
};
Object.assign(window, {
  NINE_NODES,
  NAV,
  VIEW_META
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Hero.jsx
try { (() => {
const {
  Button,
  Badge,
  StatTile,
  PipelineRail,
  StatusPill,
  Icon
} = window.ProspectPALDesignSystem_b8251d;
function Hero({
  onCheckout,
  onDemo
}) {
  const [active, setActive] = React.useState(2);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "64px 32px 0",
      maxWidth: "var(--layout-max)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "brand",
    icon: "shield-check",
    style: {
      marginBottom: 22
    }
  }, "Approval-gated by default"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "0 0 18px",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: "var(--text-display-1)",
      letterSpacing: "var(--tracking-display)",
      lineHeight: "var(--leading-tight)",
      textWrap: "balance"
    }
  }, "Answer eight questions.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--cobalt-600)"
    }
  }, "Get a workflow you own.")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 auto 30px",
      maxWidth: 660,
      fontSize: 19,
      lineHeight: "var(--leading-relaxed)",
      color: "var(--text-secondary)",
      textWrap: "pretty"
    }
  }, "Prospect PAL gates your intake, resolves every tool to a concrete n8n node, and compiles a nine-node outbound engine that deploys to ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: "normal",
      color: "var(--text-primary)",
      fontWeight: 500
    }
  }, "your"), " instance. Nothing sends without a human approval switch."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      justifyContent: "center",
      flexWrap: "wrap",
      marginBottom: 36
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    icon: "zap",
    onClick: onCheckout
  }, "Build my engine \u2014 $99/mo"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "lg",
    icon: "play",
    onClick: onDemo
  }, "See a compile, 2 min")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 12,
      marginBottom: 44
    }
  }, /*#__PURE__*/React.createElement(StatTile, {
    value: "9-node",
    label: "Canonical graph"
  }), /*#__PURE__*/React.createElement(StatTile, {
    value: "0",
    unit: "deal collisions",
    label: "CRM dedupe shield",
    tone: "verified"
  }), /*#__PURE__*/React.createElement(StatTile, {
    value: "3",
    unit: "sentences",
    label: "PAS email framework",
    tone: "brand"
  }), /*#__PURE__*/React.createElement(StatTile, {
    value: "100",
    unit: "% BYOK",
    label: "Your keys, your instance",
    tone: "premium"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-deep)",
      borderRadius: "var(--radius-2xl)",
      border: "1px solid var(--border-deep)",
      boxShadow: "var(--shadow-overlay)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 18px",
      borderBottom: "1px solid var(--border-deep)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-data)",
      fontSize: "var(--text-caption)",
      color: "var(--ink-300)"
    }
  }, "workflow.n8n.json \xB7 9 nodes \xB7 approved"), /*#__PURE__*/React.createElement(StatusPill, {
    label: "Graph compiled",
    onDeep: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "22px 20px"
    }
  }, /*#__PURE__*/React.createElement(PipelineRail, {
    nodes: window.NINE_NODES,
    activeIndex: active,
    onSelect: setActive
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      padding: "16px 18px",
      borderRadius: "var(--radius-lg)",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid var(--border-deep)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 20,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 640
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-data)",
      fontSize: "var(--text-micro)",
      color: "var(--champagne-200)",
      marginBottom: 5
    }
  }, "NODE ", String(active + 1).padStart(2, "0"), " \xB7 ", window.NINE_NODES[active].binding), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-body-sm)",
      color: "var(--ink-200)",
      lineHeight: "var(--leading-relaxed)"
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--paper-0)",
      fontWeight: 600
    }
  }, window.NINE_NODES[active].title), " \u2014 ", window.NINE_NODES[active].subtitle, ".")), /*#__PURE__*/React.createElement(Button, {
    variant: "inverse",
    icon: "settings-2",
    onClick: onCheckout
  }, "Configure this node")))));
}
Object.assign(window, {
  Hero
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Sections.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  SectionHeading,
  IntegrationCard,
  DeliverableCard,
  LeadSignalCard,
  PricingCard,
  Button,
  Badge,
  Icon
} = window.ProspectPALDesignSystem_b8251d;
const TOOLS = [{
  name: "HubSpot",
  capability: "crm-read-write",
  description: "Dedupe shield and contact upsert",
  icon: "database",
  connected: true
}, {
  name: "Salesforce",
  capability: "crm-read-write",
  description: "Enterprise pipeline protection",
  icon: "cloud"
}, {
  name: "Apollo.io",
  capability: "contact-enrichment",
  description: "Verified decision-maker reveal",
  icon: "search",
  connected: true
}, {
  name: "Clay",
  capability: "contact-enrichment",
  description: "Waterfall company enrichment",
  icon: "layers"
}, {
  name: "Smartlead",
  capability: "sequencer",
  description: "Multi-inbox warmup and sending",
  icon: "send"
}, {
  name: "Instantly",
  capability: "sequencer",
  description: "High-volume cold sequencing",
  icon: "mail"
}, {
  name: "Anthropic Claude",
  capability: "llm-inference",
  description: "Research and PAS copywriting",
  icon: "sparkles",
  connected: true
}, {
  name: "Slack",
  capability: "approval-gate",
  description: "One-click human review",
  icon: "message-square"
}, {
  name: "n8n",
  capability: "deploy-target",
  description: "Your own cloud or self-hosted instance",
  icon: "workflow"
}];
const DELIVERABLES = [{
  file: "workflow.n8n.json",
  badge: "Import ready",
  label: "Production workflow",
  description: "Nine wired nodes with error catchers, expressions and sub-workflow hooks."
}, {
  file: "BUILD_PROMPT.md",
  badge: "Documentation",
  label: "Deploy checklist",
  description: "Every credential and ENV var still to wire, in the order you'll need them."
}, {
  file: ".env.template",
  badge: "Security",
  label: "Zero hard-coded secrets",
  description: "Providers referenced by ENV name only — no key ever leaves your browser."
}, {
  file: "email-framework.md",
  badge: "Copywriting",
  label: "3-sentence PAS scripts",
  description: "Problem-agitate-solve templates with dynamic variable mappings."
}, {
  file: "PRD.md",
  badge: "Strategy",
  label: "Pipeline specification",
  description: "ICP matrix, data dictionary, bounce guardrails and compliance rules."
}, {
  file: "ack.json",
  badge: "API contract",
  label: "Compile receipt",
  description: "Run status, resolved bindings and every requires_connection flag."
}];
function Integrations() {
  return /*#__PURE__*/React.createElement("section", {
    id: "architecture",
    style: {
      padding: "72px 32px",
      background: "var(--surface-sunken)",
      borderTop: "1px solid var(--border-hairline)",
      borderBottom: "1px solid var(--border-hairline)",
      marginTop: 72
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--layout-max)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Resolved bindings",
    title: "Every capability maps to a real node",
    description: "You pick the provider. The compiler resolves the capability to a concrete n8n node and tells you exactly which credentials remain."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 14,
      marginTop: 36
    }
  }, TOOLS.map(t => /*#__PURE__*/React.createElement(IntegrationCard, _extends({
    key: t.name
  }, t))))));
}
function Deliverables() {
  return /*#__PURE__*/React.createElement("section", {
    id: "deliverables",
    style: {
      padding: "80px 32px",
      maxWidth: "var(--layout-max)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Production artifacts",
    title: "What a compile hands you",
    description: "Six files, versioned per run. Read them before anything touches your CRM."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 16,
      marginTop: 36
    }
  }, DELIVERABLES.map(d => /*#__PURE__*/React.createElement(DeliverableCard, _extends({
    key: d.file
  }, d)))));
}
function Signals() {
  const leads = [{
    company: "NexusFlow Data",
    round: "Series A · $12M",
    stack: ["n8n self-hosted", "HubSpot", "Apollo"],
    trigger: "Hiring GTM Automation Engineer",
    contact: "Marcus Vance, VP RevOps"
  }, {
    company: "HyperScale AI",
    round: "Series B · $28M",
    stack: ["n8n cloud", "Salesforce", "Clay", "Smartlead"],
    trigger: "Hiring Head of Outbound Growth",
    contact: "Elena Rostova, Head of Growth"
  }, {
    company: "CloudPulse Systems",
    round: "Seed · $4.5M",
    stack: ["n8n self-hosted", "Attio", "Instantly"],
    trigger: "Hiring Founding GTM Specialist",
    contact: "Devon Chen, Co-founder"
  }];
  return /*#__PURE__*/React.createElement("section", {
    id: "signals",
    style: {
      padding: "80px 32px",
      background: "var(--surface-deep)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--layout-max)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    align: "left",
    onDeep: true,
    eyebrow: "Tech stack intelligence",
    title: "Leads that already run n8n",
    description: "Stack detection plus hiring intent, so your first line writes itself.",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "inverse",
      iconRight: "arrow-up-right"
    }, "Access live signals")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 16,
      marginTop: 34
    }
  }, leads.map(l => /*#__PURE__*/React.createElement(LeadSignalCard, _extends({
    key: l.company
  }, l))))));
}
function Pricing({
  onCheckout
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: "pricing",
    style: {
      padding: "84px 32px",
      maxWidth: "var(--layout-max)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Transparent plans",
    title: "Compile once. Run it forever.",
    description: "Bring your own keys. No per-lead markup, no vendor lock-in."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 20,
      marginTop: 40,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement(PricingCard, {
    name: "DIY build package",
    price: "$19.99",
    note: "One-time download",
    description: "For engineers who want the prompts, the blueprint and the JSON, and will wire it themselves.",
    features: ["Canonical 9-node workflow JSON", "Full prompt suite & variable schema", "Self-hosted Docker guide", "PAS email template suite", ".env.template & credential map"],
    cta: /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      fullWidth: true,
      onClick: onCheckout
    }, "Get the package")
  }), /*#__PURE__*/React.createElement(PricingCard, {
    featured: true,
    name: "Pro unlimited engine",
    price: "$99",
    cadence: "/ month",
    note: "Cancel anytime \xB7 BYOK",
    description: "The full architect: unlimited compiles, live node canvas, execution triage and signal leads.",
    features: ["Unlimited campaign compiles", "Live 9-node canvas", "Connect & deploy to your n8n", "Execution error triage", "A/B PAS scripts studio", "Slack one-click approval gates"],
    cta: /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      fullWidth: true,
      icon: "zap",
      onClick: onCheckout
    }, "Start Pro")
  }), /*#__PURE__*/React.createElement(PricingCard, {
    tone: "sunken",
    name: "Custom architecture",
    price: "$999+",
    note: "White-glove engagement",
    description: "Custom waterfalls, sub-workflows, CRM cleansing and private infrastructure, built with you.",
    features: ["Dedicated GTM systems engineer", "Custom Clay & Apollo waterfalls", "Legacy CRM dedupe audit", "Custom sub-workflows & webhooks", "Private support channel"],
    cta: /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      fullWidth: true,
      onClick: onCheckout
    }, "Request a build")
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontSize: "var(--text-caption)",
      color: "var(--text-secondary)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield-check",
    size: 15,
    color: "var(--signal-verified)"
  }), "We never store an API key, and we never send an email on your behalf during setup.")));
}
Object.assign(window, {
  Integrations,
  Deliverables,
  Signals,
  Pricing
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Sections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/SiteChrome.jsx
try { (() => {
const {
  Logo,
  Button,
  Badge,
  Icon
} = window.ProspectPALDesignSystem_b8251d;
function TopStrip() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-deep)",
      color: "var(--ink-200)",
      padding: "9px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      fontSize: "var(--text-caption)",
      borderBottom: "1px solid var(--border-deep)"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "deep"
  }, "New"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--paper-0)",
      fontWeight: 600
    }
  }, "Tech signals live:"), " 1,400+ companies running n8n and hiring GTM engineers."), /*#__PURE__*/React.createElement("a", {
    href: "#signals",
    style: {
      color: "var(--champagne-200)",
      fontWeight: 600,
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: 4
    }
  }, "Explore signals ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 13,
    color: "var(--champagne-200)"
  })));
}
function SiteNav({
  onCheckout
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 40,
      height: 66,
      padding: "0 32px",
      background: "rgba(251,250,248,0.86)",
      backdropFilter: "blur(14px)",
      borderBottom: "1px solid var(--border-hairline)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 34
  }), /*#__PURE__*/React.createElement(Badge, {
    tone: "brand"
  }, "Automation agent")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 22
    }
  }, ["Architecture", "Deliverables", "Signals", "Pricing"].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#" + l.toLowerCase(),
    style: {
      fontSize: "var(--text-body-sm)",
      fontWeight: 500,
      color: "var(--text-secondary)",
      textDecoration: "none"
    }
  }, l)), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "md"
  }, "Sign in"), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "md",
    icon: "zap",
    onClick: onCheckout
  }, "Build my engine")));
}
function SiteFooter() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      padding: "40px 32px",
      borderTop: "1px solid var(--border-hairline)",
      background: "var(--surface-sunken)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--layout-max)",
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 20,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 26
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-caption)",
      color: "var(--text-muted)"
    }
  }, "\xA9 2026 Prospect PAL \xB7 GTM automation, compiled and handed over."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 18
    }
  }, ["Architecture", "Security", "Docs"].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      fontSize: "var(--text-caption)",
      color: "var(--text-secondary)",
      textDecoration: "none"
    }
  }, l)))));
}
Object.assign(window, {
  TopStrip,
  SiteNav,
  SiteFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/SiteChrome.jsx", error: String((e && e.message) || e) }); }

__ds_ns.ChatBubble = __ds_scope.ChatBubble;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.NavItem = __ds_scope.NavItem;

__ds_ns.StatTile = __ds_scope.StatTile;

__ds_ns.StepIndicator = __ds_scope.StepIndicator;

__ds_ns.ToolOptionCard = __ds_scope.ToolOptionCard;

__ds_ns.TypingDots = __ds_scope.TypingDots;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Label = __ds_scope.Label;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.StatusPill = __ds_scope.StatusPill;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.DeliverableCard = __ds_scope.DeliverableCard;

__ds_ns.IntegrationCard = __ds_scope.IntegrationCard;

__ds_ns.LeadSignalCard = __ds_scope.LeadSignalCard;

__ds_ns.PricingCard = __ds_scope.PricingCard;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.NodeCard = __ds_scope.NodeCard;

__ds_ns.PipelineRail = __ds_scope.PipelineRail;

})();
