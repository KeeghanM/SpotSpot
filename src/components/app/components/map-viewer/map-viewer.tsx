import { Map, Marker } from '@vis.gl/react-google-maps'
import { useListsStore } from '../../stores/lists'
import { useEffect, useState } from 'react'
import { calculateCenter } from '@/lib/utils'

export default function MapViewer() {
  const { lists } = useListsStore()
  const [center, setCenter] = useState(
    calculateCenter(lists),
  )

  useEffect(() => {
    setCenter(calculateCenter(lists))
  }, [lists])

  return (
    <Map
      style={{ width: '100vw', height: '100vh' }}
      defaultCenter={center}
      defaultZoom={3}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
    >
      {lists.map((list) => {
        return list.spots.map((spot) => {
          if (!spot.location) return null
          return (
            <Marker
              key={spot.id}
              position={{
                lat: spot.location.lat,
                lng: spot.location.lng,
              }}
              title={spot.name}
            />
          )
        })
      })}
    </Map>
  )
}
