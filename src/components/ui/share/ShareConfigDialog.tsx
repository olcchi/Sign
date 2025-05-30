"use client";

import React, { useState } from "react";
import {
  generatePinCode,
  saveSharedPreset,
  createPresetShareUrl,
  ShareApiResponse,
} from "@/lib/share-api";
import { Preset } from "@/components/ui/settings/Preset";
import { Button } from "@/components/ui/layout/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Copy, Check, Loader2, AlertCircle } from "lucide-react";

interface SharePresetDialogProps {
  children: React.ReactNode;
  className?: string;
  activePreset?: Preset | null; // Current active preset
}

export default function SharePresetDialog({
  children,
  className,
  activePreset,
}: SharePresetDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareResult, setShareResult] = useState<{
    pinCode: string;
    shareUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate PIN code and save preset
  const handleShare = async () => {
    if (!activePreset) {
      setError("请先激活一个预设");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate new PIN code and save preset
      const pinCode = generatePinCode();
      const result: ShareApiResponse = await saveSharedPreset(
        pinCode,
        activePreset
      );

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
      setError("网络错误，请检查连接后重试");
    } finally {
      setIsLoading(false);
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
            生成一个6位PIN码来分享你的预设配置
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!shareResult ? (
            <>
              {/* Active preset info */}
              {activePreset && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium">{activePreset.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {activePreset.text.length > 50
                      ? `${activePreset.text.substring(0, 50)}...`
                      : activePreset.text}
                  </div>
                </div>
              )}

              {/* Error display */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                  <AlertCircle size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              {/* no activePreset */}
              {!activePreset && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                  <AlertCircle size={16} />
                  <span className="text-sm">激活您需要分享的预设</span>
                </div>
              )}
              {/* Share button */}
              <Button
                onClick={handleShare}
                disabled={isLoading || !activePreset}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>生成分享链接</>
                )}
              </Button>
            </>
          ) : (
            <>
              {/* Success result */}
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {shareResult.pinCode}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    PIN码（24小时内有效）
                  </div>
                </div>

                {/* PIN Code copy */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {/* <Input
                      id="pin-code"
                      value={shareResult.pinCode}
                      readOnly
                      className="font-mono text-center text-lg"
                    /> */}
                    <Label htmlFor="pin-code">PIN码</Label>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(shareResult.pinCode)}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </Button>
                  </div>
                </div>

                {/* Share URL copy */}
                <div className="space-y-2">
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
                </div>
              </div>

              {/* Generate new button */}
              <Button
                variant="outline"
                onClick={() => setShareResult(null)}
                className="w-full"
              >
                重新生成
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
