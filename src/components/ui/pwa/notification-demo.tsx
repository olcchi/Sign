'use client'

import { useState } from 'react'
import { sendNotification } from '@/app/actions'
import { PushNotificationManager } from './push-notification-manager'

export function NotificationDemo() {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendNotification = async () => {
    if (!message.trim()) return
    
    setIsLoading(true)
    try {
      const result = await sendNotification(message)
      if (result.success) {
        alert('Notification sent successfully!')
        setMessage('')
      } else {
        alert('Failed to send notification: ' + result.error)
      }
    } catch (error) {
      alert('Error: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        PWA Notification Demo
      </h2>
      
      <PushNotificationManager />
      
      <div className="mt-6">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Test Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter notification message..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          rows={3}
        />
        <button
          onClick={handleSendNotification}
          disabled={!message.trim() || isLoading}
          className="mt-3 w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {isLoading ? 'Sending...' : 'Send Test Notification'}
        </button>
      </div>
    </div>
  )
} 