import React from "react";
import { Sign } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

type SignHeroTitleSize = "sm" | "md" | "lg" | "xl";

interface SignHeroTitleProps {
  className?: string;
  size?: SignHeroTitleSize;
}

const sizeVariants = {
  sm: {
    container: "gap-1.5",
    icon: "w-4 h-4",
    text: "text-lg",
  },
  md: {
    container: "gap-2",
    icon: "w-6 h-6", 
    text: "text-2xl",
  },
  lg: {
    container: "gap-2.5",
    icon: "w-8 h-8",
    text: "text-3xl",
  },
  xl: {
    container: "gap-3",
    icon: "w-10 h-10",
    text: "text-4xl",
  },
} as const;

export function SignHeroTitle({ 
  className, 
  size = "md" 
}: SignHeroTitleProps) {
  const variant = sizeVariants[size];
  
  return (
    <div
      className={cn(
        "flex justify-center items-center select-none text-foreground",
        variant.container,
        className
      )}
    >
      <Sign className={variant.icon} />
      <p className={cn(
        "font-[family-name:var(--font-dm-sans)] font-bold",
        variant.text
      )}>
        Sign
      </p>
    </div>
  );
}
