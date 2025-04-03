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
  const { createListMutation } = useListsQueries()
  const { currentList } = useListsStore()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    if (!createListMutation.isSuccess) return

    setOpen(false)
  }, [createListMutation.isSuccess])

  useEffect(() => {
    setName('')
  }, [open])

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button variant="outline">New List</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            createListMutation.mutate({
              name: name,
              parentId: currentList ? currentList.id : null,
            })
          }}
        >
          <DialogHeader>
            <DialogTitle>New List</DialogTitle>
            <DialogDescription className="text-foreground">
              Create a new list of Spots. Click create when
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
                placeholder="Restaurants"
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
                disabled={createListMutation.isPending}
                type="button"
                variant="outline"
              >
                Close
              </Button>
            </DialogClose>
            <Button
              disabled={
                createListMutation.isPending || name === ''
              }
              type="submit"
            >
              Create List
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
