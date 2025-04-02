import { useListsStore } from '../../stores/lists'

export default function Viewer() {
  const { lists, currentList, selectList } = useListsStore()

  return (
    <div className="flex flex-1 flex-col gap-2">
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
        <div>No lists found. Create your first list!</div>
      )}
    </div>
  )
}
