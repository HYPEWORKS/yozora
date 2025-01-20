import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to determine the correct modifier key
export const getModifierKey = () => {
  if (typeof window === "undefined") return "Ctrl"; // Fallback for SSR
  // @ts-expect-error userAgentData is experimental
  const platform = navigator.userAgentData?.platform || navigator.platform || "unknown";
  return /Mac|iPod|iPhone|iPad/.test(platform) ? "⌘" : "Ctrl";
};
