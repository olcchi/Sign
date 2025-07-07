import { Maximize, Minimize } from "lucide-react";
import { useFullScreenStore } from "@/stores/full-screen-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/layout";
import { useUserActivityTracking } from "@/lib/hooks/useUserActivityTracking";
import { useEffect, useState } from "react";

interface FullScreenProps {
  className?: string;
  asButton?: boolean;
}

// iOS Safari fullscreen detection and control
const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

// Check if running in PWA standalone mode
const isPWAStandalone = () => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.matchMedia('(display-mode: fullscreen)').matches ||
         // iOS Safari PWA detection
         (window.navigator as any).standalone === true;
};

// Check if fullscreen API is actually supported (not just partially)
const isFullscreenSupported = () => {
  if (typeof document === 'undefined') return false;
  
  return !!(
    document.fullscreenEnabled ||
    (document as any).webkitFullscreenEnabled ||
    (document as any).mozFullScreenEnabled ||
    (document as any).msFullscreenEnabled
  );
};

const getFullscreenElement = () => {
  return document.fullscreenElement || 
         (document as any).webkitFullscreenElement ||
         (document as any).mozFullScreenElement ||
         (document as any).msFullscreenElement;
};

const requestFullscreen = (element: HTMLElement) => {
  if (element.requestFullscreen) {
    return element.requestFullscreen();
  } else if ((element as any).webkitRequestFullscreen) {
    return (element as any).webkitRequestFullscreen();
  } else if ((element as any).mozRequestFullScreen) {
    return (element as any).mozRequestFullScreen();
  } else if ((element as any).msRequestFullscreen) {
    return (element as any).msRequestFullscreen();
  }
  return Promise.reject(new Error('Fullscreen not supported'));
};

const exitFullscreen = () => {
  if (document.exitFullscreen) {
    return document.exitFullscreen();
  } else if ((document as any).webkitExitFullscreen) {
    return (document as any).webkitExitFullscreen();
  } else if ((document as any).mozCancelFullScreen) {
    return (document as any).mozCancelFullScreen();
  } else if ((document as any).msExitFullscreen) {
    return (document as any).msExitFullscreen();
  }
  return Promise.reject(new Error('Exit fullscreen not supported'));
};

export function FullScreen({ className, asButton = false }: FullScreenProps) {
  const { isFull, setIsFull } = useFullScreenStore();
  const isActive = useUserActivityTracking(3000);
  const [shouldShowButton, setShouldShowButton] = useState(false);

  useEffect(() => {
    // Only show fullscreen button if:
    // 1. Not running in PWA standalone mode (already fullscreen)
    // 2. Not on iOS (since iOS has very limited support)
    // 3. AND fullscreen API is properly supported
    const shouldShow = !isPWAStandalone() && !isIOS() && isFullscreenSupported();
    setShouldShowButton(shouldShow);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (isFull || getFullscreenElement()) {
        await exitFullscreen();
        setIsFull(false);
      } else {
        await requestFullscreen(document.documentElement);
        setIsFull(true);
      }
    } catch (err) {
      console.error("Fullscreen operation failed:", err);
      // Provide user guidance for unsupported browsers
      if (isIOS()) {
        alert("iOS Safari 不完全支持程序化全屏。请使用浏览器的全屏功能：\n1. 点击地址栏旁的 'aA' 按钮\n2. 选择 '隐藏工具栏'\n3. 或者旋转设备到横屏模式");
      } else {
        alert("您的浏览器不支持全屏功能");
      }
    }
  };

  // Don't render the button if:
  // - Already in PWA standalone mode (already fullscreen)
  // - Fullscreen API is not properly supported
  // - Running on iOS (limited fullscreen support)
  if (!shouldShowButton) {
    return null;
  }

  const icon = isFull ? (
    <Minimize size={20} color="white" />
  ) : (
    <Maximize size={20} color="white" />
  );

  return (
    <div 
      className={cn(
        "activity-opacity", 
        isActive ? "active" : "inactive",
        className
      )}
    >
      {asButton ? (
        <Button
          variant="ghost"
          onClick={toggleFullscreen}
          className="hover:bg-[#080808] "
          aria-label={isFull ? "退出全屏" : "进入全屏"}
        >
          {icon}
        </Button>
      ) : (
        <div onClick={toggleFullscreen}>{icon}</div>
      )}
    </div>
  );
}