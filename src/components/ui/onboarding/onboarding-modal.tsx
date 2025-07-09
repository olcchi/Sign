import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/layout";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { SignHeroTitle } from "@/components/ui/icon";
import { Button } from "@/components/ui/layout";
import { X, ArrowRight, Sparkles, Share2, Blend } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useUserActivityTracking } from "@/lib/hooks/useUserActivityTracking";
import {
  CardSwap,
  Card,
  GlowEffect,
  Effect,
  VersionFooter,
  Sign,
  Share,
} from "@/components/ui/onboarding";
import { Olcchi } from "@/components/ui/icon";

// Cookie utility functions
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const setCookie = (name: string, value: string, days: number = 365): void => {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

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
        "fixed inset-0 z-[1001] m-auto w-4/5 h-3/5 min-h-85 max-w-240 border bg-background rounded-lg overflow-hidden",
        className
      )}
      onPointerDownOutside={(e) => e.preventDefault()}
      onEscapeKeyDown={(e) => e.preventDefault()}
      {...props}
    >
      <motion.div
        className="absolute w-140 h-140 rounded-full opacity-60 blur-2xl xl:blur-3xl bg-gradient-to-t from-[#ccc4f0] to-[#FFFFFB] dark:from-[#211E55] dark:to-[#060606]"
        animate={{
          x: ["-25%", "25%", "-25%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          left: "0%",
          bottom: "-50%",
          zIndex: 1,
          // Force hardware acceleration for better performance
          transform: "translateZ(0)",
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      />
      {/* Content */}
      <div className="relative z-10 h-full w-full overflow-hidden">
        {children}
      </div>
      <DialogPrimitive.Close className="absolute right-6 top-6 p-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-20">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
      <Olcchi showGithub={false} className="absolute bottom-4 left-4 z-20" />
      <VersionFooter />
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

interface WelcomeModalProps {
  className?: string;
}

export function WelcomeModal({ className }: WelcomeModalProps) {
  // Check if this is the first visit using cookies
  const [open, setOpen] = useState(() => {
    const hasVisited = getCookie("sign-has-visited");
    if (!hasVisited) {
      setCookie("sign-has-visited", "true", 1); // Store for 24 hours
      return true;
    }
    return false;
  });

  const isActive = useUserActivityTracking(3000);

  const iconStyle = "w-5 h-5 stroke-1";
  const features = [
    {
      icon: <Sparkles className={iconStyle} />,
      title: "文字变体",
      content: (
        <>
          <Sign />
        </>
      ),
    },
    {
      icon: <Share2 className={iconStyle} />,
      title: "快捷分享",
      content: (
        <>
          <Share />
        </>
      ),
    },
    {
      icon: <Blend className={iconStyle} />,
      title: "多变效果",
      content: (
        <>
          <Effect />
        </>
      ),
    },
  ];

  return (
    <div className="w-full h-full">
      {/* SignHeroTitle trigger */}
      <div
        className={cn(
          "fixed top-4 left-4 z-[999] activity-opacity cursor-pointer",
          isActive ? "active" : "inactive",
          className
        )}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        aria-label="打开Sign"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <SignHeroTitle
          size="sm"
          className="text-[#FFFFFB] hover:opacity-80 transition-opacity duration-200 select-none"
        />
      </div>

      {/* Welcome Modal Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={className}>
          <VisuallyHidden>
            <DialogTitle>欢迎使用 Sign</DialogTitle>
            <DialogDescription>快速创建 & 分享美丽应援牌</DialogDescription>
          </VisuallyHidden>
          <div className="h-full flex flex-col md:flex-row">
            {/* Left Content Area */}
            <div className="relative p-5 flex w-full h-full flex-col gap-5 justify-center items-center ">
              <div className="space-y-6 ">
                <div className="space-y-3 flex flex-col">
                  <SignHeroTitle size="lg" />
                  <p className="text-muted-foreground max-w-md ">
                    快速创建 & 分享美丽应援牌
                  </p>
                </div>
              </div>
              <div className="relative group">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="relative w-40 py-3 bg-gradient-to-t  from-[#1E1B3E] to-[#060606] transition-colors rounded-full duration-200"
                >
                  进入Sign
                  <ArrowRight className=" w-4 h-4 ml-1 transition-all ease-in-out duration-200 group-hover:translate-x-1" />
                </Button>
                <GlowEffect
                  mode="pulse"
                  blur="soft"
                  scale={1.1}
                  colors={["#423E8B", "#211E55"]}
                  className=" absolute -z-1 inset-0 rounded-full transition-opacity duration-200"
                />
              </div>
            </div>
            {/* Right CardSwap Area */}
            <div className="w-full h-full">
              <CardSwap
                cardDistance={30}
                verticalDistance={40}
                delay={6000}
                pauseOnHover={false}
              >
                {features.map((feature, index) => (
                  <Card key={index} className="flex flex-col select-none">
                    <div className="flex rounded-t-xl  items-center w-full h-10 border-b border-border gap-2 from-[#ccc4f0] dark:from-[#211E55] to-[#FFFFFB] dark:to-[#060606] bg-gradient-to-t p-2">
                      {feature.icon}
                      <p className="text-sm">{feature.title}</p>
                    </div>
                    <div className="relative flex-1 bg-[url(/grid.svg)] bg-cover bg-center overflow-hidden min-h-32">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#ccc4f0] dark:from-[#211E55] to-[#FFFFFB] dark:to-[#060606] opacity-50" />
                      <div className="relative w-full h-full">
                        {feature.content}
                      </div>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
