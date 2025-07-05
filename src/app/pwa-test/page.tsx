'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NotificationDemo } from '@/components/ui/pwa'

export default function PWATestPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            PWA 功能测试页面
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* PWA 安装状态 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                PWA 安装状态
              </h2>
              <div className="space-y-3">
                                 <div className="flex items-center justify-between">
                   <span className="text-gray-700 dark:text-gray-300">Service Worker:</span>
                   <span className="text-green-600 font-medium">
                     {mounted && 'serviceWorker' in navigator ? '✅ 支持' : '❌ 不支持'}
                   </span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-gray-700 dark:text-gray-300">Push Manager:</span>
                   <span className="text-green-600 font-medium">
                     {mounted && 'PushManager' in window ? '✅ 支持' : '❌ 不支持'}
                   </span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-gray-700 dark:text-gray-300">Standalone Mode:</span>
                   <span className="text-green-600 font-medium">
                     {mounted && window.matchMedia('(display-mode: standalone)').matches ? '✅ 已安装' : '❌ 未安装'}
                   </span>
                 </div>
              </div>
            </div>

            {/* 推送通知测试 */}
            <NotificationDemo />

            {/* PWA 功能说明 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                PWA 功能说明
              </h2>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <strong className="text-gray-900 dark:text-white">✨ 离线支持:</strong>
                  <p>应用可以在离线状态下使用基本功能</p>
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-white">📱 安装到主屏幕:</strong>
                  <p>可以像原生应用一样安装到设备主屏幕</p>
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-white">🔔 推送通知:</strong>
                  <p>支持后台推送通知功能</p>
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-white">⚡ 快速加载:</strong>
                  <p>Service Worker 缓存提供快速加载体验</p>
                </div>
              </div>
            </div>

            {/* 安装指南 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                安装指南
              </h2>
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                                 <div>
                   <strong className="text-gray-900 dark:text-white">Chrome/Edge:</strong>
                   <p>点击地址栏右侧的安装图标，或使用菜单中的&quot;安装应用&quot;选项</p>
                 </div>
                 <div>
                   <strong className="text-gray-900 dark:text-white">Firefox:</strong>
                   <p>点击地址栏中的安装图标</p>
                 </div>
                 <div>
                   <strong className="text-gray-900 dark:text-white">iOS Safari:</strong>
                   <p>点击分享按钮 ⬆️，然后选择&quot;添加到主屏幕&quot; ➕</p>
                 </div>
                 <div>
                   <strong className="text-gray-900 dark:text-white">Android Chrome:</strong>
                   <p>会自动显示&quot;添加到主屏幕&quot;横幅，或通过菜单安装</p>
                 </div>
              </div>
            </div>
          </div>

          {/* 返回主页 */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              ← 返回主页
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 