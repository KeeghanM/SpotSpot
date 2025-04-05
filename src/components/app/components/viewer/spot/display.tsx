import {
  IoCheckmarkDoneCircle,
  IoOpenOutline,
} from 'react-icons/io5'
import Rating from './rating'
import type { Spot } from '@/components/app/stores/lists'

interface DisplayProps {
  spot: Spot
  open: () => void
}
export default function Display({
  spot,
  open,
}: DisplayProps) {
  return (
    <div
      className={`cursor-pointer rounded border p-4 ${
        spot.visited ? 'bg-accent' : ''
      }`}
      onClick={open}
    >
      <div className="flex items-center gap-2">
        <p>{spot.name}</p>
        {spot.visited && <IoCheckmarkDoneCircle />}
      </div>
      {spot.rating && spot.rating > 0 ? (
        <Rating rating={spot.rating} />
      ) : null}
      {spot.locationLink && (
        <a
          href={spot.locationLink}
          target="_blank"
          className="text-primary mt-4 text-sm hover:underline"
        >
          {spot.locationName!.length > 30
            ? spot.locationName!.substring(0, 29) + '...'
            : spot.locationName}{' '}
          <IoOpenOutline className="inline h-4 w-4" />
        </a>
      )}
    </div>
  )
}
