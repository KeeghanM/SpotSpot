import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native'
import { useAppStore } from '../../stores/app'

export default function MapViewToggle() {
  const { mode, setMode } = useAppStore()

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        setMode(mode === 'list' ? 'map' : 'list')
      }}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>
        {mode === 'list' ? '🗺️ Map View' : '📋 List View'}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})
