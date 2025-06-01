import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { APIProvider } from '@vis.gl/react-google-maps'
import { PostHogProvider } from 'posthog-js/react'
import Controls from './components/controls'
import FiltersDrawer from './components/filters/filters-drawer'
import Header from './components/header'
import ListViewer from './components/list-viewer'
import {
  MapViewer,
  MapViewToggle,
} from './components/map-viewer'
import { useAppStore } from './stores/app'

const queryClient = new QueryClient()

export default function SpotSpot() {
  const { mode } = useAppStore()
  return (
    <PostHogProvider
      apiKey={import.meta.env.PUBLIC_POSTHOG_KEY!}
      options={{
        capture_exceptions: true,
        debug: process.env.NODE_ENV === 'development',
      }}
    >
      <APIProvider
        apiKey={
          import.meta.env.PUBLIC_GOOGLE_PLACES_API_KEY
        }
      >
        <QueryClientProvider client={queryClient}>
          <div className="flex h-screen flex-col">
            <Header />
            <Controls />
            {mode === 'list' ? (
              <ListViewer />
            ) : (
              <MapViewer />
            )}
            <FiltersDrawer />
          </div>
          <MapViewToggle />
        </QueryClientProvider>
      </APIProvider>
    </PostHogProvider>
  )
}
