import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import LocationInput from './location-input'
import { IoOpenOutline } from 'react-icons/io5'
import Rating from './rating'
import { Textarea } from '@/components/ui/textarea'
import Tags from './tags'
import type { TTag } from '@/components/app/stores/filters'
import type { TLocation } from '../../stores/app'

interface IEditorProps {
  name: string
  location: TLocation | null
  visited: boolean
  rating: number
  notes: string
  tags: TTag[]
  setName: (name: string) => void
  setLocation: (location: TLocation) => void
  setVisited: (visited: boolean) => void
  setRating: (rating: number) => void
  setNotes: (notes: string) => void
  setTags: (tags: TTag[]) => void
}
export default function Editor({
  name,
  location,
  visited,
  rating,
  notes,
  tags: spotTags,
  setName,
  setLocation,
  setVisited,
  setRating,
  setNotes,
  setTags,
}: IEditorProps) {
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
          <LocationInput
            location={
              location ?? {
                name: '',
                address: '',
                link: '',
                lat: 0,
                lng: 0,
              }
            }
            setLocation={setLocation}
          />
          {location?.name && location?.link && (
            <a
              href={location.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary mt-4 text-sm hover:underline"
            >
              {location.name.length > 30
                ? location.name.substring(0, 29) + '...'
                : location.name}{' '}
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
      <Tags {...{ spotTags, setTags }} />
    </div>
  )
}
