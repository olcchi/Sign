import React from "react";
import Sign from "./sign";
import { cn } from "@/lib/utils";

interface SignHeroTitleProps {
  className?: string;
}

export default function SignHeroTitle({ className }: SignHeroTitleProps) {
  return (
    <div
      className={cn(
        "flex gap-2 justify-center items-center select-none text-foreground",
        className
      )}
    >
      <Sign className="w-6 h-6" />
      <p className="font-[family-name:var(--font-dm-sans)] font-bold text-2xl">
        Sign
      </p>
    </div>
  );
}
