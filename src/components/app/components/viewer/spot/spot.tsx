import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import type { Spot } from '../../../stores/lists'
import {
  IoCheckmarkDoneCircle,
  IoStarOutline,
  IoStar,
  IoOpenOutline,
} from 'react-icons/io5'
import { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useListsQueries } from '../../../hooks/useListsQueries'
import { Textarea } from '@/components/ui/textarea'
import Location from './location'
import Rating from './rating'
import Display from './display'
import Editor from './editor'
interface SpotProps {
  spot: Spot
}

export default function Spot({ spot }: SpotProps) {
  const { updateSpotMutation, deleteSpotMutation } =
    useListsQueries()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(spot.name)
  const [locationName, setLocationName] = useState(
    spot.locationName ?? '',
  )
  const [locationAddress, setLocationAddress] = useState(
    spot.locationAddress ?? '',
  )
  const [locationLink, setLocationLink] = useState(
    spot.locationLink ?? '',
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
      <DialogTrigger asChild>
        <Display
          spot={spot}
          open={() => setOpen(true)}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Spot</DialogTitle>
        </DialogHeader>
        <Editor
          {...{
            name,
            locationName,
            locationAddress,
            locationLink,
            visited,
            rating,
            notes,
            tags,
            setName,
            setLocationName,
            setLocationAddress,
            setLocationLink,
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
                locationName: locationName,
                locationAddress: locationAddress,
                locationLink: locationLink,
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
