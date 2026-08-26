export interface DeliverableCardProps {
  /** Artifact filename in mono, e.g. "workflow.n8n.json". */
  file: string;
  label: string;
  description: string;
  /** Category chip, e.g. "Security". */
  badge?: string;
}
export declare function DeliverableCard(props: DeliverableCardProps): JSX.Element;
