import type { TListWithSpots } from '@/components/app/stores/app'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function calculateCenter(lists: TListWithSpots[]): {
  lat: number
  lng: number
} {
  // Default return if no valid coordinates exist
  if (lists.length === 0) return { lat: 0, lng: 0 }

  // Initialize variables for sum of Cartesian coordinates
  let x = 0
  let y = 0
  let z = 0
  let count = 0

  // Process all valid locations
  for (const list of lists) {
    for (const spot of list.spots) {
      if (spot.location?.lat && spot.location?.lng) {
        // Convert lat/lng to radians
        const latRad = (spot.location.lat * Math.PI) / 180
        const lngRad = (spot.location.lng * Math.PI) / 180

        // Convert to Cartesian coordinates (assuming unit sphere)
        x += Math.cos(latRad) * Math.cos(lngRad)
        y += Math.cos(latRad) * Math.sin(lngRad)
        z += Math.sin(latRad)

        count++
      }
    }
  }

  // If no valid locations were found, return default fallback
  if (count === 0) return { lat: 53.8008, lng: -1.5491 }

  // Calculate average point in Cartesian space
  x /= count
  y /= count
  z /= count

  // Convert back to lat/lng
  const lngRad = Math.atan2(y, x)
  const hyp = Math.sqrt(x * x + y * y)
  const latRad = Math.atan2(z, hyp)

  // Convert back to degrees
  return {
    lat: (latRad * 180) / Math.PI,
    lng: (lngRad * 180) / Math.PI,
  }
}
