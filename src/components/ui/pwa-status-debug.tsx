"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

interface PWAStatusDebugProps {
  className?: string;
}

export function PWAStatusDebug({ className }: PWAStatusDebugProps) {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkPWAStatus = () => {
      const info = {
        // 基本信息
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        
        // PWA 状态检测
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
        isFullscreen: window.matchMedia('(display-mode: fullscreen)').matches,
        isMinimalUI: window.matchMedia('(display-mode: minimal-ui)').matches,
        isBrowser: window.matchMedia('(display-mode: browser)').matches,
        
        // 浏览器特定检测
        isNavigatorStandalone: (window.navigator as any).standalone,
        
        // 安装状态
        hasBeforeInstallPrompt: 'onbeforeinstallprompt' in window,
        hasServiceWorker: 'serviceWorker' in navigator,
        
        // 设备类型
        isAndroid: /Android/i.test(navigator.userAgent),
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1),
        isChrome: /Chrome/i.test(navigator.userAgent) && !/Edge/i.test(navigator.userAgent),
        isSamsung: /SamsungBrowser/i.test(navigator.userAgent),
        
        // URL 检查
        currentURL: window.location.href,
        hasSourcePWA: window.location.search.includes('source=pwa'),
        
        // 屏幕信息
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        
        // 其他
        timestamp: new Date().toLocaleString()
      };
      
      setDebugInfo(info);
    };

    checkPWAStatus();
    
    // 监听显示模式变化
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addListener(checkPWAStatus);
    
    return () => {
      mediaQuery.removeListener(checkPWAStatus);
    };
  }, []);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const getDisplayMode = () => {
    if (debugInfo.isStandalone) return "standalone ✅";
    if (debugInfo.isFullscreen) return "fullscreen ✅";
    if (debugInfo.isMinimalUI) return "minimal-ui ⚠️";
    if (debugInfo.isBrowser) return "browser ❌";
    return "unknown ❓";
  };

  const getPWAStatus = () => {
    if (debugInfo.isAndroid) {
      if (debugInfo.isStandalone || debugInfo.hasSourcePWA) {
        return "Android PWA 运行中 ✅";
      } else {
        return "Android 浏览器模式 ❌";
      }
    } else if (debugInfo.isIOS) {
      if (debugInfo.isNavigatorStandalone) {
        return "iOS PWA 运行中 ✅";
      } else {
        return "iOS Safari 模式 ❌";
      }
    }
    return "桌面浏览器 🖥️";
  };

  return (
    <div className={cn("fixed top-4 right-4 z-[9999]", className)}>
      <Button
        onClick={toggleVisibility}
        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1"
      >
        PWA调试
      </Button>
      
      {isVisible && (
        <div className="absolute top-10 right-0 w-80 max-h-96 overflow-y-auto bg-black/95 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white text-xs">
          <h3 className="font-bold mb-2">PWA 状态调试</h3>
          
          <div className="space-y-2">
            <div className="p-2 bg-blue-500/20 rounded">
              <strong>状态:</strong> {getPWAStatus()}
            </div>
            
            <div className="p-2 bg-green-500/20 rounded">
              <strong>显示模式:</strong> {getDisplayMode()}
            </div>
            
            {debugInfo.isAndroid && (
              <div className="p-2 bg-yellow-500/20 rounded">
                <strong>Android 提示:</strong><br/>
                {debugInfo.isStandalone 
                  ? "PWA 正在独立模式运行！"
                  : "尝试：Chrome菜单 → 安装应用"
                }
              </div>
            )}
            
            <details className="cursor-pointer">
              <summary className="font-bold">详细信息</summary>
              <div className="mt-2 space-y-1 text-xs">
                <div><strong>设备:</strong> {debugInfo.isAndroid ? 'Android' : debugInfo.isIOS ? 'iOS' : '桌面'}</div>
                <div><strong>浏览器:</strong> {debugInfo.isChrome ? 'Chrome' : debugInfo.isSamsung ? 'Samsung' : '其他'}</div>
                <div><strong>独立模式:</strong> {debugInfo.isStandalone ? '是' : '否'}</div>
                <div><strong>PWA源:</strong> {debugInfo.hasSourcePWA ? '是' : '否'}</div>
                <div><strong>安装提示支持:</strong> {debugInfo.hasBeforeInstallPrompt ? '是' : '否'}</div>
                <div><strong>Service Worker:</strong> {debugInfo.hasServiceWorker ? '支持' : '不支持'}</div>
                <div><strong>屏幕:</strong> {debugInfo.screenWidth}x{debugInfo.screenHeight}</div>
                <div><strong>窗口:</strong> {debugInfo.windowWidth}x{debugInfo.windowHeight}</div>
                <div><strong>URL:</strong> {debugInfo.currentURL}</div>
                <div><strong>检测时间:</strong> {debugInfo.timestamp}</div>
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  );
} 