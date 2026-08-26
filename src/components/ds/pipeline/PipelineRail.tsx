"use client";

import { CSSProperties, Fragment } from "react";
import { NodeCard, NodeCardProps } from "./NodeCard";
import { Icon } from "../core/Icon";

export interface PipelineNode extends Omit<NodeCardProps, "step" | "selected" | "onClick"> {
  step?: number;
}

export interface PipelineRailProps {
  nodes: PipelineNode[];
  activeIndex?: number;
  onSelect?: (index: number) => void;
  onDeep?: boolean;
  style?: CSSProperties;
}

export function PipelineRail({
  nodes = [],
  activeIndex = 0,
  onSelect,
  onDeep = true,
  style,
}: PipelineRailProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: 0,
        overflowX: "auto",
        paddingBottom: 4,
        ...style,
      }}
    >
      {nodes.map((n, i) => (
        <Fragment key={n.title}>
          <NodeCard
            {...n}
            step={n.step != null ? n.step : i + 1}
            selected={i === activeIndex}
            onDeep={onDeep}
            onClick={onSelect ? () => onSelect(i) : undefined}
          />
          {i < nodes.length - 1 && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0 6px",
                color: onDeep ? "var(--ink-500)" : "var(--text-subtle)",
                flexShrink: 0,
              }}
            >
              <Icon name="ChevronRight" size={16} />
            </span>
          )}
        </Fragment>
      ))}
    </div>
  );
}
