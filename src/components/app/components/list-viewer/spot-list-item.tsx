import {
  IoCheckmarkDoneCircle,
  IoOpenOutline,
} from 'react-icons/io5'
import Rating from '../spot/rating'
import type { Spot } from '@/components/app/stores/lists'

interface SpotListItemProps {
  spot: Spot
}
export default function SpotListItem({
  spot,
}: SpotListItemProps) {
  return (
    <div
      className={`rounded border p-4 ${
        spot.visited ? 'bg-accent' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <p>{spot.name}</p>
        {spot.visited && <IoCheckmarkDoneCircle />}
      </div>
      {spot.rating && spot.rating > 0 ? (
        <Rating rating={spot.rating} />
      ) : null}
      {spot.location?.link && spot.location?.name && (
        <a
          href={spot.location.link}
          target="_blank"
          className="text-primary mt-4 block w-fit text-sm hover:underline"
        >
          {spot.location.name.length > 30
            ? spot.location.name.substring(0, 29) + '...'
            : spot.location.name}{' '}
          <IoOpenOutline className="inline h-4 w-4" />
        </a>
      )}
    </div>
  )
}
