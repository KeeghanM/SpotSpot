import {
  AdvancedMarker,
  Map,
  Pin,
} from '@vis.gl/react-google-maps'
import { useEffect, useState } from 'react'
import { calculateCenter } from '@/lib/utils'
import { useFiltersStore } from '../../stores/filters'
import Spot from '../spot'
import { useAppStore } from '../../stores/app'
import { useListsQueries } from '../../hooks/useListsQueries'

export default function MapViewer() {
  const { currentList } = useAppStore()
  const { showVisited, selectedTags } = useFiltersStore()
  const { listsQuery } = useListsQueries()
  const [center, setCenter] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [isCalculatingCenter, setIsCalculatingCenter] =
    useState(true)

  useEffect(() => {
    const calculateMapCenter = async () => {
      setIsCalculatingCenter(true)

      try {
        const userLocation = await getUserLocation()
        if (userLocation) {
          setCenter(userLocation)
          setIsCalculatingCenter(false)
          return
        }
      } catch (error) {
        console.log('Could not get user location:', error)
      }

      if (listsQuery.data && listsQuery.data.length > 0) {
        const calculatedCenter = calculateCenter(
          listsQuery.data,
        )
        setCenter(calculatedCenter)
      } else {
        setCenter({ lat: 53.8008, lng: -1.5491 })
      }

      setIsCalculatingCenter(false)
    }

    calculateMapCenter()
  }, [listsQuery.data])

  const getUserLocation = (): Promise<{
    lat: number
    lng: number
  }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          reject(error)
        },
        { timeout: 5000, enableHighAccuracy: false },
      )
    })
  }

  if (isCalculatingCenter || !center) {
    return (
      <div className="flex h-full w-full animate-pulse items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }

  return (
    <Map
      mapId={'8e9dc7a8b7860f1e'}
      style={{ width: '100vw', height: '100vh' }}
      defaultCenter={center}
      defaultZoom={10}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
      reuseMaps={true}
      colorScheme="FOLLOW_SYSTEM"
      renderingType="RASTER"
    >
      {listsQuery.data
        ?.filter((list) =>
          currentList ? list.id === currentList.id : true,
        )
        .map((list) => {
          return list.spots
            .filter(
              (spot) =>
                spot.location?.lat && spot.location.lng,
            )
            .filter((spot) => showVisited || !spot.visited)
            .filter((spot) => {
              if (selectedTags.length === 0) return true
              return spot.tags.some((tag) =>
                selectedTags.some(
                  (selectedTag) =>
                    selectedTag.id === tag.id,
                ),
              )
            })
            .map((spot) => {
              return (
                <Spot
                  key={spot.id}
                  spot={spot}
                >
                  <AdvancedMarker
                    position={{
                      lat: spot.location!.lat,
                      lng: spot.location!.lng,
                    }}
                    clickable={true}
                    title={spot.name}
                  >
                    <Pin
                      background={
                        spot.visited
                          ? 'var(--accent)'
                          : 'var(--primary)'
                      }
                      borderColor={'#000'}
                      glyphColor={'#000'}
                    />
                    <div className="z-[9999]">
                      {spot.name.length > 30
                        ? spot.name.substring(0, 29) + '...'
                        : spot.name}
                    </div>
                  </AdvancedMarker>
                </Spot>
              )
            })
        })}
    </Map>
  )
}
