import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/layout/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import SignHeroTitle from "@/components/ui/icon/signHeroTitle";
import { Button } from "@/components/ui/layout/button";
import { X, ArrowRight, Sparkles, Share2, Palette, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Olcchi } from "../icon/olcchi";
import CardSwap, { Card } from "@/components/ui/cardSwap";
import { motion } from "motion/react";
import Noise from "../filter/noise";
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
      {...props}
    >
      <motion.div
        className="absolute w-120 h-120 lg:w-180 lg:h-180 rounded-full opacity-60 blur-xl xl:blur-3xl bg-gradient-to-t from-[#ccc4f0] to-[#FFFFFB] dark:from-[#211E55] dark:to-[#060606]"
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
        className="absolute w-80 h-80 rounded-full opacity-60 blur-xl xl:blur-3xl bg-gradient-to-t from-[#ccc4f0] to-[#FFFFFB] dark:from-[#211E55] dark:to-[#060606]"
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

export default function WelcomeModal({
  className,
}: WelcomeModalProps) {
  const [open, setOpen] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Check if this is the first visit and show welcome modal
  useEffect(() => {
    const hasVisited = localStorage.getItem('sign-has-visited');
    if (!hasVisited) {
      setOpen(true);
      localStorage.setItem('sign-has-visited', 'true');
    }
  }, []);

  // Handle user interaction and inactive state for trigger button
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    // User interaction event listener
    const handleUserInteraction = () => {
      setIsActive(true);
      
      // Clear existing timer
      clearTimeout(timeoutId);
      
      // Set new timer, reduce opacity after 3 seconds
      timeoutId = setTimeout(() => {
        setIsActive(false);
      }, 3000);
    };
    
    // Initial startup
    handleUserInteraction();
    
    // Add event listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, handleUserInteraction);
    });
    
    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, handleUserInteraction);
      });
    };
  }, []);

  const features = [
    {
      icon: <Sparkles className="w-5 h-5 stroke-1" />,
      title: "快速创建",
    },
    {
      icon: <Palette className="w-5 h-5 stroke-1" />,
      title: "高自定义",
    },
    {
      icon: <Share2 className="w-5 h-5 stroke-1" />,
      title: "快速分享",
    },
    {
      icon: <Zap className="w-5 h-5 stroke-1" />,
      title: "即时生成",
    },
  ];

  return (
    <>
      {/* SignHeroTitle trigger */}
      <div 
        className={cn(
          "fixed top-4 left-4 z-[999] transition-opacity duration-300 cursor-pointer", 
          isActive ? "opacity-100" : "opacity-10 hover:opacity-100",
          className
        )}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        aria-label="打开Sign"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
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
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className=" w-40 py-3 rounded-full transition-all duration-200"
              >
                进入Sign
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            {/* Right CardSwap Area */}
            <div className="relative w-full h-full">
              <CardSwap
                cardDistance={30}
                verticalDistance={40}
                delay={4000}
                pauseOnHover={true}
              >
                {features.map((feature, index) => (
                  <Card key={index} className="overflow-hidden flex flex-col">
                    <div className="flex items-center w-full h-10 border-b border-foreground gap-2 from-[#ccc4f0] dark:from-[#211E55] to-[#FFFFFB] dark:to-[#060606] bg-gradient-to-t p-2">
                      {feature.icon}
                      <p className="text-sm">{feature.title}</p>
                    </div>
                    <div className="relative flex-1 bg-[url(/grid.svg)] bg-cover bg-center overflow-hidden min-h-32">
                      {/* <img src={"/sign-hero-bg.png"} alt="" /> */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#ccc4f0] dark:from-[#211E55] to-[#FFFFFB] dark:to-[#060606] opacity-50" />
                      <Noise className="z-2" />
                      <div className="absolute z-999">你好吗</div>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
