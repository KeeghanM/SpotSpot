import React from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { useListsQueries } from '../../hooks/useListsQueries'
import List from './list'

export default function ListViewer() {
  const { listsQuery } = useListsQueries()

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: 4 }).map((_, index) => (
        <View
          key={index}
          style={styles.skeleton}
        >
          <ActivityIndicator
            size="large"
            color="#f8bbd9"
          />
        </View>
      ))}
    </View>
  )

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        No lists found. Create your first list!
      </Text>
    </View>
  )

  if (listsQuery.isPending) {
    return renderSkeleton()
  }

  return (
    <View style={styles.container}>
      {listsQuery.data && listsQuery.data.length > 0 ? (
        <FlatList
          data={listsQuery.data}
          keyExtractor={(item) => `list-${item.id}`}
          renderItem={({ item }) => <List list={item} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%' },
  listContainer: { padding: 16, gap: 8 },
  skeletonContainer: { flex: 1, padding: 16, gap: 8 },
  skeleton: {
    height: 85,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 512, // lg width equivalent
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
})
