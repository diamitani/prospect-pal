/**
 * One node of the canonical 9-node PAE graph.
 * @startingPoint section="Pipeline" subtitle="Node cards and the 9-node rail" viewport="700x260"
 */
export interface NodeCardProps {
  /** Node number, rendered zero-padded in mono. */
  step: number;
  title: string;
  /** Plain-language role, e.g. "HubSpot / Salesforce". */
  subtitle: string;
  /** Lucide glyph name. */
  icon: string;
  /** Colour family for the stage this node belongs to. */
  stage?: "trigger" | "shield" | "data" | "ai" | "sequence" | "logic";
  /** Resolved n8n binding shown in mono at the foot, e.g. "n8n-nodes-base.hubspot". */
  binding?: string;
  selected?: boolean;
  /** True on the navy canvas (default), false on paper. */
  onDeep?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function NodeCard(props: NodeCardProps): JSX.Element;
