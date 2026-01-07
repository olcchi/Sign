"use client";

import React, { useState } from "react";
import { useSettings } from "@/lib/contexts/settings-context";
import {
  colorOptions,
  fontOptions,
  fontSizeOptions,
  scrollSpeedOptions,
  edgeBlurConfig,
  noiseConfig,
  textStrokeConfig,
  starFieldConfig,
} from "@/lib/settings-config";
import { Button } from "@/components/ui/layout";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/layout";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AlertTriangle, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Create a non-animated version of DialogContent
const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay className="fixed inset-0 z-[1000] bg-background/80 backdrop-blur-sm" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-[1001] grid w-3/4 md:w-full max-w-lg max-h-[90vh] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

interface ResetDialogProps {
  children: React.ReactNode;
  className?: string;
}

// Default values (matching settings-context.tsx)
const defaultTextSettings = {
  text: "Sign",
  textColor: colorOptions[0].value, // Use first color option
  fontFamily: fontOptions[1].value, // Use second font option (Noto Serif)
  fontSize: fontSizeOptions[3].value, // Use "XL" size (10rem)
  fontWeight: "400",
  fontItalic: false,
  scrollSpeed: parseInt(scrollSpeedOptions[2].value), // Use "1x" speed (10)
  textStrokeEnabled: false,
  textStrokeWidth: textStrokeConfig.defaultValue,
  textStrokeColor: colorOptions[0].value, // Use first color option
  textFillEnabled: true,
};

const defaultBackgroundSettings = {
  backgroundColor: "#000000",
  backgroundImage: null,
  backgroundPosition: { x: 50, y: 50 },
  backgroundZoom: 1,
  overlayEnabled: true,
};

const defaultEffectsSettings = {
  edgeBlurEnabled: false,
  edgeBlurIntensity: edgeBlurConfig.defaultValue,
  shinyTextEnabled: false,
  noiseEnabled: false,
  noisePatternSize: noiseConfig.patternSize.defaultValue,
  noisePatternAlpha: noiseConfig.patternAlpha.defaultValue,
  starFieldEnabled: false,
  starFieldDensity: starFieldConfig.density.defaultValue,
  starFieldColor: colorOptions[0].value,
  starFieldSize: starFieldConfig.size.defaultValue,
  starFieldTwinkleSpeed: starFieldConfig.twinkleSpeed.defaultValue,
};

export default function ResetDialog({
  children,
  className,
}: ResetDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    updateTextSettings,
    updateBackgroundSettings,
    updateEffectsSettings,
  } = useSettings();

  const handleReset = () => {
    // Reset all settings to default values
    updateTextSettings(defaultTextSettings);
    updateBackgroundSettings(defaultBackgroundSettings);
    updateEffectsSettings(defaultEffectsSettings);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild className={className}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <p className="text-sm font-bold">重置</p>
          </DialogTitle>
          <DialogDescription>
            确定要将所有设置重置为默认状态吗？此操作无法撤销。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning message */}
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
            <AlertTriangle size={16} />
            <span className="text-sm">
              重置后将丢失当前所有自定义设置
            </span>
          </div>
          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleReset}
              variant="destructive"
              className="w-full"
            >
              <RefreshCw size={16} className="mr-2" />
              确认重置
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="w-full"
            >
              取消
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 