import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useAppStore } from '../../stores/app'
import { useFiltersStore } from '../../stores/filters'
import { useListsQueries } from '../../hooks/useListsQueries'

export default function MapViewer() {
  const { currentList } = useAppStore()
  const { showVisited, selectedTags } = useFiltersStore()
  const { listsQuery } = useListsQueries()

  // For React Native, we would need to use react-native-maps or similar
  // For now, we'll show a placeholder indicating map functionality would go here
  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Text style={styles.title}>🗺️ Map View</Text>
        <Text style={styles.subtitle}>
          Map functionality would be implemented here using
          react-native-maps
        </Text>
        {currentList && (
          <Text style={styles.listInfo}>
            Showing spots from: {currentList.name}
          </Text>
        )}
        <Text style={styles.info}>
          {selectedTags.length > 0 &&
            `Filtered by tags: ${selectedTags.map((t) => t.name).join(', ')}\n`}
          {showVisited
            ? 'Showing visited spots'
            : 'Hiding visited spots'}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f9ff' },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  listInfo: {
    fontSize: 14,
    color: '#7c3aed',
    fontWeight: '500',
    marginBottom: 8,
  },
  info: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  },
})
