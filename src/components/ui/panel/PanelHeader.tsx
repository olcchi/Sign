import React from "react";
import { X } from "lucide-react";

interface PanelHeaderProps {
  title: string;
  onClose: () => void;
}

/**
 * Standard header component for all panel interfaces
 * 
 * Creates a consistent header with title and close button for modal/panel UI patterns.
 * Maintains visual hierarchy and provides standard close functionality
 * with appropriate hover states and accessibility considerations.
 */
export const PanelHeader: React.FC<PanelHeaderProps> = ({ 
  title, 
  onClose 
}) => {
  return (
    <div className="w-full bg-zinc-950/90 backdrop-blur-xs border-b border-zinc-800">
      <div className="px-4 py-4 flex justify-between items-center">
        <p className="text-zinc-200 text-sm select-none font-bold">
          {title}
        </p>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}; 