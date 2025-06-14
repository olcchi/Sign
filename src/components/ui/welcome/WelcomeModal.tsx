
import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import SignHeroTitle from "@/components/ui/icon/signHeroTitle";
import { Button } from "@/components/ui/layout/button";
import { X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Create a non-animated version of DialogContent similar to ShareDialog
const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay className="fixed inset-0 z-[1000] bg-black/30 backdrop-blur-sm" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-0 z-[1001] m-auto w-3/4 md:w-full max-w-2xl h-fit border border-border bg-[#080808] p-6 shadow-lg rounded-lg max-h-[80vh] overflow-y-auto",
        className
      )}
      {...props}
    >
      {/* Content */}
      <div className="relative z-10">{children}</div>

      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-20">
        <X className="h-4 w-4 text-white" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export default function WelcomeModal({
  open,
  onOpenChange,
  className,
}: WelcomeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <SignHeroTitle className="relative top-0 left-0" />
          </div>
          <DialogTitle className="text-lg font-bold text-white">
            使用 Sign 创建美丽的电子应援牌
          </DialogTitle>
        </DialogHeader>
        <div>
          <p className="text-sm leading-7 [&:not(:first-child)]:mt-6">
            Sign 是一个快速创建和分享电子应援牌的工具。
            <br />
            使用 Sign，快速创建个性化的应援牌并分享给你的朋友。
          </p>
        </div>
        <div className="space-y-4 text-white">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="w-48 bg-transparent hover:bg-white text-white flex items-center justify-center gap-2 rounded-full"
          >
            <p className="font-[family-name:var(--font-dm-sans)] font-bold">
              Sign
            </p>
            <ArrowRight size={12} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
