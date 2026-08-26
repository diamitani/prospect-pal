/**
 * The Prospect PAL identity lockup.
 * @startingPoint section="Brand" subtitle="Logo lockup, mark and inverse forms" viewport="700x200"
 */
export interface LogoProps {
  /** "lockup" = mark + wordmark, "mark" = the geometric mark alone. */
  variant?: "lockup" | "mark";
  /** Mark box in px; the wordmark scales from it. Default 32. Minimum 20. */
  size?: number;
  /** Inverse treatment for navy / dark surfaces. */
  onDeep?: boolean;
  /** Optional descriptor under the wordmark, e.g. "GTM Automation Architect". */
  tagline?: string;
  style?: React.CSSProperties;
}
export declare function Logo(props: LogoProps): JSX.Element;
