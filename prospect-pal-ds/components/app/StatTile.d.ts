export interface StatTileProps {
  /** The figure itself, e.g. "9-node" or "99.8". */
  value: string;
  /** Trailing unit, e.g. "% uptime". */
  unit?: string;
  /** Uppercase eyebrow caption beneath. */
  label: string;
  tone?: "ink" | "brand" | "verified" | "premium";
}
export declare function StatTile(props: StatTileProps): JSX.Element;
