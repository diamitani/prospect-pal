export interface ModalProps {
  open?: boolean;
  title: string;
  /** Uppercase eyebrow above the title. */
  eyebrow?: string;
  onClose?: () => void;
  /** Right-aligned action row. */
  footer?: React.ReactNode;
  width?: number;
  tone?: "paper" | "deep";
  children?: React.ReactNode;
}
export declare function Modal(props: ModalProps): JSX.Element;
