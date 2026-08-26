export interface StatusPillProps {
  label: string;
  tone?: "verified" | "attention" | "blocked" | "brand";
  /** Ambient dot pulse. Default true — use for live system state only. */
  pulse?: boolean;
  /** Set on navy surfaces. */
  onDeep?: boolean;
  style?: React.CSSProperties;
}
export declare function StatusPill(props: StatusPillProps): JSX.Element;
