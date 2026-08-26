export interface ToolOptionCardProps {
  /** Lucide glyph for the tool or trigger kind. */
  icon: string;
  title: string;
  caption?: string;
  /** Mono metadata, e.g. "OAuth2" or "API key". */
  meta?: string;
  selected?: boolean;
  onClick?: () => void;
}
export declare function ToolOptionCard(props: ToolOptionCardProps): JSX.Element;
