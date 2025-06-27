import React from "react";
import { cn } from "@/lib/utils";
interface PanelContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Panel content container with customized scrolling behavior
 * 
 * Provides consistent styling and scrolling functionality for panel contents
 * with custom scrollbars and proper spacing. Handles overflow content
 * gracefully while maintaining the UI consistency.
 */
export const PanelContent: React.FC<PanelContentProps> = ({ 
  children,
  className 
}) => {
  return (
    <div className={cn(
      " overflow-y-auto custom-scrollbar flex-1",
      className
    )}>
      <div className="px-4 pb-4 select-none">
        <div className="space-y-4 mt-4">
          {children}
        </div>
      </div>
    </div>
  );
}; 