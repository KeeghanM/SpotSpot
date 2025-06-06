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
  const [center, setCenter] = useState(
    calculateCenter(listsQuery.data ?? []),
  )

  useEffect(() => {
    if (!listsQuery.data)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setCenter(currentLocation)
        },
        () => {
          setCenter(calculateCenter(listsQuery.data ?? []))
        },
      )
  }, [listsQuery.data])

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
