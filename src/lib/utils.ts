import type { ListWithSpots } from '@/components/app/stores/lists'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateCenter(lists: ListWithSpots[]): {
  lat: number
  lng: number
} {
  return { lat: 0, lng: 0 }
  if (lists.length === 0) return { lat: 0, lng: 0 }
  let length = 0
  const newCenter = { lat: 0, lng: 0 }
  lists.map((list) => {
    list.spots.map((spot) => {
      if (spot.location) {
        newCenter.lat += spot.location.lat
        newCenter.lng += spot.location.lng
        length++
      }
    })
  })

  newCenter.lat /= length
  newCenter.lng /= length
  return newCenter
}
