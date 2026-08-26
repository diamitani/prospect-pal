import React from "react";

/* Renders a Lucide glyph. Requires the Lucide UMD script on the page:
   <script src="https://unpkg.com/lucide@0.544.0/dist/umd/lucide.js"></script> */
export function Icon({ name, size = 16, strokeWidth = 1.75, color = "currentColor", style }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = "";
    const i = document.createElement("i");
    i.setAttribute("data-lucide", name);
    el.appendChild(i);
    window.lucide.createIcons({
      attrs: { width: size, height: size, "stroke-width": strokeWidth, stroke: color },
      nameAttr: "data-lucide",
      root: el,
    });
  }, [name, size, strokeWidth, color]);
  return (
    <span
      ref={ref}
      aria-hidden="true"
      style={{ display: "inline-flex", width: size, height: size, flexShrink: 0, ...style }}
    />
  );
}
