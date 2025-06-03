"use client";

import React, { useState } from "react";
import { loadSharedPreset, isValidPinCode } from "@/lib/share-api";
import { Preset } from "@/components/ui/settings/Preset";
import { Button } from "@/components/ui/layout/button";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/inputs/input-otp";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Create a non-animated version of DialogContent
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay className="fixed inset-0 z-[1000] bg-background/80 backdrop-blur-sm" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
       "fixed left-[50%] top-[50%] z-[1001] grid w-3/4 md:w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg rounded-lg",
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

interface ImportDialogProps {
  children: React.ReactNode;
  onPresetLoaded: (preset: Preset) => void;
  className?: string;
}

export default function ImportDialog({
  children,
  onPresetLoaded,
  className,
}: ImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load preset by PIN code
  const handleLoadPreset = async (codeToLoad?: string) => {
    const currentPinCode = codeToLoad || pinCode;

    if (!isValidPinCode(currentPinCode)) {
      setError("请输入6位数字PIN码");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await loadSharedPreset(currentPinCode);

      if (result.success && result.preset) {
        // Convert ShareablePreset to Preset format
        const shareablePreset = result.preset;
        const preset: Preset = {
          id: shareablePreset.id,
          name: shareablePreset.name,
          text: shareablePreset.text,
          textColor: shareablePreset.textColor,
          fontFamily: shareablePreset.fontFamily,
          fontSize: shareablePreset.fontSize,
          scrollSpeed: shareablePreset.scrollSpeed,
          edgeBlurEnabled: shareablePreset.edgeBlurEnabled,
          edgeBlurIntensity: shareablePreset.edgeBlurIntensity,
          shinyTextEnabled: shareablePreset.shinyTextEnabled,
          noiseEnabled: shareablePreset.noiseEnabled,
          noiseOpacity: shareablePreset.noiseOpacity,
          noiseDensity: shareablePreset.noiseDensity,
          textStrokeEnabled: shareablePreset.textStrokeEnabled,
          textStrokeWidth: shareablePreset.textStrokeWidth,
          textStrokeColor: shareablePreset.textStrokeColor,
          textFillEnabled: shareablePreset.textFillEnabled,
        };

        onPresetLoaded(preset);
        setIsOpen(false);
        setPinCode("");
      } else {
        setError(result.error || "加载设置失败");
      }
    } catch (err) {
      setError("网络错误，请检查连接后重试");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle PIN code input change
  const handlePinCodeChange = (value: string) => {
    setPinCode(value);
    setError(null);

    // Auto-load when 6 digits are entered
    if (value.length === 6 && isValidPinCode(value)) {
      // Small delay to show the complete input before loading
      setTimeout(() => {
        handleLoadPreset(value); // Pass the current value directly
      }, 300);
    }
  };

  // Reset state when dialog opens
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setPinCode("");
      setError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild className={className}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className=" flex items-center gap-2">
            加载设置
          </DialogTitle>
          <DialogDescription className="text-sm">
            输入PIN码以加载分享的设置
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 ">
          {/* PIN Code Input */}
          <div className="space-y-3">
            <Label htmlFor="pin-input" className="text-center block">
              PIN码
            </Label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={pinCode}
                onChange={handlePinCodeChange}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center text-sm text-gray-600">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              正在加载设置...
            </div>
          )}

          {/* Manual Load Button (backup) */}
          <Button
            onClick={() => handleLoadPreset()}
            disabled={isLoading || pinCode.length !== 6}
            className="w-full"
            variant="outline"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                加载中...
              </>
            ) : (
              <>加载设置</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
