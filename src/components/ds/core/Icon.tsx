"use client";

import { icons, type LucideIcon } from "lucide-react";
import { CSSProperties } from "react";

export interface IconProps {
  name: keyof typeof icons;
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: CSSProperties;
  className?: string;
}

export function Icon({
  name,
  size = 16,
  strokeWidth = 1.75,
  color = "currentColor",
  style,
  className,
}: IconProps) {
  const LucideIcon = icons[name] as LucideIcon | undefined;

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return (
    <LucideIcon
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      style={{ flexShrink: 0, ...style }}
      className={className}
    />
  );
}
