"use client";

import React, { useState, useEffect } from "react";
import { PresetApiService } from "@/lib/preset-api";
import { ApiResponse } from "@/types";
import { PresetType } from "@/types";
import { TextSettings, EffectsSettings } from "@/types";
import {
  createPresetFromCurrentSettings,
  getPresetDetailedInfo,
} from "@/lib/preset-utils";
import { Button } from "@/components/ui/layout/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/layout/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/layout/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/inputs/select";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Copy, Check, Loader2, AlertCircle, X } from "lucide-react";
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
        "fixed inset-0 z-[1001] m-auto w-3/4 h-fit md:w-full max-w-lg max-h-[90vh] border bg-background p-6 shadow-lg rounded-lg overflow-hidden",
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

interface ShareDialogProps {
  children: React.ReactNode;
  className?: string;
  activePreset?: PresetType | null; // Current active preset
  currentTextSettings?: TextSettings; // Current text settings
  currentEffectsSettings?: EffectsSettings; // Current effects settings
}

export default function ShareDialog({
  children,
  className,
  activePreset,
  currentTextSettings,
  currentEffectsSettings,
}: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareResult, setShareResult] = useState<{
    pinCode: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // New states for preset selection
  const [localPresets, setLocalPresets] = useState<PresetType[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("current"); // "current" for current settings

  // Load local presets from localStorage
  useEffect(() => {
    const savedPresets = localStorage.getItem("sign-presets");
    if (savedPresets) {
      try {
        const parsedPresets = JSON.parse(savedPresets);
        const updatedPresets = parsedPresets.map((preset: PresetType) => ({
          ...preset,
          edgeBlurEnabled:
            preset.edgeBlurEnabled !== undefined
              ? preset.edgeBlurEnabled
              : false,
          edgeBlurIntensity:
            preset.edgeBlurIntensity !== undefined
              ? preset.edgeBlurIntensity
              : 10,
          shinyTextEnabled:
            preset.shinyTextEnabled !== undefined
              ? preset.shinyTextEnabled
              : false,
          noiseEnabled:
            preset.noiseEnabled !== undefined ? preset.noiseEnabled : false,
          noiseOpacity:
            preset.noiseOpacity !== undefined ? preset.noiseOpacity : 0.5,
          noiseDensity:
            preset.noiseDensity !== undefined ? preset.noiseDensity : 0.5,
          noiseAnimated:
            preset.noiseAnimated !== undefined ? preset.noiseAnimated : false,
          textStrokeEnabled:
            preset.textStrokeEnabled !== undefined
              ? preset.textStrokeEnabled
              : true,
          textStrokeWidth:
            preset.textStrokeWidth !== undefined ? preset.textStrokeWidth : 1,
          textStrokeColor:
            preset.textStrokeColor !== undefined
              ? preset.textStrokeColor
              : "#000000",
          textFillEnabled:
            preset.textFillEnabled !== undefined
              ? preset.textFillEnabled
              : true,
        }));

        setLocalPresets(updatedPresets);
      } catch (e) {
        console.error("Failed to parse saved presets", e);
      }
    }
  }, [isOpen]); // Reload when dialog opens

  // Get the preset to share based on selection
  const getPresetToShare = (): {
    preset: PresetType;
    isCurrentSettings: boolean;
  } => {
    if (selectedPresetId === "current") {
      if (!currentTextSettings || !currentEffectsSettings) {
        throw new Error("没有可分享的当前设置");
      }
      const currentPreset = createPresetFromCurrentSettings(
        currentTextSettings,
        currentEffectsSettings,
        "当前设置"
      );
      return { preset: currentPreset, isCurrentSettings: true };
    } else {
      const selectedPreset = localPresets.find(p => p.id === selectedPresetId);
      if (!selectedPreset) {
        throw new Error("选择的预设不存在");
      }
      return { preset: selectedPreset, isCurrentSettings: false };
    }
  };

  // Generate PIN code and save preset
  const handleShare = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { preset } = getPresetToShare();

      // Use unified API service to share preset
      const result: ApiResponse<{ pinCode: string }> = await PresetApiService.sharePreset(preset);

      if (result.success && result.data) {
        setShareResult({
          pinCode: result.data.pinCode,
        });
      } else {
        setError(result.error || "分享失败，请重试");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("网络错误，请检查连接后重试");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get display information for selected preset
  const getShareInfo = (): {
    title: string;
    description: string[];
    preset: PresetType;
  } | null => {
    try {
      const { preset, isCurrentSettings } = getPresetToShare();

      if (isCurrentSettings) {
        return {
          title: "分享当前设置",
          description: getPresetDetailedInfo(preset),
          preset,
        };
      } else {
        return {
          title: `分享预设：${preset.name}`,
          description: getPresetDetailedInfo(preset),
          preset,
        };
      }
    } catch {
      return null;
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  // Reset dialog state when opening
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setShareResult(null);
      setError(null);
      setCopied(false);
      setSelectedPresetId("current"); // Reset to current settings
    }
  };

  const shareInfo = getShareInfo();

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild className={className}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <p className="text-sm font-bold">分享预设</p>
          </DialogTitle>
          <DialogDescription>
            选择要分享的预设并生成一个6位PIN码
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 min-h-0 flex-1 overflow-hidden">
          {!shareResult ? (
            <>
              {/* Preset selection */}
              <div className="space-y-2 mt-3">
                <Select value={selectedPresetId} onValueChange={setSelectedPresetId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择要分享的预设" />
                  </SelectTrigger>
                  <SelectContent className="z-1001">
                    <SelectItem value="current">分享当前设置</SelectItem>
                    {localPresets.map((preset) => (
                      <SelectItem key={preset.id} value={preset.id}>
                        {preset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected preset info */}
              {shareInfo && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="preset-details" className="rounded-lg">
                    <AccordionTrigger className="px-3 py-2 hover:no-underline">
                      <div className="text-sm font-medium">
                       预设详情 : {shareInfo.preset.name}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3 max-h-32 overflow-y-auto custom-scrollbar">
                      <div className="text-xs text-muted-foreground leading-relaxed space-y-1">
                        {shareInfo.description.map((detail, index) => (
                          <div key={index}>{detail}</div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}

              {/* Error display */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                  <AlertCircle size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* No valid selection */}
              {!shareInfo && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                  <AlertCircle size={16} />
                  <span className="text-sm">请选择要分享的预设</span>
                </div>
              )}

              {/* Share button */}
              <Button
                onClick={handleShare}
                disabled={isLoading || !shareInfo}
                variant="outline"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>生成预设分享PIN码</>
                )}
              </Button>
            </>
          ) : (
            <>
              {/* Success result */}
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold font-mono mb-1">
                    {shareResult.pinCode}
                  </div>
                </div>

                {/* PIN Code copy */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Button
                      size="lg"
                      className="w-full"
                      variant="outline"
                      onClick={() => copyToClipboard(shareResult.pinCode)}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
