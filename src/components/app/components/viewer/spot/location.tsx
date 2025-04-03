import { useMapsLibrary } from '@vis.gl/react-google-maps'

import { Input } from '@/components/ui/input'
import { useEffect, useRef, useState } from 'react'

interface LocationProps {
  location: string
  setLocation: (location: string) => void
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

  useEffect(() => {
    if (!places || !inputRef.current) return
    const options = {
      fields: ['geometry', 'name', 'formatted_address'],
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
      setLocation(place.name ?? '')
    })
  }, [placeAutocomplete])

  return (
    <Input
      ref={inputRef}
      className={className}
      type="text"
      placeholder="Search for a place..."
      value={location}
      onChange={(e) => {
        setLocation(e.target.value)
      }}
    />
  )
}
