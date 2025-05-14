import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Combines Tailwind classes efficiently while resolving conflicts and maintaining precedence
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 添加防抖函数，用于延迟执行函数
export function debounce<T extends (...args: any[]) => any>(
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
