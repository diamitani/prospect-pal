export interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "password" | "url";
  /** Leading Lucide glyph. */
  icon?: string;
  /** Render the value in Geist Mono — use for instance URLs, keys, ENV names. */
  mono?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  fullWidth?: boolean;
  onSubmitKey?: () => void;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
