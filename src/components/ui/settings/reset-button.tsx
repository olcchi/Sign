"use client";

import React from "react";
import { Button } from "@/components/ui/layout";
import { ResetDialog } from "@/components/ui/settings";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserActivityTracking } from "@/lib/hooks/useUserActivityTracking";

interface ResetButtonProps {
  className?: string;
}

/**
 * Reset button component that shows/hides based on user activity
 * Wraps the reset functionality in a reusable component
 */
export default function ResetButton({ className }: ResetButtonProps) {
  const isActive = useUserActivityTracking(3000);

  return (
    <div
      className={cn(
        "activity-opacity",
        isActive ? "active" : "inactive",
        className
      )}
    >
      <ResetDialog>
        <Button
          variant="ghost"
          className="hover:bg-[#080808]"
          aria-label="重置设置"
        >
          <RefreshCw size={20} color="white" />
        </Button>
      </ResetDialog>
    </div>
  );
}