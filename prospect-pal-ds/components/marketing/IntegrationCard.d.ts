export interface IntegrationCardProps {
  name: string;
  description: string;
  /** Lucide glyph standing in for the vendor. */
  icon?: string;
  /** Capability slug in mono, e.g. "crm-read-write". */
  capability?: string;
  connected?: boolean;
}
export declare function IntegrationCard(props: IntegrationCardProps): JSX.Element;
