import React from "react";
import { NodeCard } from "./NodeCard.jsx";
import { Icon } from "../core/Icon.jsx";

export function PipelineRail({ nodes = [], activeIndex = 0, onSelect, onDeep = true, style }) {
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 0, overflowX: "auto", paddingBottom: 4, ...style }}>
      {nodes.map((n, i) => (
        <React.Fragment key={n.title}>
          <NodeCard {...n} step={n.step != null ? n.step : i + 1} selected={i === activeIndex} onDeep={onDeep} onClick={() => onSelect && onSelect(i)} />
          {i < nodes.length - 1 ? (
            <span style={{
              display: "inline-flex", alignItems: "center", padding: "0 6px",
              color: onDeep ? "var(--ink-500)" : "var(--text-subtle)", flexShrink: 0,
            }}><Icon name="chevron-right" size={16} /></span>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
}
