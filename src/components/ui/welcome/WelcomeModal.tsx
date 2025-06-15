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
import { X, ArrowRight, Sparkles, Share2, Palette, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// Create a non-animated version of DialogContent similar to ShareDialog
const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-0 z-[1001] m-auto w-[90%] md:w-full max-w-3xl h-fit border border-border/20 bg-[#080808] shadow-2xl rounded-xl max-h-[85vh] overflow-y-auto custom-scrollbar",
        className
      )}
      {...props}
    >
      {/* Content */}
      <div className="relative z-10">{children}</div>

      <DialogPrimitive.Close className="absolute right-6 top-6 rounded-full p-2 opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-20">
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
  const features = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "快速创建",
      description: "几秒钟内创建专业的电子应援牌"
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "个性定制",
      description: "丰富的字体、颜色和特效选择"
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      title: "轻松分享",
      description: "一键分享给朋友或保存到本地"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "实时预览",
      description: "所见即所得的编辑体验"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <div className="p-8 space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <DialogTitle className="text-2xl md:text-3xl font-bold text-white leading-tight">
                欢迎使用 Sign
              </DialogTitle>
              <p className="text-lg text-gray-300 max-w-md mx-auto leading-relaxed">
                创建美丽的电子应援牌，为你喜爱的偶像加油助威
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-4 rounded-lg border border-border/30 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:border-border/50 overflow-hidden"
              >
                {/* Gradient blur background on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF7C4F] via-[#F3ABED] to-[#107DCB] backdrop-blur-sm rounded-lg" />
                </div>
                
                <div className="relative z-10 flex items-start gap-3">
                  <div className="flex-shrink-0 p-2 rounded-md bg-white/10 text-white group-hover:bg-white/20 transition-colors">
                    {feature.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => onOpenChange(false)}
                size="lg"
                className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-3 rounded-full transition-all duration-200"
              >
                开始创建
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
