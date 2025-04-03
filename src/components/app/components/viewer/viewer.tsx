import { useListsStore } from '../../stores/lists'

export default function Viewer() {
  const { lists, currentList, selectList } = useListsStore()

  return (
    <div className="mx-auto w-full max-w-[calc(100vw-2rem)] flex-1">
      <div className="flex w-full flex-col gap-2 overflow-y-auto">
        {lists.map((list) => (
          <div
            key={list.id}
            className={`m-2 cursor-pointer rounded border p-4 ${currentList?.id === list.id ? 'bg-blue-100' : ''}`}
            onClick={() => selectList(list)}
          >
            <p>{list.name}</p>
          </div>
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
