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
        "fixed top-20 left-20 flex gap-2 justify-center items-center",
        className
      )}
    >
      <Sign className="w-6 h-6" />
      <p className="font-[family-name:var(--font-dm-sans)] font-bold text-2xl text-[#FCFAF2]">
        Sign
      </p>
    </div>
  );
}
