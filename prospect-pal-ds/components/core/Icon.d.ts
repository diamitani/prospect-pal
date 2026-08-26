export interface IconProps {
  /** Lucide glyph name, e.g. "zap", "shield-check", "workflow". */
  name: string;
  /** Pixel box. Default 16. */
  size?: number;
  /** Lucide stroke width. Brand default 1.75. */
  strokeWidth?: number;
  color?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
