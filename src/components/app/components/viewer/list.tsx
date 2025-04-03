import {
  useListsStore,
  type ListWithSpots,
} from '../../stores/lists'
import Spot from './spot'

interface ListProps {
  list: ListWithSpots
}
export default function List({ list }: ListProps) {
  const { currentList, selectList } = useListsStore()

  return (
    <div className="mx-auto w-lg max-w-full">
      <div
        className={`cursor-pointer rounded border p-4 hover:bg-blue-100 ${currentList?.id === list.id ? 'bg-blue-100' : ''}`}
        onClick={() => {
          selectList(
            currentList?.id === list.id ? null : list,
          )
        }}
      >
        <h2 className="text-xl font-bold">{list.name}</h2>
        <p>
          Visited:{' '}
          {list.spots?.reduce(
            (acc, spot) => acc + (spot.visited ? 1 : 0),
            0,
          )}
          /{list.spots?.length ?? 0}{' '}
        </p>
      </div>
      {currentList?.id === list.id &&
        (list.spots?.length > 0 ? (
          <div className="mx-4 mt-2 flex flex-col gap-1 overflow-y-auto">
            {list.spots
              .sort((a, b) => {
                // visited last, then alphabetical
                if (a.visited === b.visited) {
                  return a.name.localeCompare(b.name)
                }
                return a.visited ? 1 : -1
              })
              .map((spot) => (
                <Spot
                  spot={spot}
                  key={'spot-' + spot.id}
                />
              ))}
          </div>
        ) : (
          <div className="grid h-full w-full items-center">
            <p className="mx-auto w-fit text-xl">
              No spots found, add your first one now.
            </p>
          </div>
        ))}
    </div>
  )
}
