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

// iOS detection - all browsers on iOS use WebKit and have the same limitations
const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

// Check if we're on macOS Safari (which has better fullscreen support than iOS WebKit)
const isMacOSSafari = () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && 
         navigator.platform.indexOf('Mac') > -1 && 
         !isIOS(); // Exclude iOS devices
};

// Check if fullscreen API is actually supported and functional
const isFullscreenSupported = () => {
  if (typeof document === 'undefined') return false;
  
  // iOS WebKit has very limited fullscreen support regardless of browser
  if (isIOS()) {
    return false; // Even if API exists, it's not reliably functional on iOS
  }
  
  // For other platforms, check if the API is available
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
    // Show fullscreen button only on platforms where it actually works well
    // iOS WebKit (all browsers on iOS) has poor fullscreen support
    // macOS Safari and other desktop browsers generally work fine
    const shouldShow = isFullscreenSupported();
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
      
      // Provide platform-specific guidance
      if (isIOS()) {
        alert("iOS 上的所有浏览器都使用 WebKit 内核，对全屏支持有限。\n建议：\n1. 旋转设备到横屏模式获得更好的视觉体验\n2. 使用浏览器的阅读模式或全屏功能");
      } else if (isMacOSSafari()) {
        alert("Safari 全屏功能遇到问题。请尝试：\n1. 更新到最新版本的 Safari\n2. 检查系统偏好设置中的全屏权限");
      } else {
        alert("您的浏览器不支持全屏功能，或者全屏功能被禁用");
      }
    }
  };

  // Don't render the button if fullscreen is not properly supported
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