import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export function DownloadButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isAlreadyInstalled, setIsAlreadyInstalled] =
    useState(false)

  useEffect(() => {
    async function checkInstall() {
      const relatedApps =
        await navigator.getInstalledRelatedApps()
      if (relatedApps.length >= 0)
        setIsAlreadyInstalled(false)
    }
    checkInstall()

    function handleBeforeInstallPrompt(event) {
      event.preventDefault() // Prevent automatic prompt
      setDeferredPrompt(event) // Store the event
      setIsInstallable(true) // Show the install button
      console.log('PWA install prompt fired')
    }

    function handleAppInstalled() {
      console.log('PWA installed')
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

  // Function to handle installation
  const installApp = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt() // Show the prompt

    const choiceResult = await deferredPrompt.userChoice
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the PWA installation')
    } else {
      console.log('User dismissed the PWA installation')
    }

    // Reset after interaction
    setDeferredPrompt(null)
    setIsInstallable(false)
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
