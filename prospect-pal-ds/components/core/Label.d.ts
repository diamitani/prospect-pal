export interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  /** Optional step number, rendered zero-padded in mono ahead of the label. */
  step?: number;
  /** Trailing muted hint, e.g. "optional". */
  hint?: string;
}
export declare function Label(props: LabelProps): JSX.Element;
