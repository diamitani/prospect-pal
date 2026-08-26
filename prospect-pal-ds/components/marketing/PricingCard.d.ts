export interface PricingCardProps {
  name: string;
  /** Formatted price, e.g. "$99". */
  price: string;
  /** Cadence suffix, e.g. "/ month". */
  cadence?: string;
  /** Small qualifier under the price. */
  note?: string;
  description?: string;
  features?: string[];
  /** Pass a <Button fullWidth /> here. */
  cta?: React.ReactNode;
  /** Cobalt border + raised shadow + "Most teams start here" flag. */
  featured?: boolean;
  tone?: "paper" | "sunken";
}
export declare function PricingCard(props: PricingCardProps): JSX.Element;
