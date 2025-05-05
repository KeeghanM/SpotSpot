import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Header from './components/header'
import ListViewer from './components/list-viewer'
import Controls from './components/controls'
import { APIProvider } from '@vis.gl/react-google-maps'
import Filters from './components/filters'
import {
  MapViewer,
  MapViewToggle,
} from './components/map-viewer'
import { useAppStore } from './stores/app'

const queryClient = new QueryClient()

export default function SpotSpot() {
  const { mode } = useAppStore()
  return (
    <APIProvider
      apiKey={import.meta.env.PUBLIC_GOOGLE_PLACES_API_KEY}
    >
      <QueryClientProvider client={queryClient}>
        <div className="flex h-screen flex-col">
          <Header />
          <Controls />
          <Filters />
          {mode === 'list' ? <ListViewer /> : <MapViewer />}
        </div>
        <MapViewToggle />
      </QueryClientProvider>
    </APIProvider>
  )
}
