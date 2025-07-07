"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/layout";
import { Download, X } from "lucide-react";
import { ShareIos } from "@/components/ui/icon";
import { GlowEffect } from "@/components/ui/onboarding";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const setCookie = (name: string, value: string, hours: number) => {
  const date = new Date();
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [promptInstall, setPromptInstall] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    // 检查用户是否已经关闭过安装提示
    const dismissed = getCookie("pwa-install-dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
    } else {
      // 显示安装提示
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    const ready = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setPromptInstall(e);
    };

    window.addEventListener("beforeinstallprompt", ready as EventListener);

    return () => {
      window.removeEventListener("beforeinstallprompt", ready as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!promptInstall) {
      return;
    }
    const result = await promptInstall.prompt();
    console.log("👍", "userChoice", result);
    setPromptInstall(null);
    setIsVisible(false);
  };

  const handleNotRemindAgain = () => {
    setIsVisible(false);
    setIsDismissed(true);
    // 设置cookie过期时间为一周（7 * 24小时）
    setCookie("pwa-install-dismissed", "true", 7 * 24);
  };

  const handleClose = () => {
    setIsVisible(false);
    setIsDismissed(true);
    // 设置cookie过期时间为一周（7 * 24小时）
    setCookie("pwa-install-dismissed", "true", 7 * 24);
  };

  // 如果已经是standalone模式（已安装）或用户已关闭提示，则不显示
  if (!isVisible || isStandalone || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-6 z-[100] left-4 right-4 md:left-auto md:right-6 md:w-96">
      <div className="relative p-6 bg-black border rounded-lg mx-auto max-w-sm md:mx-0 md:max-w-none">
        <Button
          onClick={handleClose}
          variant="ghost"
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors z-10"
          aria-label="关闭安装提示"
        >
          <X className="w-4 h-4 text-white/60 hover:text-white" />
        </Button>

        <div className="pr-8 select-none">
          <h3 className="text-lg font-semibold text-white mb-2">
            {isIOS ? "添加到主屏幕" : "安装应用"}
          </h3>

          <p className="text-white/70 text-sm mb-4 leading-relaxed">
            {isIOS
              ? "本应用已良好支持PWA，将此应用添加到主屏幕，获得更好的使用体验"
              : "本应用已良好支持PWA，安装此应用到您的设备，享受快速启动和离线使用功能"}
          </p>

          {isIOS ? (
            <div className="text-sm text-white/80 mb-4">
              <p className="mb-3">
                点击浏览器底部的{" "}
                <ShareIos className="text-white w-4 h-4 inline mx-1" />{" "}
                分享按钮，然后选择"添加到主屏幕"
              </p>
            </div>
          ) : (
            <div className="mb-4">
              <Button
                variant="outline"
                onClick={handleInstallClick}
                className="w-full py-3 transition-colors duration-200 border-white/20 hover:border-white/30 bg-white/5 hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-2" />
                立即安装
              </Button>
            </div>
          )}

          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleNotRemindAgain}>
            <input
              type="checkbox"
              className="w-3 h-3 rounded border-white/30 bg-transparent checked:bg-white/20 checked:border-white/50"
              readOnly
            />
            <span className="text-xs text-white/60 hover:text-white/80 transition-colors">
              {isIOS ? "我已添加到主屏幕，不再提示" : "我已安装，不再提示"}
            </span>
          </div>
        </div>
      </div>
      <GlowEffect
        mode="pulse"
        blur="strongest"
        scale={1.1}
        colors={["#423E8B", "#211E55"]}
        className="absolute -z-1 inset-0 rounded-full transition-opacity duration-200"
      />
    </div>
  );
}
