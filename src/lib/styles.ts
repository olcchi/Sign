// Global style variables for consistent theming across the application
export const styles = {
  bg: {
    default: "bg-zinc-800/50",
    hover: "hover:bg-zinc-800",
    active: "bg-zinc-800",
    darker: "bg-zinc-900",
    destructive: "bg-red-500",
  },
  text: {
    default: "text-zinc-200",
    muted: "text-zinc-300",
    icon: "text-zinc-400",
    disabled: "text-zinc-600",
  },
  button: {
    base: "text-xs transition-colors",
    rounded: "rounded-md",
    small: "px-2 py-1",
  },
  border: {
    default: "border-b  border-zinc-800",
    active: "border-zinc-500",
  },
  layout: {
    // Containers
    container: {
      group: "flex flex-col gap-2", // container group
      panel: "space-y-2 px-2 py-2", // container panel
    },
    
    // Spacing
    spacing: {
      itemGap: "space-y-2",     // item gap
      childGap: "gap-2",        // child gap
      itemMargin: "mt-2",       // item margin
    },
    
    // Item display
    item: {
      header: "flex items-center justify-between", // item header
      row: "flex items-center gap-2",              // item row
    }
  },
}; 