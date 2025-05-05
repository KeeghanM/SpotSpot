import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import type { Spot } from '../../stores/lists'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useListsQueries } from '../../hooks/useListsQueries'
import Editor from './editor'

interface SpotProps {
  spot: Spot
  children: React.ReactNode
}
export default function Spot({
  spot,
  children,
}: SpotProps) {
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

  const handleDeleteSpot = (e: React.MouseEvent) => {
    if (confirmDelete) {
      deleteSpotMutation.mutate(spot)
      setConfirmDelete(false)
    } else {
      setConfirmDelete(true)
    }
  }

  useEffect(() => {
    if (
      updateSpotMutation.isSuccess ||
      deleteSpotMutation.isSuccess
    )
      setOpen(false)
  }, [
    updateSpotMutation.isSuccess,
    deleteSpotMutation.isSuccess,
  ])

  useEffect(() => {
    setConfirmDelete(false)
  }, [open])

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
        onPointerDownOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit Spot</DialogTitle>
        </DialogHeader>
        <Editor
          {...{
            name,
            location,
            visited,
            rating,
            notes,
            tags,
            setName,
            setLocation,
            setVisited,
            setRating,
            setNotes,
            setTags,
          }}
        />
        <DialogFooter>
          <Button
            variant="destructive"
            disabled={
              updateSpotMutation.isPending ||
              deleteSpotMutation.isPending
            }
            onClick={handleDeleteSpot}
            className="mr-auto"
          >
            {confirmDelete ? 'Are you sure?' : 'Delete'}
          </Button>
          <DialogClose asChild>
            <Button
              disabled={
                updateSpotMutation.isPending ||
                deleteSpotMutation.isPending
              }
              variant="outline"
              onClick={() => {
                setOpen(false)
              }}
            >
              Close
            </Button>
          </DialogClose>
          <Button
            disabled={
              updateSpotMutation.isPending ||
              deleteSpotMutation.isPending ||
              name === ''
            }
            type="submit"
            onClick={() => {
              updateSpotMutation.mutate({
                id: spot.id,
                name: name,
                location,
                visited: visited,
                rating: rating,
                listId: spot.listId,
                notes: spot.notes,
                tags: tags,
              })
            }}
          >
            Update Spot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
