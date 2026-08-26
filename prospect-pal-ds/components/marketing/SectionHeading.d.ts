export interface SectionHeadingProps {
  /** Uppercase kicker above the title. */
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  /** Inverse type for navy sections. */
  onDeep?: boolean;
  /** Right-aligned action; only rendered when align="left". */
  action?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function SectionHeading(props: SectionHeadingProps): JSX.Element;
