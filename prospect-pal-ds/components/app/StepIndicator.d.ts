export interface StepIndicatorProps {
  /** Step labels in order. */
  steps: string[];
  /** Zero-based index of the current step. */
  current?: number;
  onStep?: (index: number) => void;
}
export declare function StepIndicator(props: StepIndicatorProps): JSX.Element;
