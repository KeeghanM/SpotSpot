import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface IRatingProps {
  rating: number
  maxRating?: number
  size?: number
  editable?: boolean
  setRating?: (rating: number) => void
  onRatingChange?: (rating: number) => void
}

export default function Rating({
  rating,
  maxRating = 5,
  size = 16,
  editable = false,
  setRating,
  onRatingChange,
}: IRatingProps) {
  const handleStarPress = (index: number) => {
    if (editable) {
      const newRating = index + 1
      if (setRating) setRating(newRating)
      if (onRatingChange) onRatingChange(newRating)
    }
  }

  return (
    <View style={styles.container}>
      {Array.from({ length: maxRating }, (_, index) => {
        const isFilled = index < rating
        const isHalf =
          index === Math.floor(rating) && rating % 1 !== 0

        return (
          <Ionicons
            key={index}
            name={
              isFilled
                ? 'star'
                : isHalf
                  ? 'star-half'
                  : 'star-outline'
            }
            size={size}
            color={
              isFilled || isHalf ? '#fbbf24' : '#d1d5db'
            }
            style={styles.star}
            onPress={
              editable
                ? () => handleStarPress(index)
                : undefined
            }
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  star: { marginRight: 2 },
})
