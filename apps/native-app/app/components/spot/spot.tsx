import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native'
import Modal from 'react-native-modal'
import { useListsQueries } from '../../hooks/useListsQueries'
import Editor from './editor'
import type { TSpot } from '../../stores/app'

interface ISpotProps {
  spot: TSpot
  children: React.ReactNode
}

export default function Spot({
  spot,
  children,
}: ISpotProps) {
  const { updateSpotMutation, deleteSpotMutation } =
    useListsQueries()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(spot.name)
  const [location, setLocation] = useState(
    spot.location ?? {
      name: '',
      address: '',
      link: '',
      lat: 0,
      lng: 0,
    },
  )
  const [visited, setVisited] = useState(
    spot.visited ?? false,
  )
  const [rating, setRating] = useState(spot.rating ?? 0)
  const [notes, setNotes] = useState(spot.notes ?? '')
  const [tags, setTags] = useState(spot.tags ?? [])

  const handleDeleteSpot = () => {
    if (confirmDelete) {
      deleteSpotMutation.mutate(spot)
      setConfirmDelete(false)
      setOpen(false)
    } else {
      setConfirmDelete(true)
      // Auto-reset confirmation after 3 seconds
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  const handleSave = () => {
    updateSpotMutation.mutate({
      ...spot,
      name,
      location: location.name ? location : null,
      visited,
      rating,
      notes,
      tags,
    })
  }

  useEffect(() => {
    if (updateSpotMutation.isSuccess) {
      setOpen(false)
    }
  }, [updateSpotMutation.isSuccess])

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setName(spot.name)
      setLocation(
        spot.location ?? {
          name: '',
          address: '',
          link: '',
          lat: 0,
          lng: 0,
        },
      )
      setVisited(spot.visited ?? false)
      setRating(spot.rating ?? 0)
      setNotes(spot.notes ?? '')
      setTags(spot.tags ?? [])
      setConfirmDelete(false)
    }
  }, [open, spot])

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>

      <Modal
        isVisible={open}
        onBackdropPress={() => setOpen(false)}
        onBackButtonPress={() => setOpen(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Spot</Text>
          </View>

          <Editor
            name={name}
            setName={setName}
            location={location}
            setLocation={setLocation}
            visited={visited}
            setVisited={setVisited}
            rating={rating}
            setRating={setRating}
            notes={notes}
            setNotes={setNotes}
            tags={tags}
            setTags={setTags}
          />

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.footerButton,
                styles.deleteButton,
                confirmDelete && styles.confirmDeleteButton,
              ]}
              onPress={handleDeleteSpot}
              disabled={deleteSpotMutation.isPending}
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

            <View style={styles.rightButtons}>
              <TouchableOpacity
                style={[
                  styles.footerButton,
                  styles.cancelButton,
                ]}
                onPress={() => setOpen(false)}
                disabled={updateSpotMutation.isPending}
              >
                <Text style={styles.cancelButtonText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.footerButton,
                  styles.saveButton,
                  updateSpotMutation.isPending &&
                    styles.disabledButton,
                ]}
                onPress={handleSave}
                disabled={updateSpotMutation.isPending}
              >
                <Text
                  style={[
                    styles.saveButtonText,
                    updateSpotMutation.isPending &&
                      styles.disabledButtonText,
                  ]}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
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
    maxHeight: '90%',
  },
  header: { marginBottom: 16 },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    gap: 12,
  },
  rightButtons: { flexDirection: 'row', gap: 12 },
  footerButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  deleteButton: { backgroundColor: '#ef4444' },
  confirmDeleteButton: { backgroundColor: '#dc2626' },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  confirmDeleteButtonText: { fontWeight: '600' },
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
  saveButton: { backgroundColor: '#10b981' },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: { backgroundColor: '#d1d5db' },
  disabledButtonText: { color: '#9ca3af' },
})
