"use client";

import React, { useState } from "react";
import { PresetApiService } from "@/lib/preset-api";
import { PresetType } from "@/types";
import { BaseDialogProps } from "@/types";
import { Button } from "@/components/ui/layout/button";
import { Label } from "@/components/ui/layout/label";
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
} from "@/components/ui/layout/dialog";
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

interface ImportDialogProps extends BaseDialogProps {
  onPresetListUpdated?: () => void; // Optional callback to notify preset list updates
}

// Function to save imported preset to localStorage
const saveImportedPresetToLocal = (importedPreset: PresetType): PresetType => {
  // Generate new ID but keep original name
  const newId = Date.now().toString();

  // Create new preset with updated ID but original name
  const newPreset: PresetType = {
    ...importedPreset,
    id: newId,
    // Keep the original name from the shared preset
  };

  // Load existing presets from localStorage
  const savedPresets = localStorage.getItem("sign-presets");
  let existingPresets: PresetType[] = [];
  
  if (savedPresets) {
    try {
      const parsedPresets = JSON.parse(savedPresets);
      existingPresets = parsedPresets.map((preset: PresetType) => ({
        ...preset,
        edgeBlurEnabled:
          preset.edgeBlurEnabled !== undefined ? preset.edgeBlurEnabled : false,
        edgeBlurIntensity:
          preset.edgeBlurIntensity !== undefined ? preset.edgeBlurIntensity : 10,
        shinyTextEnabled:
          preset.shinyTextEnabled !== undefined ? preset.shinyTextEnabled : false,
        noiseEnabled:
          preset.noiseEnabled !== undefined ? preset.noiseEnabled : false,
        noiseOpacity:
          preset.noiseOpacity !== undefined ? preset.noiseOpacity : 0.5,
        noiseDensity:
          preset.noiseDensity !== undefined ? preset.noiseDensity : 0.5,
        noiseAnimated:
          preset.noiseAnimated !== undefined ? preset.noiseAnimated : false,
        textStrokeEnabled:
          preset.textStrokeEnabled !== undefined ? preset.textStrokeEnabled : true,
        textStrokeWidth:
          preset.textStrokeWidth !== undefined ? preset.textStrokeWidth : 1,
        textStrokeColor:
          preset.textStrokeColor !== undefined ? preset.textStrokeColor : "#000000",
        textFillEnabled:
          preset.textFillEnabled !== undefined ? preset.textFillEnabled : true,
      }));
    } catch (e) {
      console.error("Failed to parse existing presets", e);
    }
  }

  // Add new preset to the beginning of the list
  const updatedPresets = [newPreset, ...existingPresets];
  
  // Save back to localStorage
  localStorage.setItem("sign-presets", JSON.stringify(updatedPresets));
  
  return newPreset;
};

export default function ImportDialog({
  children,
  onPresetListUpdated,
  className,
}: ImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load preset by PIN code
  const handleLoadPreset = async (codeToLoad?: string) => {
    const currentPinCode = codeToLoad || pinCode;

    if (!PresetApiService.isValidPinCode(currentPinCode)) {
      setError("请输入6位数字PIN码");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await PresetApiService.loadSharedPreset(currentPinCode);

      if (result.success && result.data) {
        // Save imported preset to local storage only (don't apply to current interface)
        saveImportedPresetToLocal(result.data);
        
        // Notify that preset list has been updated
        if (onPresetListUpdated) {
          onPresetListUpdated();
        }
        
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
    if (value.length === 6 && PresetApiService.isValidPinCode(value)) {
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
            加载预设
          </DialogTitle>
          <DialogDescription className="text-sm">
            输入PIN码以导入应援牌预设
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
                          <div className="flex-center text-sm text-gray-600">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              正在加载应援牌配置...
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
              <>加载预设</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
