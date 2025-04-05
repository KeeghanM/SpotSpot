import { useMapsLibrary } from '@vis.gl/react-google-maps'

import { Input } from '@/components/ui/input'
import { useEffect, useRef, useState } from 'react'

interface LocationProps {
  location: { name: string; address: string; link: string }
  setLocation: (
    name: string,
    address: string,
    link: string,
  ) => void
  className?: string
}
export default function Location({
  location,
  setLocation,
  className,
}: LocationProps) {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const places = useMapsLibrary('places')
  const observerRef = useRef<MutationObserver | null>(null)

  const addressToURL = (address: string) => {
    if (!address) return ''
    const url = new URL(
      'https://www.google.com/maps/search/?api=1',
    )
    url.searchParams.set('query', address)
    return url.href
  }

  useEffect(() => {
    if (!places || !inputRef.current) return
    const options = {
      fields: [
        'geometry',
        'name',
        'formatted_address',
        'url',
      ],
    }
    const autocomplete = new places.Autocomplete(
      inputRef.current,
      options,
    )
    setPlaceAutocomplete(autocomplete)

    const listener = autocomplete.addListener(
      'place_changed',
      () => {
        const place = autocomplete.getPlace()
        if (!place) return

        setLocation(
          place.name ?? '',
          place.formatted_address ?? '',
          place.url ??
            addressToURL(place.formatted_address ?? ''),
        )
      },
    )

    return () => {
      if (listener)
        google.maps.event.removeListener(listener)
      if (autocomplete) autocomplete.unbindAll()
    }
  }, [places])

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'childList' &&
          mutation.addedNodes.length > 0
        ) {
          const pacContainer = document.querySelector(
            '.pac-container',
          )
          if (pacContainer) {
            const stopPropagation = (e: Event) => {
              e.stopPropagation()
            }

            pacContainer.addEventListener(
              'mousedown',
              stopPropagation,
              true,
            )
            pacContainer.addEventListener(
              'pointerdown',
              stopPropagation,
              true,
            )

            pacContainer
              .querySelectorAll('.pac-item')
              .forEach((item) => {
                item.addEventListener(
                  'mousedown',
                  stopPropagation,
                  true,
                )
                item.addEventListener(
                  'pointerdown',
                  stopPropagation,
                  true,
                )
              })

            observer.disconnect()
          }
        }
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    observerRef.current = observer

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <Input
      ref={inputRef}
      className={className}
      type="text"
      placeholder="Search for a place..."
      defaultValue={location.name}
    />
  )
}
