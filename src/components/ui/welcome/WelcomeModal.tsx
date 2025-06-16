import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import SignHeroTitle from "@/components/ui/icon/signHeroTitle";
import { Button } from "@/components/ui/layout/button";
import { X, ArrowRight, Sparkles, Share2, Palette, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// Simple VisuallyHidden component for accessibility
const VisuallyHidden = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0",
      className
    )}
    {...props}
  />
));
VisuallyHidden.displayName = "VisuallyHidden";

// Create a non-animated version of DialogContent similar to ShareDialog
const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay className="fixed inset-0 z-[1000] bg-background/80 backdrop-blur-sm" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-0 z-[1001] m-auto w-[90%] md:w-full max-w-3xl h-fit border bg-background shadow-2xl rounded-lg max-h-[85vh] overflow-y-auto custom-scrollbar",
        className
      )}
      {...props}
    >
      {/* Content */}
      <div className="relative z-10">{children}</div>

      <DialogPrimitive.Close className="absolute right-6 top-6 p-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-20">
        <X className="h-4 w-4" />
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
  const features = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "快速创建",
      description: "几秒钟内创建美丽的电子应援牌",
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "多种样式",
      description: "多种样式选择",
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      title: "轻松分享",
      description: "一键分享给朋友或保存到本地",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "实时预览",
      description: "所见即所得的编辑体验",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <VisuallyHidden>
          <DialogTitle>欢迎使用 Sign</DialogTitle>
          <DialogDescription>快速创建并分享你的应援牌</DialogDescription>
        </VisuallyHidden>
        <div className="p-8 space-y-8">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="space-y-3 flex flex-col items-center">
              <SignHeroTitle />
              <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                快速创建并分享你的应援牌
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-4 rounded-lg border transition-all duration-300 hover:border-border/50 overflow-hidden"
              >
                <div className="relative z-10 flex items-start gap-3">
                  <div className="flex-shrink-0 p-2 rounded-md">
                    {feature.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="space-y-4 flex justify-center">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-40 py-3 rounded-full transition-all duration-200"
              >
                进入Sign
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              {/*               
              <Button
                variant="outline"
                size="lg"
                className="border-border/50 text-gray-300 hover:text-white hover:border-border px-8 py-3 rounded-full transition-all duration-200"
                onClick={() => {
                  // 占位：打开帮助或教程
                  console.log("打开帮助");
                }}
              >
                了解更多
              </Button> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
