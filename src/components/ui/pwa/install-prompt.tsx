'use client'

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [promptInstall, setPromptInstall] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream
    )

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
  }, [])

  useEffect(() => {
    const ready = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setPromptInstall(e)
    }

    window.addEventListener('beforeinstallprompt', ready as EventListener)

    return () => {
      window.removeEventListener('beforeinstallprompt', ready as EventListener)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!promptInstall) {
      return
    }
    const result = await promptInstall.prompt()
    console.log('👍', 'userChoice', result)
    setPromptInstall(null)
  }

  if (isStandalone) {
    return null // Don't show install button if already installed
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isIOS && (
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
          <p className="text-sm">
            To install this app on your iOS device, tap the share button{' '}
            <span className="inline-block">⬆️</span> and then &quot;Add to Home Screen&quot;{' '}
            <span className="inline-block">➕</span>.
          </p>
        </div>
      )}

      {promptInstall && (
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
          onClick={handleInstallClick}
        >
          Install App
        </button>
      )}
    </div>
  )
} 