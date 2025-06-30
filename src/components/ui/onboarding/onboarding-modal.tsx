import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/layout/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import SignHeroTitle from "@/components/ui/icon/sign-hero-title";
import { Button } from "@/components/ui/layout/button";
import {
  X,
  ArrowRight,
  Sparkles,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Olcchi } from "../icon/olcchi";
import { motion } from "motion/react";
import Noise from "../filter/noise";
import { useUserActivityTracking } from "@/lib/hooks/useUserActivityTracking";
import { CardSwap, Card, AnimatedSign, GlowEffect } from ".";
import AnimatedShare from "./animated-share";
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
        "fixed inset-0 z-[1001] m-auto w-4/5 h-3/5 min-h-80 md:w-4/5 max-w-280 border bg-background shadow-2xl rounded-lg overflow-hidden",
        className
      )}
      onPointerDownOutside={(e) => e.preventDefault()}
      onEscapeKeyDown={(e) => e.preventDefault()}
      {...props}
    >
      <motion.div
        className="absolute w-120 h-120 lg:w-180 lg:h-180 rounded-full opacity-60 blur-2xl xl:blur-3xl bg-gradient-to-t from-[#ccc4f0] to-[#FFFFFB] dark:from-[#211E55] dark:to-[#060606]"
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
        }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full opacity-40 blur-2xl xl:blur-4xl bg-gradient-to-t from-[#ccc4f0] to-[#FFFFFB] dark:from-[#211E55] dark:to-[#060606]"
        animate={{
          x: ["25%", "-25%", "25%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          right: "0%",
          top: "-25%",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full">{children}</div>
      <DialogPrimitive.Close className="absolute right-6 top-6 p-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-20">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
      <Olcchi showGithub={false} className="absolute bottom-4 left-4 z-20" />
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

interface WelcomeModalProps {
  className?: string;
}

export function WelcomeModal({ className }: WelcomeModalProps) {
  // Check if this is the first visit immediately during initialization
  const [open, setOpen] = useState(() => {
    // Only check localStorage on client side to avoid SSR hydration mismatch
    if (typeof window !== "undefined") {
      const hasVisited = localStorage.getItem("sign-has-visited");
      if (!hasVisited) {
        localStorage.setItem("sign-has-visited", "true");
        return true;
      }
    }
    return false;
  });

  const [isClient, setIsClient] = useState(false);
  const isActive = useUserActivityTracking(3000);

  // Ensure we're on the client side to prevent SSR hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  const iconStyle = "w-5 h-5 stroke-1";
  const features = [
    {
      icon: <Sparkles className={iconStyle} />,
      title: "文字变体",
      content: (
        <>
          <AnimatedSign />
        </>
      ),
    },
    {
      icon: <Share2 className={iconStyle} />,
      title: "快捷分享",
      content: (
        <>
          <AnimatedShare />
        </>
      ),
    },
  ];

  return (
    <>
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

      {/* Welcome Modal Dialog - Only render on client side */}
      {isClient && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className={className}>
            <VisuallyHidden>
              <DialogTitle>欢迎使用 Sign</DialogTitle>
              <DialogDescription>快速创建并分享你的应援牌</DialogDescription>
            </VisuallyHidden>
            <div className="h-full flex flex-col md:flex-row">
              {/* Left Content Area */}
              <div className="relative p-5 flex w-full h-full flex-col gap-5 justify-center items-center ">
                <div className="space-y-6 ">
                  <div className="space-y-3 flex flex-col">
                    <SignHeroTitle size="lg" />
                    <p className="text-muted-foreground max-w-md ">
                      快速创建并分享你的应援牌
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
              <div className="relative w-full h-full">
                <CardSwap
                  cardDistance={30}
                  verticalDistance={40}
                  delay={6000}
                  pauseOnHover={false}
                >
                  {features.map((feature, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden flex flex-col select-none"
                    >
                      <div className="flex items-center w-full h-10 border-b border-border gap-2 from-[#ccc4f0] dark:from-[#211E55] to-[#FFFFFB] dark:to-[#060606] bg-gradient-to-t p-2">
                        {feature.icon}
                        <p className="text-sm">{feature.title}</p>
                      </div>
                      <div className="relative flex-1 bg-[url(/grid.svg)] bg-cover bg-center overflow-hidden min-h-32">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#ccc4f0] dark:from-[#211E55] to-[#FFFFFB] dark:to-[#060606] opacity-50" />
                        <Noise
                          patternSize={150}
                          patternAlpha={8}
                        />
                        <div className="relative p-5 w-full h-full">
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
      )}
    </>
  );
}
