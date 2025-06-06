import React from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Linking,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import LocationInput from './location-input'
import Rating from './rating'
import Tags from './tags'
import type { TTag } from '../../stores/filters'
import type { TLocation } from '../../stores/app'

interface IEditorProps {
  name: string
  location: TLocation | null
  visited: boolean
  rating: number
  notes: string
  tags: TTag[]
  setName: (name: string) => void
  setLocation: (location: TLocation) => void
  setVisited: (visited: boolean) => void
  setRating: (rating: number) => void
  setNotes: (notes: string) => void
  setTags: (tags: TTag[]) => void
}

export default function Editor({
  name,
  location,
  visited,
  rating,
  notes,
  tags: spotTags,
  setName,
  setLocation,
  setVisited,
  setRating,
  setNotes,
  setTags,
}: IEditorProps) {
  const handleLocationPress = () => {
    if (location?.link) {
      Linking.openURL(location.link)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Restaurant, Park, etc."
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Location</Text>
        <LocationInput
          location={
            location ?? {
              name: '',
              address: '',
              link: '',
              lat: 0,
              lng: 0,
            }
          }
          setLocation={setLocation}
        />
        {location?.name && location?.link && (
          <TouchableOpacity
            onPress={handleLocationPress}
            style={styles.locationLink}
          >
            <Text style={styles.locationLinkText}>
              {location.name.length > 30
                ? location.name.substring(0, 29) + '...'
                : location.name}
            </Text>
            <Ionicons
              name="open-outline"
              size={16}
              color="#7c3aed"
              style={styles.locationIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.field}>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Visited</Text>
          <Switch
            value={visited ?? false}
            onValueChange={setVisited}
            trackColor={{
              false: '#e5e7eb',
              true: '#c084fc',
            }}
            thumbColor={visited ? '#ffffff' : '#f3f4f6'}
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Rating</Text>{' '}
        <Rating
          rating={rating ?? 0}
          setRating={(r: number) => {
            setRating(r)
            setVisited(r > 0)
          }}
          editable
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Notes..."
          value={notes ?? ''}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <Tags
        spotTags={spotTags}
        setTags={setTags}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: 16, paddingVertical: 16 },
  field: { gap: 8 },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    minHeight: 80,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationLinkText: {
    fontSize: 14,
    color: '#7c3aed',
    fontWeight: '500',
  },
  locationIcon: { marginLeft: 4 },
})
