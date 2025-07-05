"use client";

import { useState, useEffect } from "react";
import { X, Plus, Share, Smartphone, Download } from "lucide-react";
import { Button } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

interface PWAInstallPromptProps {
  className?: string;
  debugMode?: boolean;
}

export function PWAInstallPrompt({ className, debugMode = true }: PWAInstallPromptProps) {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    // Check device types
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const android = /Android/i.test(navigator.userAgent);
    
    // Check if already running as standalone (installed)
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                      (window.navigator as any).standalone === true;
    
    // Check if user previously dismissed the prompt
    const wasDismissed = localStorage.getItem('pwa-install-dismissed') === 'true';
    
    setIsIOS(iOS);
    setIsAndroid(android);
    setIsStandalone(standalone);
    setDismissed(wasDismissed);
    
    // Debug information
    const debug = `iOS: ${iOS}, Android: ${android}, Standalone: ${standalone}, Dismissed: ${wasDismissed}`;
    setDebugInfo(debug);
    
    // Show prompt if:
    // - Debug mode is on, OR
    // - On mobile device, not standalone, and not previously dismissed
    setShowPrompt(debugMode || ((iOS || android) && !standalone && !wasDismissed));
  }, [debugMode]);

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const handleInstall = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className={cn(
      "fixed bottom-4 left-4 right-4 z-[9999] bg-black/95 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white shadow-2xl",
      className
    )}>
      {debugMode && (
        <div className="mb-3 p-2 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs">
          <strong>调试模式:</strong> {debugInfo}
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            {isAndroid ? <Download size={16} /> : isIOS ? <Smartphone size={16} /> : <Plus size={16} />}
          </div>
          <h3 className="font-medium">
            {isAndroid ? "安装应用获得全屏体验" : isIOS ? "获得更好的全屏体验" : "PWA 安装提示"}
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="text-white/60 hover:text-white hover:bg-white/10 p-1"
        >
          <X size={16} />
        </Button>
      </div>
      
      <p className="text-sm text-white/80 mb-4">
        {isAndroid 
          ? "将 Sign 安装为应用，享受无浏览器界面的真正全屏体验"
          : isIOS 
          ? "将 Sign 添加到主屏幕，享受无浏览器界面的沉浸式全屏体验"
          : "在移动设备上，您可以将此应用添加到主屏幕以获得更好的体验"
        }
      </p>
      
      {isAndroid ? (
        <div className="space-y-3">
          <div className="p-3 bg-green-500/20 border border-green-500/30 rounded">
            <div className="font-medium text-green-300 mb-2">✅ 正确方式：安装应用</div>
            <div className="text-sm space-y-1">
              <div>• 等待浏览器显示"安装应用"横幅</div>
              <div>• 或者：Chrome菜单 → "安装应用"/"安装Sign"</div>
              <div>• 结果：真正的PWA，无浏览器界面</div>
            </div>
          </div>
          
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded">
            <div className="font-medium text-red-300 mb-2">❌ 错误方式：添加书签</div>
            <div className="text-sm space-y-1">
              <div>• Chrome菜单 → "添加到主屏幕"</div>
              <div>• 结果：只是网页快捷方式，仍有浏览器界面</div>
            </div>
          </div>
          
          <div className="text-xs text-white/60">
            💡 提示：如果看不到"安装应用"选项，可能需要先访问应用几次，或者检查Chrome设置中的"网站设置"。
          </div>
        </div>
      ) : isIOS ? (
        <>
          <div className="flex items-center gap-2 text-sm text-white/70 mb-2">
            <span>1. 点击</span>
            <Share size={16} className="mx-1" />
            <span>分享按钮</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70 mb-2">
            <span>2. 选择"添加到主屏幕"</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
            <span>3. 从主屏幕启动获得全屏体验</span>
          </div>
        </>
      ) : (
        <div className="text-sm text-white/70 mb-4">
          在支持的浏览器中，您会看到安装提示。或者在移动设备上使用浏览器菜单中的"添加到主屏幕"选项。
        </div>
      )}
      
      <div className="flex gap-2">
        <Button
          onClick={handleInstall}
          className="flex-1 bg-white text-black hover:bg-white/90"
        >
          我知道了
        </Button>
        <Button
          variant="ghost"
          onClick={handleDismiss}
          className="text-white/60 hover:text-white hover:bg-white/10"
        >
          不再提示
        </Button>
      </div>
    </div>
  );
} 