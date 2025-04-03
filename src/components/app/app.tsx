import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useListsQueries } from './hooks/useListsQueries'
import Header from './components/header'
import Viewer from './components/viewer'
import Controls from './components/controls'

const queryClient = new QueryClient()

function AppContent() {
  const { listsQuery } = useListsQueries()

  if (listsQuery.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <Controls />
      <Viewer />
    </div>
  )
}

export default function SpotSpot() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}
