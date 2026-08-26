export interface NavItemProps {
  label: string;
  /** Lucide glyph name. */
  icon: string;
  active?: boolean;
  onClick?: () => void;
  /** Optional mono count / flag on the right. */
  badge?: string;
}
export declare function NavItem(props: NavItemProps): JSX.Element;
