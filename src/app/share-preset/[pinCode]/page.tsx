"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadSharedPreset, ShareablePreset } from "@/lib/share-api";
import { SettingsProvider } from "@/lib/contexts/SettingsContext";
import FullScreen from "@/components/ui/layout/fullScreen";
import ScrollingText from "@/components/ui/widgets/scrollingText/scrollingText";
import { EdgeBlurEffect } from "@/components/ui/filter/EdgeBlurEffect";
import { useRef } from "react";
import Image from "next/image";
import "@/components/ui/widgets/shinyText/shinyText.css";
import Noise from "@/components/ui/filter/noise";
import { Button } from "@/components/ui/layout/button";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";

// Loading state component
function LoadingState() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center text-white">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-lg">加载分享预设中...</p>
      </div>
    </div>
  );
}

// Error state component
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center text-white max-w-md mx-auto p-6">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <h1 className="text-xl font-bold mb-2">加载失败</h1>
        <p className="text-gray-300 mb-6">{error}</p>
        <div className="space-y-3">
          <Button onClick={onRetry} variant="outline" className="w-full">
            重试
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="ghost"
            className="w-full"
          >
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}

// Preview content component that displays the shared preset
function PreviewContent({ presetData }: { presetData: ShareablePreset }) {
  const textRef = useRef<HTMLDivElement>(null);
  const [isTextScrolling, setIsTextScrolling] = useState(false);

  // Default background settings for preset preview
  const backgroundSettings = {
    backgroundColor: "#000000",
    backgroundImage: null,
    backgroundPosition: { x: 50, y: 50 },
    backgroundZoom: 1,
    overlayEnabled: false,
  };

  return (
    <main
      className="relative w-screen h-[100dvh] overflow-hidden font-sans"
      style={{ backgroundColor: backgroundSettings.backgroundColor }}
    >
      {/* Noise texture adds visual depth and dimension */}
      {presetData.noiseEnabled && (
        <Noise
          className="z-30 mix-blend-overlay"
          opacity={presetData.noiseOpacity || 0.5}
          density={presetData.noiseDensity || 0.5}
          color="#ffffff"
        />
      )}

      {/* Scrolling text component with preset settings */}
      <ScrollingText
        className="fixed inset-0 z-20 overflow-hidden flex items-center justify-center"
        fontFamily={presetData.fontFamily}
        text={presetData.text}
        fontSize={presetData.fontSize}
        fontWeight={presetData.fontWeight}
        color={presetData.textColor}
        textRef={textRef as React.RefObject<HTMLDivElement>}
        scrollSpeed={presetData.scrollSpeed}
        onScrollStateChange={setIsTextScrolling}
        shinyTextEnabled={presetData.shinyTextEnabled}
        textStrokeEnabled={presetData.textStrokeEnabled}
        textStrokeWidth={presetData.textStrokeWidth}
        textStrokeColor={presetData.textStrokeColor}
        textFillEnabled={presetData.textFillEnabled}
      />

      {/* Edge blur effect for visual polish */}
      <EdgeBlurEffect
        className="pointer-events-none fixed inset-0 z-30"
        enabled={presetData.edgeBlurEnabled}
        intensity={presetData.edgeBlurIntensity}
      />

      {/* Fullscreen toggle button */}
      <FullScreen asButton={true} className="z-[999]" />

      {/* Back to home button */}
      <Button
        onClick={() => (window.location.href = "/")}
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-[999] bg-black/20 backdrop-blur-sm text-white hover:bg-black/40"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回首页
      </Button>

      {/* Preset info overlay */}
      <div className="fixed bottom-4 left-4 z-[999] bg-black/20 backdrop-blur-sm text-white p-3 rounded-md">
        <p className="text-sm font-medium">{presetData.name}</p>
        <p className="text-xs text-gray-300">
          {presetData.text.substring(0, 30)}
          {presetData.text.length > 30 ? "..." : ""}
        </p>
      </div>
    </main>
  );
}

// Main page component for shared preset preview
export default function SharePresetPreviewPage() {
  const params = useParams();
  const [presetData, setPresetData] = useState<ShareablePreset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pinCode = params.pinCode as string;

  // Load shared preset
  const loadPreset = async () => {
    if (!pinCode) {
      setError("无效的PIN码");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await loadSharedPreset(pinCode);

      if (result.success && result.preset) {
        setPresetData(result.preset);
      } else {
        setError(result.error || "加载预设失败");
      }
    } catch (err) {
      setError("网络错误，请检查连接后重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreset();
  }, [pinCode]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadPreset} />;
  }

  if (!presetData) {
    return <ErrorState error="预设不存在" onRetry={loadPreset} />;
  }

  return (
    <SettingsProvider>
      <PreviewContent presetData={presetData} />
    </SettingsProvider>
  );
} 