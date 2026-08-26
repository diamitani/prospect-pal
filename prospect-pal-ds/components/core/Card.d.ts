export interface CardProps {
  children?: React.ReactNode;
  tone?: "paper" | "sunken" | "deep" | "accent";
  /** Padding in px. Brand rhythm: 16 (dense), 20 (default), 24–28 (feature). */
  pad?: number;
  /** Adds lift + shadow on hover and a pointer cursor. */
  interactive?: boolean;
  radius?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
