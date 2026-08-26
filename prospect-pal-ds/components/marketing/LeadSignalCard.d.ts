export interface LeadSignalCardProps {
  company: string;
  /** Funding stage chip, e.g. "Series A · $12M". */
  round?: string;
  /** Detected tech stack, rendered as mono chips. */
  stack?: string[];
  /** The buying signal, e.g. "Hiring GTM Automation Engineer". */
  trigger?: string;
  /** Decision-maker name and title. */
  contact?: string;
  verified?: boolean;
}
export declare function LeadSignalCard(props: LeadSignalCardProps): JSX.Element;
