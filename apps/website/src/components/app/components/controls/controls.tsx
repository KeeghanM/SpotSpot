import { Skeleton } from '@/components/ui/skeleton'
import { useListsQueries } from '../../hooks/useListsQueries'
import NewList from './new-list'
import NewSpot from './new-spot'

export default function Controls() {
  const { listsQuery } = useListsQueries()
  return (
    <div className="bg-slate-800 p-4">
      <div className="mx-auto flex max-w-2xl items-center justify-center gap-2">
        {listsQuery.isPending ? (
          <>
            <Skeleton className="h-9 w-1/2" />
            <Skeleton className="h-9 w-1/2" />
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
