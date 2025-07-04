"use client";
import { useState, useEffect } from "react";

/**
 * Hook for tracking user activity and managing inactive state
 * 
 * Centralizes user interaction handling logic including:
 * - Tracking mouse, keyboard, touch and scroll events
 * - Managing active/inactive state transitions
 * - Automatic timeout for inactive state
 * 
 * @param timeout - Timeout in milliseconds before marking as inactive (default: 3000)
 * @returns isActive - Boolean indicating if user is currently active
 */
export function useUserActivityTracking(timeout: number = 3000): boolean {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    // User interaction event listener
    const handleUserInteraction = () => {
      setIsActive(true);
      
      // Clear existing timer
      clearTimeout(timeoutId);
      
      // Set new timer, reduce opacity after specified timeout
      timeoutId = setTimeout(() => {
        setIsActive(false);
      }, timeout);
    };
    
    // Initial startup
    handleUserInteraction();
    
    // Add event listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, handleUserInteraction);
    });
    
    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [timeout]);

  return isActive;
} 