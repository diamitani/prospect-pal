import type { NodeCardProps } from "./NodeCard";
export interface PipelineRailProps {
  /** Nodes in execution order; `step` defaults to position. */
  nodes: Array<Omit<NodeCardProps, "step"> & { step?: number }>;
  activeIndex?: number;
  onSelect?: (index: number) => void;
  onDeep?: boolean;
  style?: React.CSSProperties;
}
export declare function PipelineRail(props: PipelineRailProps): JSX.Element;
