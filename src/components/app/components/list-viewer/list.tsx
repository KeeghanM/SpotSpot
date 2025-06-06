import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useListsQueries } from '../../hooks/useListsQueries'
import { useFiltersStore } from '../../stores/filters'
import Spot from '../spot'
import SpotListItem from './spot-list-item'
import {
  useAppStore,
  type TListWithSpots,
} from '../../stores/app'

interface IListProps {
  list: TListWithSpots
}
export default function List({ list }: IListProps) {
  const { currentList, setCurrentList } = useAppStore()
  const { selectedTags, showVisited } = useFiltersStore()
  const { deleteListMutation } = useListsQueries()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDeleteSpot = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirmDelete) {
      deleteListMutation.mutate(list.id)
      setConfirmDelete(false)
    } else {
      setConfirmDelete(true)
    }
  }

  return (
    <div className="mx-auto w-lg max-w-full">
      <div
        className={`flex cursor-pointer justify-between rounded-2xl border p-4 hover:bg-orange-100 ${currentList?.id === list.id ? 'bg-orange-100' : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => {
          setConfirmDelete(false)
          setCurrentList(
            currentList?.id === list.id ? null : list,
          )
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setConfirmDelete(false)
            setCurrentList(
              currentList?.id === list.id ? null : list,
            )
          }
        }}
      >
        <div className="">
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
        <div className="">
          <Button
            variant="destructive"
            disabled={deleteListMutation.isPending}
            onClick={handleDeleteSpot}
          >
            {confirmDelete ? 'Are you sure?' : 'Delete'}
          </Button>
        </div>
      </div>
      {currentList?.id === list.id &&
        (list.spots?.length > 0 ? (
          <div className="mx-4 mt-2 flex flex-col gap-1 overflow-y-auto">
            {list.spots
              .filter((spot) => {
                if (selectedTags.length === 0) return true
                return spot.tags?.some((tag) =>
                  selectedTags.some(
                    (selectedTag) =>
                      tag.id === selectedTag.id,
                  ),
                )
              })
              .filter((spot) => {
                if (showVisited) return true
                return !spot.visited
              })
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
                >
                  <SpotListItem spot={spot} />
                </Spot>
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
