import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Rating from '../spot/rating'
import type { TSpot } from '../../stores/app'

interface ISpotListItemProps {
  spot: TSpot
}

export default function SpotListItem({
  spot,
}: ISpotListItemProps) {
  const handleLocationPress = () => {
    if (spot.location?.link) {
      Linking.openURL(spot.location.link)
    }
  }

  return (
    <View
      style={[
        styles.container,
        spot.visited
          ? styles.visitedContainer
          : styles.unvisitedContainer,
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.spotName}>{spot.name}</Text>
        {spot.visited && (
          <Ionicons
            name="checkmark-done-circle"
            size={20}
            color="#a855f7"
          />
        )}
      </View>

      {spot.rating && spot.rating > 0 && (
        <View style={styles.ratingContainer}>
          <Rating rating={spot.rating} />
        </View>
      )}

      {spot.location?.link && spot.location?.name && (
        <TouchableOpacity
          onPress={handleLocationPress}
          style={styles.locationContainer}
        >
          <Text style={styles.locationText}>
            {spot.location.name.length > 30
              ? spot.location.name.substring(0, 29) + '...'
              : spot.location.name}
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
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  visitedContainer: {
    borderColor: '#fce7f3',
    backgroundColor: '#fed7aa', // orange-200 to pink-200 gradient simulation
  },
  unvisitedContainer: {
    borderColor: '#fce7f3',
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spotName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#be185d', // pink-800
  },
  ratingContainer: { alignSelf: 'flex-start' },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7c3aed', // purple-600
  },
  locationIcon: { marginLeft: 4 },
})
