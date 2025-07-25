"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PresetApiService } from "@/lib/preset-api";
import { ApiResponse } from "@/types";
import { PresetType } from "@/types";
import { TextSettings, EffectsSettings } from "@/types";
import {
  createPresetFromCurrentSettings,
  getPresetDetailedInfo,
} from "@/lib/preset-utils";
import { loadPresetsFromLocalStorage } from "@/lib/preset-conversion";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/inputs";
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

  // States for preset naming
  const [currentPresetName, setCurrentPresetName] = useState("");
  const [showPresetNameInput, setShowPresetNameInput] = useState(false);
  const presetNameInputRef = useRef<HTMLInputElement>(null);

  // Load local presets from localStorage
  useEffect(() => {
    const presets = loadPresetsFromLocalStorage();
    setLocalPresets(presets);
    
    // Set default selection based on whether local presets exist
    if (isOpen) {
      if (presets.length > 0) {
        // If local presets exist, select the first one
        setSelectedPresetId(presets[0].id);
        setShowPresetNameInput(false);
        setCurrentPresetName("");
      } else {
        // If no local presets, select current settings
        setSelectedPresetId("current");
        
        // Generate default name for current settings
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const dateString = `${year}${month}${day}`;
        
        setCurrentPresetName(dateString);
        setShowPresetNameInput(true);
        setTimeout(() => presetNameInputRef.current?.focus(), 100);
      }
    }
  }, [isOpen]); // Reload when dialog opens

  // Handle preset selection change
  const handlePresetSelectionChange = (value: string) => {
    setSelectedPresetId(value);

    if (value === "current") {
      // Generate current date in YYYYMMDD format for default name
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const dateString = `${year}${month}${day}`;

      setCurrentPresetName(dateString);
      setShowPresetNameInput(true);
      setTimeout(() => presetNameInputRef.current?.focus(), 10);
    } else {
      setShowPresetNameInput(false);
      setCurrentPresetName("");
    }
  };

  // Get the preset to share based on selection
  const getPresetToShare = (): {
    preset: PresetType;
    isCurrentSettings: boolean;
  } => {
    if (selectedPresetId === "current") {
      if (!currentTextSettings || !currentEffectsSettings) {
        throw new Error("没有可分享的当前设置");
      }
      const presetName = currentPresetName.trim() || "当前设置";
      const currentPreset = createPresetFromCurrentSettings(
        currentTextSettings,
        currentEffectsSettings,
        presetName
      );
      return { preset: currentPreset, isCurrentSettings: true };
    } else {
      const selectedPreset = localPresets.find(
        (p) => p.id === selectedPresetId
      );
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
      const result: ApiResponse<{ pinCode: string }> =
        await PresetApiService.sharePreset(preset);

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
      // Default selection logic is now handled in useEffect
    } else {
      // Reset states when closing
      setCurrentPresetName("");
      setShowPresetNameInput(false);
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

        <div className="space-y-4">
          {!shareResult ? (
            <>
              {/* Preset selection */}
              <Select
                value={selectedPresetId}
                onValueChange={handlePresetSelectionChange}
              >
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

              {/* Preset naming input for current settings */}
              <AnimatePresence>
                {showPresetNameInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full"
                  >
                    <div className="relative">
                      <input
                        ref={presetNameInputRef}
                        type="text"
                        value={currentPresetName}
                        onChange={(e) => setCurrentPresetName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            presetNameInputRef.current?.blur();
                          }
                        }}
                        placeholder=""
                        className="w-full px-3 pt-6 pb-2 text-sm bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <p className="absolute left-3 top-2 text-xs text-muted-foreground pointer-events-none">
                        预设名称
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Selected preset info */}
              {shareInfo && (
                <Accordion
                  type="single"
                  collapsible
                  className="w-full border border-border rounded-md"
                >
                  <AccordionItem value="preset-details" className="rounded-lg">
                    <AccordionTrigger className="px-3 py-2 hover:no-underline">
                      <div className="text-sm font-medium">
                        预设详情 : {shareInfo.preset.name}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3 max-h-20 overflow-y-auto custom-scrollbar">
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
              <div className="space-y-3 mt-3">
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
