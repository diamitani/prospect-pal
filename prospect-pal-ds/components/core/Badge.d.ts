export interface BadgeProps {
  children: React.ReactNode;
  tone?: "neutral" | "brand" | "premium" | "verified" | "attention" | "blocked" | "deep";
  /** Leading Lucide glyph. */
  icon?: string;
  /** Mono type + square shape reads as a machine value (file names, ENV vars). */
  mono?: boolean;
  shape?: "pill" | "square";
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
