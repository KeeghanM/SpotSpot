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
    setPlaceAutocomplete(
      new places.Autocomplete(inputRef.current, options),
    )
  }, [places])

  useEffect(() => {
    if (!placeAutocomplete) return
    placeAutocomplete.addListener('place_changed', () => {
      const place = placeAutocomplete.getPlace()
      if (!place) return

      setLocation(
        place.name ?? '',
        place.formatted_address ?? '',
        place.url ??
          addressToURL(place.formatted_address ?? ''),
      )
    })
  }, [placeAutocomplete])

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
