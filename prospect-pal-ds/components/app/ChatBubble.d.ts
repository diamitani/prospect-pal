export interface ChatBubbleProps {
  role?: "user" | "assistant";
  children: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function ChatBubble(props: ChatBubbleProps): JSX.Element;
