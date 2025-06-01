import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { DialogContent } from '@radix-ui/react-dialog'
import { useState } from 'react'
import { FiFilter } from 'react-icons/fi'
import Filters from './filters'

export default function FiltersDrawer() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        className="fixed right-6 bottom-24 z-40 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 p-0 shadow-lg hover:from-purple-500 hover:to-pink-500"
        style={{ width: 56, height: 56 }}
        onClick={() => setOpen(true)}
        aria-label="Open Filters"
      >
        <FiFilter className="h-7 w-7 text-white" />
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent className="w-full max-w-md overflow-hidden rounded-2xl p-0">
          <div className="bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-pink-700">
                Filters
              </h2>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </div>
            <Filters compact />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
