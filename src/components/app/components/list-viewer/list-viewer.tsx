import { Skeleton } from '@/components/ui/skeleton'
import { useListsQueries } from '../../hooks/useListsQueries'
import List from './list'

export default function ListViewer() {
  const { listsQuery } = useListsQueries()

  return (
    <div className="mx-auto max-h-screen w-full max-w-full flex-1 overflow-y-auto">
      <div className="flex w-full flex-col gap-2 p-4">
        {listsQuery.isPending ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="mx-auto h-[85px] w-lg max-w-full"
            />
          ))
        ) : (
          <>
            {listsQuery.data?.map((list) => (
              <List
                list={list}
                key={'list-' + list.id}
              />
            ))}
            {listsQuery.data?.length === 0 && (
              <div className="grid h-full w-full items-center">
                <p className="mx-auto w-fit">
                  No lists found. Create your first list!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
