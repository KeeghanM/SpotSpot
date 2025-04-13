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
import {
  useFiltersStore,
  type Tag,
} from '../stores/filters'
import { authClient } from '@/lib/auth/client-react'

const fetchLists = async (): Promise<ListWithSpots[]> => {
  const response = await fetch('/api/lists')
  return response.json()
}
const fetchTags = async (): Promise<Tag[]> => {
  const response = await fetch('/api/tags')
  return response.json()
}
export function useListsQueries() {
  const { data: userData } = authClient.useSession()
  const queryClient = useQueryClient()
  const {
    addList,
    removeList,
    addSpot,
    updateSpot,
    removeSpot,
    updateList,
  } = useListsStore()

  // Fetch the data
  const listsQuery = useQuery({
    queryKey: ['lists'],
    queryFn: fetchLists,
  })
  const tagsQuery = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  })

  // Update Zustand store whenever queries fetch new data
  useEffect(() => {
    if (!listsQuery.data) return

    useListsStore.setState({ lists: listsQuery.data })
  }, [listsQuery.data])

  useEffect(() => {
    if (!tagsQuery.data) return

    useFiltersStore.setState({ tags: tagsQuery.data })
  }, [tagsQuery.data])

  // Mutations for adding/deleting etc etc
  const createListMutation = useMutation({
    mutationFn: async (newList: {
      name: string
      parentId: number | null
    }) => {
      // Add it "eagerly" before the re-fetch comes into effect
      addList({
        ...newList,
        id: -1,
        spots: [],
        userId: userData!.user.id,
      })

      await fetch('/api/lists', {
        method: 'POST',
        body: JSON.stringify({ newList }),
        headers: { 'Content-Type': 'application/json' },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] })
    },
  })

  const updateListMutation = useMutation({
    mutationFn: async (list: ListWithSpots) => {
      // Add it "eagerly" before the re-fetch comes into effect
      updateList(list)

      await fetch('/api/lists', {
        method: 'PUT',
        body: JSON.stringify({ listToUpdate: list }),
        headers: { 'Content-Type': 'application/json' },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] })
    },
  })

  const deleteListMutation = useMutation({
    mutationFn: async (id: number) => {
      // Remove it "eagerly" before the re-fetch comes into effect
      removeList(id)

      await fetch('/api/lists', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] })
    },
  })

  const createSpotMutation = useMutation({
    mutationFn: async (newSpot: Omit<Spot, 'id'>) => {
      // Add it "eagerly" before the re-fetch comes into effect
      addSpot(newSpot.listId, { id: -1, ...newSpot })
      await fetch(`/api/lists/${newSpot.listId}/spots`, {
        method: 'POST',
        body: JSON.stringify({ newSpot }),
        headers: { 'Content-Type': 'application/json' },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] })
    },
  })

  const updateSpotMutation = useMutation({
    mutationFn: async (spot: Spot) => {
      // Update it "eagerly" before the re-fetch comes into effect
      updateSpot(spot.listId, spot)
      await fetch(`/api/lists/${spot.listId}/spots`, {
        method: 'PUT',
        body: JSON.stringify({ spotToUpdate: spot }),
        headers: { 'Content-Type': 'application/json' },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })

  const deleteSpotMutation = useMutation({
    mutationFn: async (spot: Spot) => {
      // Remove it "eagerly" before the re-fetch comes into effect
      removeSpot(spot.listId, spot.id)
      await fetch(`/api/lists/${spot.listId}/spots`, {
        method: 'DELETE',
        body: JSON.stringify({ spotId: spot.id }),
        headers: { 'Content-Type': 'application/json' },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] })
    },
  })

  return {
    listsQuery,
    createListMutation,
    updateListMutation,
    deleteListMutation,
    createSpotMutation,
    updateSpotMutation,
    deleteSpotMutation,
  }
}
