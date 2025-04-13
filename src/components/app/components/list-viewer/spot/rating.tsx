import { useState } from 'react'
import { IoStar, IoStarOutline } from 'react-icons/io5'

interface RatingProps {
  rating: number
  editable?: boolean
  setRating?: (rating: number) => void
}
export default function Rating({
  editable = false,
  rating,
  setRating = () => {},
}: RatingProps) {
  const [tempRating, setTempRating] = useState(rating)

  if (!editable)
    return (
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={'star-' + star}
            className="text-foreground"
          >
            {rating && rating >= star ? (
              <IoStar className="h-4 w-4" />
            ) : (
              <IoStarOutline className="h-4 w-4" />
            )}
          </div>
        ))}
      </div>
    )

  return (
    <div
      className="flex items-center gap-2"
      onMouseLeave={() => setTempRating(rating)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={'star-' + star}
          onMouseOver={() => setTempRating(star)}
          onClick={() => {
            rating === star ? setRating(0) : setRating(star)
          }}
          className="text-primary cursor-pointer transition-colors"
        >
          {tempRating >= star ? (
            <IoStar className="h-6 w-6" />
          ) : (
            <IoStarOutline className="h-6 w-6" />
          )}
        </div>
      ))}
    </div>
  )
}
