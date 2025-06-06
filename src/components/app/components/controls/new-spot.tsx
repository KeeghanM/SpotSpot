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
import { useAppStore } from '../../stores/app'

export default function NewList() {
  const { currentList } = useAppStore()
  const { createSpotMutation } = useListsQueries()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    if (!createSpotMutation.isSuccess) return

    setOpen(false)
  }, [createSpotMutation.isSuccess])

  useEffect(() => {
    setName('')
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
        <DialogHeader>
          <DialogTitle>New Spot</DialogTitle>
          <DialogDescription className="text-foreground">
            Add a new spot to the list. Click create when
            you&apos;re ready.
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
            onClick={() => {
              createSpotMutation.mutate({
                name: name,
                location: null,
                listId: currentList!.id,
                notes: '',
                rating: 0,
                visited: false,
                tags: [],
              })
            }}
          >
            Create Spot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
