import React, { useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useAppStore } from '../../stores/app'
import { useFiltersStore } from '../../stores/filters'
import { useListsQueries } from '../../hooks/useListsQueries'

export default function Filters({
  compact = false,
}: {
  compact?: boolean
}) {
  const { mode, currentList, setCurrentList } =
    useAppStore()
  const {
    tags,
    setSelectedTags,
    showVisited,
    setShowVisited,
    selectedTags,
    setTags,
  } = useFiltersStore()
  const { listsQuery, tagsQuery } = useListsQueries()

  // Populate filters store with tags data from API
  useEffect(() => {
    if (tagsQuery.data) {
      setTags(tagsQuery.data)
    }
  }, [tagsQuery.data, setTags])

  const isTagSelected = (tagId: number) =>
    selectedTags.some((tag) => tag.id === tagId)

  const handleTagToggle = (tag: any) => {
    if (isTagSelected(tag.id)) {
      setSelectedTags(
        selectedTags.filter((t) => t.id !== tag.id),
      )
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  return (
    <View
      style={
        compact ? styles.compactContainer : styles.container
      }
    >
      {mode === 'map' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Select List
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollContainer}
          >
            <TouchableOpacity
              style={[
                styles.listChip,
                !currentList && styles.selectedChip,
              ]}
              onPress={() => setCurrentList(null)}
            >
              <Text
                style={[
                  styles.chipText,
                  !currentList && styles.selectedChipText,
                ]}
              >
                All Lists
              </Text>
            </TouchableOpacity>
            {listsQuery.data?.map((list) => (
              <TouchableOpacity
                key={list.id}
                style={[
                  styles.listChip,
                  currentList?.id === list.id &&
                    styles.selectedChip,
                ]}
                onPress={() => setCurrentList(list)}
              >
                <Text
                  style={[
                    styles.chipText,
                    currentList?.id === list.id &&
                      styles.selectedChipText,
                  ]}
                >
                  {list.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Filter by Tags
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollContainer}
        >
          {tags.map((tag) => (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.tagChip,
                isTagSelected(tag.id) &&
                  styles.selectedChip,
              ]}
              onPress={() => handleTagToggle(tag)}
            >
              <Text
                style={[
                  styles.chipText,
                  isTagSelected(tag.id) &&
                    styles.selectedChipText,
                ]}
              >
                {tag.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>
            Show Visited
          </Text>
          <Switch
            value={showVisited}
            onValueChange={setShowVisited}
            trackColor={{
              false: '#e5e7eb',
              true: '#c084fc',
            }}
            thumbColor={showVisited ? '#ffffff' : '#f3f4f6'}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#fce7f3',
    backgroundColor: '#fdf2f8',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  compactContainer: {
    backgroundColor: 'white',
    paddingVertical: 0,
  },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#be185d',
    marginBottom: 8,
  },
  scrollContainer: { flexDirection: 'row' },
  listChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tagChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedChip: {
    backgroundColor: '#c084fc',
    borderColor: '#a855f7',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  selectedChipText: { color: 'white', fontWeight: '600' },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fce7f3',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#fce7f3',
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#be185d',
  },
})
