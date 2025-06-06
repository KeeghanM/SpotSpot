import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native'
import Modal from 'react-native-modal'
import { useListsQueries } from '../../hooks/useListsQueries'
import { useAppStore } from '../../stores/app'

export default function NewList() {
  const { currentList } = useAppStore()
  const { createListMutation } = useListsQueries()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    if (!createListMutation.isSuccess) return
    setOpen(false)
  }, [createListMutation.isSuccess])

  useEffect(() => {
    setName('')
  }, [open])

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a list name')
      return
    }

    createListMutation.mutate({
      name: name.trim(),
      parentId: currentList ? currentList.id : null,
    })
  }

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setOpen(true)}
      >
        <Text style={styles.buttonText}>New List</Text>
      </TouchableOpacity>

      <Modal
        isVisible={open}
        onBackdropPress={() => setOpen(false)}
        onBackButtonPress={() => setOpen(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>New List</Text>
            <Text style={styles.description}>
              Create a new list of Spots. Click create when
              you're ready.
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Restaurants"
              value={name}
              onChangeText={setName}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.footerButton,
                styles.cancelButton,
              ]}
              onPress={() => setOpen(false)}
              disabled={createListMutation.isPending}
            >
              <Text style={styles.cancelButtonText}>
                Close
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.footerButton,
                styles.createButton,
                (createListMutation.isPending ||
                  name.trim() === '') &&
                  styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={
                createListMutation.isPending ||
                name.trim() === ''
              }
            >
              <Text
                style={[
                  styles.createButtonText,
                  (createListMutation.isPending ||
                    name.trim() === '') &&
                    styles.disabledButtonText,
                ]}
              >
                Create List
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: '#e879f9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    width: '100%',
    maxWidth: 425,
  },
  header: { marginBottom: 16 },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: { fontSize: 14, color: '#6b7280' },
  inputContainer: { marginBottom: 24 },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  footerButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  createButton: { backgroundColor: '#e879f9' },
  createButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: { backgroundColor: '#d1d5db' },
  disabledButtonText: { color: '#9ca3af' },
})
