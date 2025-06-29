import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

// Type definitions for PWA APIs
interface RelatedApp {
  platform: string
  url?: string
  id?: string
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface Navigator {
    getInstalledRelatedApps(): Promise<RelatedApp[]>
  }

  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

export function DownloadButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isAlreadyInstalled, setIsAlreadyInstalled] =
    useState(false)

  useEffect(() => {
    async function checkInstall() {
      // Check if the API is available before using it
      if ('getInstalledRelatedApps' in navigator) {
        const relatedApps =
          await navigator.getInstalledRelatedApps()
        if (relatedApps.length >= 0)
          setIsAlreadyInstalled(false)
      }
    }
    checkInstall()

    function handleBeforeInstallPrompt(
      event: BeforeInstallPromptEvent,
    ) {
      event.preventDefault() // Prevent automatic prompt
      setDeferredPrompt(event) // Store the event
      setIsInstallable(true) // Show the install button
    }

    function handleAppInstalled() {
      setIsInstallable(false) // Hide the install button
    }

    // Add event listeners
    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt,
    )
    window.addEventListener(
      'appinstalled',
      handleAppInstalled,
    )

    // Cleanup on destroy
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      )
      window.removeEventListener(
        'appinstalled',
        handleAppInstalled,
      )
    }
  }, [])

  const installApp = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()

    const choiceResult = await deferredPrompt.userChoice
    if (choiceResult.outcome === 'accepted') {
      window.location.href = '/app'
    }
  }
  if (!isInstallable) {
    return (
      <Button
        size="lg"
        aria-label="Open the SpotSpot App"
      >
        <a href="/app">Login now for free</a>
      </Button>
    )
  }
  if (isAlreadyInstalled) {
    return (
      <Button
        size="lg"
        aria-label="Open the SpotSpot App"
      >
        <a href="/app">Open SpotSpot</a>
      </Button>
    )
  }
  return (
    <Button
      size="lg"
      aria-label="Download the SpotSpot App"
      onClick={installApp}
    >
      Download for Free
    </Button>
  )
}
