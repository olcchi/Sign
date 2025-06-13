"use client";

import React, { useState } from "react";
import {
  generatePinCode,
  saveSharedPreset,
  createPresetShareUrl,
  ShareApiResponse,
} from "@/lib/share-api";
import { Preset } from "@/components/ui/settings/Preset";
import { TextSettings, EffectsSettings } from "@/lib/contexts/SettingsContext";
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
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/layout/accordion";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Copy, Check, Loader2, AlertCircle, X } from "lucide-react";
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

interface ShareDialogProps {
  children: React.ReactNode;
  className?: string;
  activePreset?: Preset | null; // Current active preset
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
    shareUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine what to share: current settings or active preset
  const getPresetToShare = (): {
    preset: Preset;
    isCurrentSettings: boolean;
  } => {
    if (!currentTextSettings || !currentEffectsSettings) {
      // Fallback to active preset if current settings not provided
      if (activePreset) {
        return { preset: activePreset, isCurrentSettings: false };
      }
      throw new Error("没有可分享的设置");
    }

    // Simple logic: share active preset if exists, otherwise share current settings
    if (activePreset) {
      return { preset: activePreset, isCurrentSettings: false };
    } else {
      // No active preset, create temporary preset from current settings
      const currentPreset = createPresetFromCurrentSettings(
        currentTextSettings,
        currentEffectsSettings,
        "当前设置"
      );
      return { preset: currentPreset, isCurrentSettings: true };
    }
  };

  // Generate PIN code and save preset
  const handleShare = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { preset } = getPresetToShare();

      // Generate new PIN code and save preset
      const pinCode = generatePinCode();
      const result: ShareApiResponse = await saveSharedPreset(pinCode, preset);

      if (result.success) {
        const shareUrl = createPresetShareUrl(pinCode);
        setShareResult({
          pinCode,
          shareUrl,
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

  // Get display information for what will be shared
  const getShareInfo = () => {
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
            <p className="text-sm font-bold">
              {shareInfo?.title || "分享设置"}
            </p>
          </DialogTitle>
          <DialogDescription>
            {shareInfo
              ? "生成一个6位PIN码来分享你的当前应援牌配置"
              : "生成一个6位PIN码来分享你的预设配置"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!shareResult ? (
            <>
              {/* Active preset info */}
              {shareInfo && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="preset-details" className="rounded-lg">
                    <AccordionTrigger className="px-3 py-2 hover:no-underline">
                      <div className="text-sm font-medium">{shareInfo.preset.name}</div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3">
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
              {/* no activePreset */}
              {!shareInfo && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                  <AlertCircle size={16} />
                  <span className="text-sm">激活您需要分享的预设</span>
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
                  <>生成分享PIN码</>
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

                {/* Share URL copy */}
                {/* <div className="space-y-2">
                  <Label htmlFor="share-url">分享链接</Label>
                  <div className="flex gap-2">
                    <Input
                      id="share-url"
                      value={shareResult.shareUrl}
                      readOnly
                      className="text-sm"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(shareResult.shareUrl)}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </Button>
                  </div>
                </div> */}
              </div>

              {/* Generate new button */}
              {/* <Button
                variant="outline"
                onClick={() => setShareResult(null)}
                className="w-full"
              >
                重新生成
              </Button> */}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
