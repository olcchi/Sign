"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/layout";
import { Download, X } from "lucide-react";
import { ShareIos } from "@/components/ui/icon";
import { GlowEffect } from "@/components/ui/onboarding";
import { Checkbox } from "@/components/ui/inputs";
import { AnimatePresence, motion } from "motion/react";

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

// Enhanced PWA standalone detection
const isPWAStandalone = () => {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    // iOS Safari PWA detection
    (window.navigator as any).standalone === true
  );
};

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [promptInstall, setPromptInstall] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(
      navigator.userAgent
    );

    setIsIOS(isIOSDevice);
    setIsSafari(isSafariBrowser);

    // Use enhanced standalone detection
    const standaloneMode = isPWAStandalone();
    setIsStandalone(standaloneMode);

    const dismissed = getCookie("pwa-install-dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
    } else {
      // Only show if not in standalone mode
      if (!standaloneMode) {
        setIsVisible(true);
      }
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
    setCookie("pwa-install-dismissed", "true", 7 * 24);
  };

  const handleClose = () => {
    setIsVisible(false);
    setIsDismissed(true);
    setCookie("pwa-install-dismissed", "true", 7 * 24);
  };

  const shouldShowShareInstructions = isIOS || isSafari;

  // Enhanced condition: don't show if standalone OR dismissed
  if (!isVisible || isStandalone || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed bottom-4 z-[998] left-4 right-4 md:left-4 md:w-96"
      >
        <div className="relative p-6 bg-black border rounded-lg mx-auto max-w-sm md:mx-0 md:max-w-none">
          <Button
            onClick={handleClose}
            variant="ghost"
            className="absolute top-4 right-4 transition-colors z-10"
            aria-label="关闭安装提示"
          >
            <X className="w-4 h-4 text-white/60 hover:text-white" />
          </Button>

          <div className=" select-none">
            <h3 className="text-lg font-semibold text-white mb-2">
              {shouldShowShareInstructions ? "添加Sign到主屏幕" : "安装Sign"}
            </h3>

            <p className="text-white/70 text-sm mb-4 leading-relaxed">
              {shouldShowShareInstructions
                ? "Sign 良好支持PWA ( 渐进式Web应用 ) ,将 Sign 添加到主屏幕以获得最佳使用体验"
                : "Sign 良好支持PWA ( 渐进式Web应用 ) ,安装 Sign 到您的设备以获得最佳使用体验"}
            </p>

            {shouldShowShareInstructions ? (
              <div className="text-sm text-white/80 mb-4">
                <p className="mb-3">
                  {isIOS ? (
                    <>
                      点击浏览器底部的{" "}
                      <ShareIos className="text-white w-4 h-4 inline mx-1" />{" "}
                      分享按钮，然后选择"添加到主屏幕"
                    </>
                  ) : (
                    <>
                      点击浏览器菜单栏的{" "}
                      <ShareIos className="text-white w-4 h-4 inline mx-1" />{" "}
                      分享按钮，选择"添加到程序坞"
                    </>
                  )}
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

            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={handleNotRemindAgain}
            >
              <Checkbox checked={isDismissed} />
              <span className="text-xs text-white/60 hover:text-white/80 transition-colors">
                {shouldShowShareInstructions
                  ? "我已添加到主屏幕，不再提示"
                  : "我已安装，不再提示"}
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
      </motion.div>
    </AnimatePresence>
  );
}
