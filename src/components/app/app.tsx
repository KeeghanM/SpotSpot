import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Header from './components/header'
import Viewer from './components/viewer'
import Controls from './components/controls'
import { APIProvider } from '@vis.gl/react-google-maps'
import Filters from './components/filters'

const queryClient = new QueryClient()

export default function SpotSpot() {
  return (
    <APIProvider
      apiKey={import.meta.env.PUBLIC_GOOGLE_PLACES_API_KEY}
    >
      <QueryClientProvider client={queryClient}>
        <div className="flex h-screen flex-col">
          <Header />
          <Controls />
          <Filters />
          <Viewer />
        </div>
      </QueryClientProvider>
    </APIProvider>
  )
}
