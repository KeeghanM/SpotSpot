import type { Spot } from '@/components/app/stores/lists'
import {
  IoCheckmarkDoneCircle,
  IoOpenOutline,
} from 'react-icons/io5'
import Rating from '../spot/rating'

interface SpotListItemProps {
  spot: Spot
}
export default function SpotListItem({
  spot,
}: SpotListItemProps) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl border-2 px-4 py-2 ${
        spot.visited
          ? 'border-pink-200 bg-gradient-to-r from-orange-200 to-pink-200'
          : 'border-pink-100 bg-white hover:border-pink-200'
      }`}
    >
      <div className="flex items-center gap-2">
        <p className="font-medium text-pink-800">
          {spot.name}
        </p>
        {spot.visited && (
          <IoCheckmarkDoneCircle className="text-xl text-purple-500" />
        )}
      </div>
      {spot.rating && spot.rating > 0 ? (
        <div>
          <Rating rating={spot.rating} />
        </div>
      ) : null}
      {spot.location?.link && spot.location?.name && (
        <a
          href={spot.location.link}
          target="_blank"
          className="block w-fit text-sm font-medium text-purple-600 transition-colors duration-200 hover:text-purple-700 hover:underline"
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
