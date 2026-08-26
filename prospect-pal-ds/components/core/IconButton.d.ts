export interface IconButtonProps {
  /** Lucide glyph name. */
  icon: string;
  /** Accessible label / tooltip — required. */
  label: string;
  /** Square box in px. Default 28. */
  size?: number;
  variant?: "outline" | "ghost" | "deep";
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
