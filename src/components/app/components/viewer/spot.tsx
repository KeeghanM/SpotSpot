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
import {
  IoCheckmarkDoneCircle,
  IoStarOutline,
  IoStar,
} from 'react-icons/io5'
import { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useListsQueries } from '../../hooks/useListsQueries'
import { Textarea } from '@/components/ui/textarea'
interface SpotProps {
  spot: Spot
}

export default function Spot({ spot }: SpotProps) {
  const { updateSpotMutation } = useListsQueries()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(spot.name)
  const [location, setLocation] = useState(spot.link ?? '')
  const [visited, setVisited] = useState(
    spot.visited ?? false,
  )
  const [tempRating, setTempRating] = useState(
    spot.rating ?? 0,
  )
  const [rating, setRating] = useState(spot.rating ?? 0)
  const [notes, setNotes] = useState(spot.notes ?? '')

  useEffect(() => {
    if (!updateSpotMutation.isSuccess) return

    setOpen(false)
  }, [updateSpotMutation.isSuccess])

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <div
          className={`cursor-pointer rounded border p-4 ${
            spot.visited ? 'bg-accent' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <p>{spot.name}</p>
            {spot.visited && <IoCheckmarkDoneCircle />}
          </div>
          {spot.rating && (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={'star-' + star}
                  className="text-foreground"
                >
                  {spot.rating && spot.rating >= star ? (
                    <IoStar className="h-4 w-4" />
                  ) : (
                    <IoStarOutline className="h-4 w-4" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            updateSpotMutation.mutate({
              id: spot.id,
              name: name,
              link: location,
              visited: visited,
              rating: rating,
              listId: spot.listId,
              notes: spot.notes,
            })
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit Spot</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="name"
                className="text-right"
              >
                Name
              </Label>
              <Input
                id="name"
                placeholder="Restaurants"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                }}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="location"
                className="text-right"
              >
                Location
              </Label>
              <Input
                id="location"
                placeholder="Start typing..."
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value)
                }}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="visited"
                className="text-right"
              >
                Visited
              </Label>
              <Input
                id="visited"
                type="checkbox"
                checked={visited}
                onChange={(e) => {
                  setVisited(e.target.checked)
                }}
                className="col-span-3 w-4"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="rating"
                className="text-right"
              >
                Rating
              </Label>
              <div
                className="col-span-3 flex items-center gap-2"
                onMouseLeave={() => setTempRating(rating)}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={'star-' + star}
                    onMouseOver={() => setTempRating(star)}
                    onClick={() => {
                      setRating(star)
                      setVisited(true)
                    }}
                    className="text-primary cursor-pointer transition-colors"
                  >
                    {rating >= star ||
                    tempRating >= star ? (
                      <IoStar className="h-6 w-6" />
                    ) : (
                      <IoStarOutline className="h-6 w-6" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="notes"
                className="text-right"
              >
                Notes
              </Label>
              <Textarea
                rows={3}
                id="notes"
                placeholder="Notes..."
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value)
                }}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                disabled={updateSpotMutation.isPending}
                variant="outline"
              >
                Close
              </Button>
            </DialogClose>
            <Button
              disabled={
                updateSpotMutation.isPending || name === ''
              }
              type="submit"
            >
              Update Spot
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
