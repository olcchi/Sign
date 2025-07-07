"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/layout";
import { Download, X, Bug } from "lucide-react";
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

// PWA状态监视器组件
function PWAStatusMonitor({
  isIOS,
  isStandalone,
  isDismissed,
  isVisible,
  promptInstall,
  shouldShowPrompt,
}: {
  isIOS: boolean;
  isStandalone: boolean;
  isDismissed: boolean;
  isVisible: boolean;
  promptInstall: BeforeInstallPromptEvent | null;
  shouldShowPrompt: boolean;
}) {
  const [showMonitor, setShowMonitor] = useState(false);

  const statusItems = [
    { label: "isIOS", value: isIOS, color: isIOS ? "text-green-400" : "text-red-400" },
    { label: "isStandalone", value: isStandalone, color: isStandalone ? "text-yellow-400" : "text-gray-400" },
    { label: "isDismissed", value: isDismissed, color: isDismissed ? "text-red-400" : "text-green-400" },
    { label: "isVisible", value: isVisible, color: isVisible ? "text-green-400" : "text-red-400" },
    { label: "beforeinstallprompt", value: !!promptInstall, color: !!promptInstall ? "text-green-400" : "text-red-400" },
    { label: "shouldShowPrompt", value: shouldShowPrompt, color: shouldShowPrompt ? "text-green-400" : "text-red-400" },
  ];

  return (
    <>
      {/* 切换按钮 */}
      <div className="fixed top-16 left-4 z-[150]">
        <Button
          onClick={() => setShowMonitor(!showMonitor)}
          variant="outline"
          size="sm"
          className="bg-black/80 border-white/20 hover:border-white/40 backdrop-blur-sm"
        >
          <Bug className="w-4 h-4 mr-1" />
          PWA状态
        </Button>
      </div>

      {/* 状态监视器面板 */}
      {showMonitor && (
        <div className="fixed top-28 left-4 z-[140] w-72">
          <div className="bg-black/90 border border-white/20 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-white">PWA 安装状态监视器</h4>
              <Button
                onClick={() => setShowMonitor(false)}
                variant="ghost"
                size="sm"
                className="p-1 hover:bg-white/10"
              >
                <X className="w-3 h-3 text-white/60" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {statusItems.map((item) => (
                <div key={item.label} className="flex justify-between items-center text-xs">
                  <span className="text-white/70">{item.label}:</span>
                  <span className={`font-mono ${item.color}`}>
                    {String(item.value)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="text-xs text-white/50 space-y-1">
                <div>UserAgent: {navigator.userAgent.slice(0, 30)}...</div>
                <div>Display Mode: {window.matchMedia("(display-mode: standalone)").matches ? "standalone" : "browser"}</div>
                <div>Cookie: {getCookie("pwa-install-dismissed") || "null"}</div>
                <div>Platform: {navigator.platform}</div>
                <div>Online: {navigator.onLine ? "true" : "false"}</div>
              </div>
              
              {/* 调试按钮 */}
              <div className="mt-3 pt-2 border-t border-white/10 space-y-2">
                {promptInstall && (
                  <Button
                    onClick={async () => {
                      try {
                        await promptInstall.prompt();
                        const choice = await promptInstall.userChoice;
                        console.log('手动触发安装提示结果:', choice);
                      } catch (error) {
                        console.error('手动触发安装提示失败:', error);
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs py-1 h-7 border-white/20 hover:border-white/40"
                  >
                    手动触发安装
                  </Button>
                )}
                
                <Button
                  onClick={() => {
                    setCookie("pwa-install-dismissed", "", -1); // 删除cookie
                    window.location.reload(); // 重新加载页面以重置状态
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs py-1 h-7 border-white/20 hover:border-white/40"
                >
                  重置状态
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [promptInstall, setPromptInstall] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
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

  const shouldShowPrompt = (promptInstall && isVisible) || (isIOS && isVisible);

  return (
    <>
      {/* PWA状态监视器 */}
      <PWAStatusMonitor
        isIOS={isIOS}
        isStandalone={isStandalone}
        isDismissed={isDismissed}
        isVisible={isVisible}
        promptInstall={promptInstall}
        shouldShowPrompt={shouldShowPrompt}
      />

      {/* 原有的安装提示 */}
      {shouldShowPrompt && !isStandalone && !isDismissed && (
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
                  ? "本应用已良好支持PWA,将此应用添加到主屏幕,获得更好的使用体验"
                  : "本应用已良好支持PWA,安装此应用到您的设备,享受快速启动和离线使用功能"}
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
      )}
    </>
  );
}
