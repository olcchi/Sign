"use client";

import React, { useState } from "react";
import {
  loadSharedPreset,
  isValidPinCode,
} from "@/lib/share-api";
import { Preset } from "@/components/ui/settings/Preset";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Loader2 } from "lucide-react";

interface PinCodeInputProps {
  children: React.ReactNode;
  onPresetLoaded: (preset: Preset) => void;
  className?: string;
}

export default function PinCodeInput({
  children,
  onPresetLoaded,
  className,
}: PinCodeInputProps) {
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

      if (result.success && result.data) {
        // Extract preset from ShareablePreset
        const shareablePreset = result.data;
        const preset = shareablePreset.preset;
        
        onPresetLoaded(preset);
        setIsOpen(false);
        setPinCode("");
      } else {
        setError(result.error || "加载预设失败");
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
          <DialogTitle className="flex items-center gap-2">
            加载预设
          </DialogTitle>
          <DialogDescription className="text-sm">
            输入PIN码以加载预设
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
              正在加载预设...
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
              <>
                加载预设
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
