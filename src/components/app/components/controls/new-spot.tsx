import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DialogClose } from '@radix-ui/react-dialog'
import { useEffect, useState } from 'react'
import { useListsQueries } from '../../hooks/useListsQueries'
import { useListsStore } from '../../stores/lists'

export default function NewList() {
  const { createSpotMutation } = useListsQueries()
  const { currentList } = useListsStore()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    if (!createSpotMutation.isSuccess) return

    setOpen(false)
  }, [createSpotMutation.isSuccess])

  useEffect(() => {
    setName('')
    setLocation('')
  }, [open])

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          disabled={!currentList}
          variant="accent"
          className="flex-1"
        >
          New Spot
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            createSpotMutation.mutate({
              name: name,
              link: location,
              listId: currentList!.id,
            })
          }}
        >
          <DialogHeader>
            <DialogTitle>New Spot</DialogTitle>
            <DialogDescription className="text-foreground">
              Add a new spot to the list. Click create when
              you're ready.
            </DialogDescription>
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
                placeholder="Tasty Fries"
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
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                disabled={createSpotMutation.isPending}
                type="button"
                variant="outline"
              >
                Close
              </Button>
            </DialogClose>
            <Button
              disabled={
                createSpotMutation.isPending || name === ''
              }
              type="submit"
            >
              Create Spot
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
