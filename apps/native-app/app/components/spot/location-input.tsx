import React, { useState } from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native'
import type { TLocation } from '../../stores/app'

interface ILocationProps {
  location: TLocation
  setLocation: (location: TLocation) => void
  style?: any
}

export default function LocationInput({
  location,
  setLocation,
  style,
}: ILocationProps) {
  const [searchText, setSearchText] = useState(
    location.name || '',
  )

  const addressToURL = (address: string) => {
    if (!address) return ''
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    return url
  }

  const handleTextChange = (text: string) => {
    setSearchText(text)
    // For React Native, we'll use a simple text input without autocomplete
    // In a production app, you'd integrate with a service like Google Places API
    setLocation({
      name: text,
      address: text,
      link: addressToURL(text),
      lat: 0,
      lng: 0,
    })
  }

  const handleSubmit = () => {
    if (searchText.trim()) {
      setLocation({
        name: searchText.trim(),
        address: searchText.trim(),
        link: addressToURL(searchText.trim()),
        lat: 0,
        lng: 0,
      })
    }
  }

  return (
    <TextInput
      style={[styles.input, style]}
      placeholder="Search for a place..."
      value={searchText}
      onChangeText={handleTextChange}
      onSubmitEditing={handleSubmit}
      returnKeyType="done"
    />
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
})
