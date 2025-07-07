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
  date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export function InstallPrompt() {
  const [mounted, setMounted] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [promptInstall, setPromptInstall] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);

    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    const dismissed = getCookie("pwa-install-dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
    } else {
      if (isIOSDevice) {
        setIsVisible(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const ready = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setPromptInstall(e);
      if (!isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", ready as EventListener);

    return () => {
      window.removeEventListener("beforeinstallprompt", ready as EventListener);
    };
  }, [mounted, isDismissed]);

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
    setIsDismissed(true);
    setCookie("pwa-install-dismissed", "true", 2);
  };

  if (!mounted || isStandalone || isDismissed) {
    return null;
  }

  const shouldShowPrompt = (promptInstall && isVisible) || (isIOS && isVisible);

  if (!shouldShowPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-6 z-[100] left-4 right-4 md:left-auto md:right-6 md:w-96">
      <div className="relative p-6 bg-black border rounded-lg mx-auto max-w-sm md:mx-0 md:max-w-none">
        <Button
          onClick={handleClose}
          variant="ghost"
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors z-10"
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
              : "本应用已良好支持PWA，安装此应用到您的设备，享受快速启动和离线使用功能。"}
          </p>

          {isIOS ? (
            <div className="text-sm text-white/80">
              <p className="mb-2">
                点击浏览器底部的{" "}
                <ShareIos className="text-white w-4 h-4 inline mx-1" />{" "}
                分享按钮， 然后选择"添加到主屏幕"
              </p>
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
