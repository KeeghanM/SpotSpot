import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ListWithSpots, type Spot, useListsStore } from '../stores/lists'
import { useEffect } from 'react'
import { type Tag, useFiltersStore } from '../stores/filters'

// In a real app, you would replace these with your actual API base URL
const API_BASE_URL = 'https://api.example.com'

// Mock auth user for demo purposes
// In a real app, you would use a proper authentication solution
const mockUser = {
  id: '1',
  name: 'User',
}

const fetchLists = async (): Promise<ListWithSpots[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/lists`)
    return response.json()
  } catch (error) {
    console.error('Error fetching lists:', error)
    return [] // Return empty array as fallback
  }
}

const fetchTags = async (): Promise<Tag[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tags`)
    return response.json()
  } catch (error) {
    console.error('Error fetching tags:', error)
    return [] // Return empty array as fallback
  }
}

export function useListsQueries() {
  // In a real app, you would use your authentication solution
  const userData = { user: mockUser }

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
        userId: userData.user.id,
        description: null,
      } as ListWithSpots)

      await fetch(`${API_BASE_URL}/api/lists`, {
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

      await fetch(`${API_BASE_URL}/api/lists`, {
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

      await fetch(`${API_BASE_URL}/api/lists`, {
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
      await fetch(`${API_BASE_URL}/api/lists/${newSpot.listId}/spots`, {
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
      await fetch(`${API_BASE_URL}/api/lists/${spot.listId}/spots`, {
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
      await fetch(`${API_BASE_URL}/api/lists/${spot.listId}/spots`, {
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