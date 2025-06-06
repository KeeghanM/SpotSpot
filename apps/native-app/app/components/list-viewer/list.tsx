import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native'
import { useListsQueries } from '../../hooks/useListsQueries'
import { useFiltersStore } from '../../stores/filters'
import Spot from '../spot'
import SpotListItem from './spot-list-item'
import {
  useAppStore,
  type TListWithSpots,
} from '../../stores/app'

interface IListProps {
  list: TListWithSpots
}

export default function List({ list }: IListProps) {
  const { currentList, setCurrentList } = useAppStore()
  const { selectedTags, showVisited } = useFiltersStore()
  const { deleteListMutation } = useListsQueries()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDeleteList = () => {
    if (confirmDelete) {
      deleteListMutation.mutate(list.id)
      setConfirmDelete(false)
    } else {
      setConfirmDelete(true)
      // Auto-reset confirmation after 3 seconds
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  const handleListPress = () => {
    setConfirmDelete(false)
    setCurrentList(
      currentList?.id === list.id ? null : list,
    )
  }

  const filteredSpots =
    list.spots
      ?.filter((spot) => {
        if (selectedTags.length === 0) return true
        return spot.tags?.some((tag) =>
          selectedTags.some(
            (selectedTag) => tag.id === selectedTag.id,
          ),
        )
      })
      .filter((spot) => {
        if (showVisited) return true
        return !spot.visited
      })
      .sort((a, b) => {
        // visited last, then alphabetical
        if (a.visited === b.visited) {
          return a.name.localeCompare(b.name)
        }
        return a.visited ? 1 : -1
      }) || []

  const visitedCount =
    list.spots?.reduce(
      (acc, spot) => acc + (spot.visited ? 1 : 0),
      0,
    ) || 0

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.listHeader,
          currentList?.id === list.id &&
            styles.selectedListHeader,
        ]}
        onPress={handleListPress}
        activeOpacity={0.7}
      >
        <View style={styles.listInfo}>
          <Text style={styles.listName}>{list.name}</Text>
          <Text style={styles.visitedCount}>
            Visited: {visitedCount}/
            {list.spots?.length || 0}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.deleteButton,
            confirmDelete && styles.confirmDeleteButton,
          ]}
          onPress={handleDeleteList}
          disabled={deleteListMutation.isPending}
        >
          <Text
            style={[
              styles.deleteButtonText,
              confirmDelete &&
                styles.confirmDeleteButtonText,
            ]}
          >
            {confirmDelete ? 'Are you sure?' : 'Delete'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {currentList?.id === list.id && (
        <View style={styles.spotsContainer}>
          {list.spots?.length > 0 ? (
            <FlatList
              data={filteredSpots}
              keyExtractor={(item) => `spot-${item.id}`}
              renderItem={({ item }) => (
                <Spot spot={item}>
                  <SpotListItem spot={item} />
                </Spot>
              )}
              contentContainerStyle={styles.spotsList}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false} // Let parent handle scrolling
            />
          ) : (
            <View style={styles.emptySpots}>
              <Text style={styles.emptySpotsText}>
                No spots found, add your first one now.
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 512, // lg width equivalent
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'white',
  },
  selectedListHeader: {
    backgroundColor: '#fed7aa', // orange-100 equivalent
  },
  listInfo: { flex: 1 },
  listName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  visitedCount: { fontSize: 14, color: '#6b7280' },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  confirmDeleteButton: { backgroundColor: '#dc2626' },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  confirmDeleteButtonText: { fontWeight: '600' },
  spotsContainer: { marginHorizontal: 16, marginTop: 8 },
  spotsList: { gap: 4 },
  emptySpots: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySpotsText: {
    fontSize: 20,
    color: '#6b7280',
    textAlign: 'center',
  },
})
