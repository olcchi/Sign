import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility to conditionally merge Tailwind CSS classes with proper precedence
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
