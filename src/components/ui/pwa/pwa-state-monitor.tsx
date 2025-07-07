"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

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

export function PWAStateMonitor() {
  const [isClient, setIsClient] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [promptInstall, setPromptInstall] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [beforeInstallPromptFired, setBeforeInstallPromptFired] = useState(false);

  useEffect(() => {
    // 确保在客户端环境下执行
    setIsClient(true);
    
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
    const ready = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setBeforeInstallPromptFired(true);
      setPromptInstall(e);
      if (!isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", ready as EventListener);

    return () => {
      window.removeEventListener("beforeinstallprompt", ready as EventListener);
    };
  }, [isDismissed]);

  const shouldShowPrompt = (promptInstall && isVisible) || (isIOS && isVisible);

  // 只在开发环境和客户端显示
  if (process.env.NODE_ENV === "production" || !isClient) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-[200] bg-black/90 text-white p-4 rounded-lg border border-white/20 font-mono text-xs">
      <h3 className="text-sm font-semibold mb-2 text-blue-400">PWA State Monitor</h3>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-300">isIOS:</span>
          <span className={isIOS ? "text-green-400" : "text-red-400"}>
            {isIOS.toString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">isStandalone:</span>
          <span className={isStandalone ? "text-green-400" : "text-red-400"}>
            {isStandalone.toString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">beforeInstallPrompt:</span>
          <span className={beforeInstallPromptFired ? "text-green-400" : "text-red-400"}>
            {beforeInstallPromptFired ? "fired" : "not fired"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">promptInstall:</span>
          <span className={promptInstall ? "text-green-400" : "text-red-400"}>
            {promptInstall ? "available" : "null"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">isVisible:</span>
          <span className={isVisible ? "text-green-400" : "text-red-400"}>
            {isVisible.toString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">isDismissed:</span>
          <span className={isDismissed ? "text-red-400" : "text-green-400"}>
            {isDismissed.toString()}
          </span>
        </div>
        <div className="border-t border-white/20 pt-2 mt-2">
          <div className="flex justify-between">
            <span className="text-yellow-300">shouldShowPrompt:</span>
            <span className={shouldShowPrompt ? "text-green-400" : "text-red-400"}>
              {shouldShowPrompt.toString()}
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          UserAgent: {typeof window !== 'undefined' ? navigator.userAgent.substring(0, 30) : 'N/A'}...
        </div>
      </div>
    </div>
  );
} 