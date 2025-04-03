import { useListsStore } from '../../stores/lists'
import List from './list'

export default function Viewer() {
  const { lists } = useListsStore()

  return (
    <div className="mx-auto max-h-screen w-full max-w-full flex-1 overflow-y-auto">
      <div className="flex w-full flex-col gap-2 p-4">
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
