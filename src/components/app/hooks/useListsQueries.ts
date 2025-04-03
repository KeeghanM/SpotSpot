import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  useListsStore,
  type ListWithSpots,
  type Spot,
} from '../stores/lists'
import { useEffect } from 'react'

const fetchLists = async (): Promise<ListWithSpots[]> => {
  const response = await fetch('/api/lists')
  return response.json()
}
export function useListsQueries() {
  const queryClient = useQueryClient()
  const { addList, removeList, addSpot, updateSpot } =
    useListsStore()

  // Fetch the data
  const listsQuery = useQuery({
    queryKey: ['lists'],
    queryFn: fetchLists,
  })

  // Update Zustand store whenever queries fetch new data
  useEffect(() => {
    if (!listsQuery.data) return

    useListsStore.setState({ lists: listsQuery.data })
  }, [listsQuery.data])

  // Mutations for adding/deleting etc etc
  const createListMutation = useMutation({
    mutationFn: async (newList: {
      name: string
      parentId: number | null
    }) => {
      const response = await fetch('/api/lists', {
        method: 'POST',
        body: JSON.stringify({ newList }),
        headers: { 'Content-Type': 'application/json' },
      })
      return response.json() as Promise<ListWithSpots>
    },
    onSuccess: (newList) => {
      // Add it "eagerly" before the re-fetch comes into effect
      addList(newList)
      queryClient.invalidateQueries({ queryKey: ['lists'] })
    },
  })
  const deleteListMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch('/api/lists', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
      })
      return id
    },
    onSuccess: (id) => {
      // Remove it "eagerly" before the re-fetch comes into effect
      removeList(id)
      queryClient.invalidateQueries({ queryKey: ['lists'] })
    },
  })

  const createSpotMutation = useMutation({
    mutationFn: async (newSpot: Omit<Spot, 'id'>) => {
      const response = await fetch(
        `/api/lists/${newSpot.listId}/spots`,
        {
          method: 'POST',
          body: JSON.stringify({ newSpot }),
          headers: { 'Content-Type': 'application/json' },
        },
      )
      const spot = (await response.json()) as Spot
      return { listId: newSpot.listId, spot }
    },
    onSuccess: ({ listId, spot }) => {
      // Add it "eagerly" before the re-fetch comes into effect
      addSpot(listId, spot)
      queryClient.invalidateQueries({ queryKey: ['spots'] })
    },
  })

  const updateSpotMutation = useMutation({
    mutationFn: async (spot: Spot) => {
      const response = await fetch(
        `/api/lists/${spot.listId}/spots`,
        {
          method: 'PUT',
          body: JSON.stringify({ spotToUpdate: spot }),
          headers: { 'Content-Type': 'application/json' },
        },
      )
      return response.json() as Promise<Spot>
    },
    onSuccess: (spot) => {
      // Add it "eagerly" before the re-fetch comes into effect
      updateSpot(spot.listId, spot)
      queryClient.invalidateQueries({ queryKey: ['spots'] })
    },
  })

  return {
    listsQuery,
    createListMutation,
    deleteListMutation,
    createSpotMutation,
    updateSpotMutation,
  }
}
