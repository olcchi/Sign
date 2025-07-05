'use client'

import { useState, useEffect } from 'react'
import { subscribeUser, unsubscribeUser } from '@/app/actions'

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerSW()
    }
  }, [])

  async function registerSW() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
    const sub = await registration.pushManager.getSubscription()
    setSubscription(sub)
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    })
    setSubscription(sub)
    await subscribeUser(sub)
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe()
    setSubscription(null)
    await unsubscribeUser()
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h3 className="text-lg font-semibold">Push Notifications</h3>
      {subscription ? (
        <>
          <p className="text-green-600">✅ You are subscribed to push notifications.</p>
          <button
            onClick={unsubscribeFromPush}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Unsubscribe
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-600">You are not subscribed to push notifications.</p>
          <button
            onClick={subscribeToPush}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Subscribe
          </button>
        </>
      )}
    </div>
  )
} 