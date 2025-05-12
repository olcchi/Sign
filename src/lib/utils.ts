import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Combines Tailwind classes efficiently while resolving conflicts and maintaining precedence
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
