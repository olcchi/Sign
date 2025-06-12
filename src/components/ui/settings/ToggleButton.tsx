"use client";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/layout/button";

interface ToggleButtonProps {
  isEnabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
  variant?: "default" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ToggleButton({
  isEnabled,
  onToggle,
  disabled = false,
  variant,
  size = "sm",
}: ToggleButtonProps) {
  return (
    <Button
      size={size}
     variant={'ghost'}
      onClick={onToggle}
      disabled={disabled}
      className="text-xs"
    >
      {isEnabled ? <Eye size={12} /> : <EyeOff size={12} />}
      {isEnabled ? <p>开启</p> : <p>关闭</p>}
    </Button>
  );
} 