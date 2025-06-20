import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Combines Tailwind classes efficiently while resolving conflicts and maintaining precedence
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Calculate expiration time (default: 24 hours from now)
export function getExpirationTime(hours: number = 24): string {
  const now = new Date();
  const expiration = new Date(now.getTime() + hours * 60 * 60 * 1000);
  return expiration.toISOString();
}
