import Creatable from 'react-select/creatable'
import {
  useListsStore,
  type Tag,
} from '@/components/app/stores/lists'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Location from './location'
import { IoOpenOutline } from 'react-icons/io5'
import Rating from './rating'
import { Textarea } from '@/components/ui/textarea'
import { authClient } from '@/lib/auth/client-react'

interface EditorProps {
  name: string
  locationName: string
  locationAddress: string
  locationLink: string
  visited: boolean
  rating: number
  notes: string
  tags: Tag[]
  setName: (name: string) => void
  setLocationName: (name: string) => void
  setLocationAddress: (address: string) => void
  setLocationLink: (link: string) => void
  setVisited: (visited: boolean) => void
  setRating: (rating: number) => void
  setNotes: (notes: string) => void
  setTags: (tags: Tag[]) => void
}
export default function Editor({
  name,
  locationName,
  locationAddress,
  locationLink,
  visited,
  rating,
  notes,
  tags: spotTags,
  setName,
  setLocationName,
  setLocationAddress,
  setLocationLink,
  setVisited,
  setRating,
  setNotes,
  setTags,
}: EditorProps) {
  const { tags: availableTags } = useListsStore()
  const { data: userData } = authClient.useSession()

  return (
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
          placeholder="Restaurant, Park, etc."
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
        <div className="col-span-3">
          <Location
            location={{
              name: locationName ?? '',
              address: locationAddress ?? '',
              link: locationLink ?? '',
            }}
            setLocation={(name, address, link) => {
              setLocationName(name)
              setLocationAddress(address)
              setLocationLink(link)
            }}
          />
          {locationLink && (
            <a
              href={locationLink}
              target="_blank"
              className="text-primary mt-4 text-sm hover:underline"
            >
              {locationName!.length > 30
                ? locationName!.substring(0, 29) + '...'
                : locationName}{' '}
              <IoOpenOutline className="inline h-4 w-4" />
            </a>
          )}
        </div>
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
          checked={visited ?? false}
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
        <div className="col-span-3 flex items-center gap-2">
          <Rating
            rating={rating ?? 0}
            setRating={(r) => {
              setRating(r)
              setVisited(r > 0)
            }}
            editable
          />
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
          value={notes ?? ''}
          onChange={(e) => {
            setNotes(e.target.value)
          }}
          className="col-span-3"
        />
      </div>
      <Creatable
        options={availableTags.map((tag) => ({
          label: tag.name,
          value: tag.id,
        }))}
        defaultValue={spotTags.map((tag) => ({
          label: tag.name,
          value: tag.id,
        }))}
        onChange={(selectedTags) => {
          const newTags = selectedTags.map((tag) => {
            if (tag.value.toString() === tag.label) {
              return {
                id: -1,
                name: tag.value.toString(),
                userId: userData!.user.id,
              }
            } else {
              return {
                id: tag.value,
                name: tag.label,
                userId: userData!.user.id,
              }
            }
          })
          setTags(newTags)
        }}
        isMulti
      />
    </div>
  )
}
