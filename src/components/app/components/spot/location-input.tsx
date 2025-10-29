import { Input } from '@/components/ui/input'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { useEffect, useRef, useState } from 'react'
import type { TLocation } from '../../stores/app'

interface ILocationProps {
  location: TLocation
  setLocation: (location: TLocation) => void
  className?: string
}

export default function LocationInput({
  location,
  setLocation,
  className,
}: ILocationProps) {
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

    setPlaceAutocomplete(
      new places.Autocomplete(inputRef.current, {
        fields: ['formatted_address', 'name', 'geometry'],
      }),
    )
  }, [places])

  useEffect(() => {
    if (!placeAutocomplete) return

    placeAutocomplete.addListener('place_changed', () => {
      const place = placeAutocomplete.getPlace()
      if (!place) return

      setLocation({
        name: place.name || '',
        address: place.formatted_address || '',
        link: addressToURL(place.formatted_address || ''),
        lat: place.geometry?.location?.lat() || 0,
        lng: place.geometry?.location?.lng() || 0,
      })
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
