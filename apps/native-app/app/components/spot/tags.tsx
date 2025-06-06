import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native'
import { useFiltersStore, TTag } from '../../stores/filters'

interface ITagsProps {
  spotTags: TTag[]
  setTags: (tags: TTag[]) => void
}

export default function Tags({
  spotTags,
  setTags,
}: ITagsProps) {
  const { tags: availableTags } = useFiltersStore()
  const [input, setInput] = useState('')
  const [showInput, setShowInput] = useState(false)

  const isSelected = (tag: TTag) =>
    spotTags.some((t) => t.id === tag.id)

  const handleSelect = (tag: TTag) => {
    if (isSelected(tag)) {
      setTags(spotTags.filter((t) => t.id !== tag.id))
    } else {
      setTags([...spotTags, tag])
    }
  }

  const handleCreate = () => {
    if (!input.trim()) return
    const newTag: TTag = {
      id: Math.random(),
      name: input.trim(),
    }
    setTags([...spotTags, newTag])
    setInput('')
    setShowInput(false)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tags</Text>
      <FlatList
        data={availableTags}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.tag,
              isSelected(item) && styles.selectedTag,
            ]}
            onPress={() => handleSelect(item)}
          >
            <Text
              style={
                isSelected(item)
                  ? styles.selectedText
                  : styles.tagText
              }
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          showInput ? (
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="New tag"
                onSubmitEditing={handleCreate}
                returnKeyType="done"
              />
              <TouchableOpacity
                onPress={handleCreate}
                style={styles.addBtn}
              >
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setShowInput(true)}
              style={styles.addBtn}
            >
              <Text style={styles.addBtnText}>+ New</Text>
            </TouchableOpacity>
          )
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  label: { fontWeight: 'bold', marginBottom: 4 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#eee',
    marginRight: 8,
  },
  selectedTag: { backgroundColor: '#ffb6c1' },
  tagText: { color: '#333' },
  selectedText: { color: '#fff', fontWeight: 'bold' },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 32,
    minWidth: 80,
    marginRight: 8,
  },
  addBtn: {
    backgroundColor: '#ffb6c1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
})
