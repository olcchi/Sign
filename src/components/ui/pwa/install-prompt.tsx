"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/layout";
import { Download, X, MoreVertical } from "lucide-react";
import { ShareIos } from "@/components/ui/icon";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPrompt() {
  const [mounted, setMounted] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMacOS, setIsMacOS] = useState(false);
  const [isMacOSSafari, setIsMacOSSafari] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [promptInstall, setPromptInstall] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    const userAgent = navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && 
      !(window as unknown as { MSStream?: unknown }).MSStream;
    const isMacOSDevice = /Mac/.test(userAgent) && !/iPad|iPhone|iPod/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    const isAndroidDevice = /Android/.test(userAgent);

    setIsIOS(isIOSDevice);
    setIsMacOS(isMacOSDevice);
    setIsMacOSSafari(isMacOSDevice && isSafari);
    setIsAndroid(isAndroidDevice);

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const ready = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setPromptInstall(e);
    };

    window.addEventListener("beforeinstallprompt", ready as EventListener);

    return () => {
      window.removeEventListener("beforeinstallprompt", ready as EventListener);
    };
  }, [mounted]);

  const handleInstallClick = async () => {
    if (!promptInstall) {
      return;
    }
    const result = await promptInstall.prompt();
    console.log("👍", "userChoice", result);
    setPromptInstall(null);
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || isStandalone || !isVisible) {
    return null;
  }

  const shouldShowPrompt = isIOS || isMacOS || isAndroid || promptInstall;

  if (!shouldShowPrompt) {
    return null;
  }

  // Determine platform type for UI
  const getPlatformInfo = () => {
    if (isIOS) {
      return {
        title: "添加到主屏幕",
        description: "将此应用添加到主屏幕，获得更好的使用体验"
      };
    } else if (isMacOSSafari || isMacOS) {
      return {
        title: "安装到 Dock",
        description: "将此应用安装到程序坞，享受快速启动和离线使用功能。"
      };
    } else if (isAndroid) {
      return {
        title: "安装应用",
        description: "将此应用安装到您的设备，享受快速启动和离线使用功能。"
      };
    } else {
      return {
        title: "安装应用",
        description: "安装此应用到您的设备，享受快速启动和离线使用功能。"
      };
    }
  };

  const platformInfo = getPlatformInfo();

  return (
    <div className="fixed bottom-6 right-6 z-[100] max-w-sm">
      <div className="relative p-6 bg-black border rounded-lg">
        <Button
          onClick={handleClose}
          variant="ghost"
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-4 h-4 text-white/60 hover:text-white" />
        </Button>

        <div className="pr-8">
          <h3 className="text-lg font-semibold text-white mb-2">
            {platformInfo.title}
          </h3>

          <p className="text-white/70 text-sm mb-4 leading-relaxed">
            本应用已良好支持PWA，{platformInfo.description}
          </p>

          {isIOS ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-white/80">
                <span className="flex items-center gap-2">
                  1.点击浏览器底部的 <ShareIos className="text-white w-4 h-4" />
                  分享按钮
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <span className="flex items-center gap-2">
                  2.选择 <span className="text-white underline">添加到主屏幕</span>{" "}
                  创建桌面快捷方式
                </span>
              </div>
            </div>
          ) : isMacOSSafari ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-white/80">
                <span>
                 1.点击浏览器地址栏右侧的 <ShareIos className="text-white w-4 h-4 inline" /> 分享按钮
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <span>
                  2.选择 <span className="text-white underline">添加到程序坞</span>
                </span>
              </div>
            </div>
          ) : isMacOS ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-white/80">
                <span className="flex items-center gap-2">
                  1.点击地址栏右侧的 <Download className="text-white w-4 h-4" /> 安装图标
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <span className="flex items-center gap-2">
                  2.或点击浏览器右上角 <MoreVertical className="text-white w-4 h-4" /> 菜单
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <span>
                  3.选择 <span className="text-white underline">安装应用</span> 或 <span className="text-white underline">添加到 Dock</span>
                </span>
              </div>
            </div>
          ) : isAndroid && !promptInstall ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-white/80">
                <span className="flex items-center gap-2">
                  1.点击浏览器右上角的 <MoreVertical className="text-white w-4 h-4" /> 菜单
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <span>
                  2.选择 <span className="text-white underline">安装应用</span> 或 <span className="text-white underline">添加到主屏幕</span>
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <span className="text-white/60">
                  💡 如果没有看到安装选项，请确保使用 Chrome 或 Edge 浏览器
                </span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <Button
                variant="outline"
                onClick={handleInstallClick}
                className="relative w-full py-3 transition-colors duration-200 border-white/20 hover:border-white/30"
              >
                <Download className="w-4 h-4 mr-2" />
                立即安装
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
