/**
 * Primary action control.
 * @startingPoint section="Core" subtitle="Buttons, inputs, badges and cards" viewport="700x320"
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** primary = navy (default action), accent = cobalt (conversion), outline, ghost, inverse (on dark). */
  variant?: "primary" | "accent" | "outline" | "ghost" | "inverse";
  size?: "sm" | "md" | "lg";
  /** Lucide glyph name rendered before the label. */
  icon?: string;
  /** Lucide glyph name rendered after the label. */
  iconRight?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
