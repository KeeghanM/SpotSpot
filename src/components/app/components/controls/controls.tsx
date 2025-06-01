import { Skeleton } from '@/components/ui/skeleton'
import { useListsQueries } from '../../hooks/useListsQueries'
import NewList from './new-list'
import NewSpot from './new-spot'

export default function Controls() {
  const { listsQuery } = useListsQueries()
  return (
    <div className="border-b border-pink-100 bg-gradient-to-r from-pink-50 via-white to-pink-50 p-4">
      <div className="mx-auto flex max-w-2xl items-center justify-center gap-4">
        {listsQuery.isPending ? (
          <>
            <Skeleton className="h-11 w-1/2 rounded-xl bg-pink-100" />
            <Skeleton className="h-11 w-1/2 rounded-xl bg-pink-100" />
          </>
        ) : (
          <>
            <NewList />
            <NewSpot />
          </>
        )}
      </div>
    </div>
  )
}
