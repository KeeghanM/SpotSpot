import { useListsStore } from '../../stores/lists'
import List from './list'

export default function Viewer() {
  const { lists } = useListsStore()

  return (
    <div className="mx-auto w-full max-w-[calc(100vw-2rem)] flex-1">
      <div className="mt-4 flex w-full flex-col gap-2 overflow-y-auto">
        {lists.map((list) => (
          <List
            list={list}
            key={'list-' + list.id}
          />
        ))}
        {lists.length === 0 && (
          <div className="grid h-full w-full items-center">
            <p className="mx-auto w-fit">
              No lists found. Create your first list!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
