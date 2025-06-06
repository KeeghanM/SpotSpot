import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { usePostHog } from 'posthog-js/react'

import type { TTag } from '../stores/filters'
import type { TListWithSpots, TSpot } from '../stores/app'

const fetchLists = async (): Promise<TListWithSpots[]> => {
  const response = await fetch('/api/lists')
  return response.json()
}
const fetchTags = async (): Promise<TTag[]> => {
  const response = await fetch('/api/tags')
  return response.json()
}
export function useListsQueries() {
  const posthog = usePostHog()
  const queryClient = useQueryClient()

  // Fetch the data
  const listsQuery = useQuery({
    queryKey: ['lists'],
    queryFn: fetchLists,
  })
  const tagsQuery = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  })

  // Mutations for adding/deleting etc etc
  const createListMutation = useMutation({
    mutationFn: async (newList: {
      name: string
      parentId: number | null
    }) => {
      await fetch('/api/lists', {
        method: 'POST',
        body: JSON.stringify({ newList }),
        headers: { 'Content-Type': 'application/json' },
      })

      posthog?.capture('list_created', {
        name: newList.name,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] })
    },
  })

  const updateListMutation = useMutation({
    mutationFn: async (list: TListWithSpots) => {
      await fetch('/api/lists', {
        method: 'PUT',
        body: JSON.stringify({ listToUpdate: list }),
        headers: { 'Content-Type': 'application/json' },
      })

      posthog?.capture('list_updated', {
        id: list.id,
        name: list.name,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] })
    },
  })

  const deleteListMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch('/api/lists', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
      })

      posthog?.capture('list_deleted', { id })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })

  const createSpotMutation = useMutation({
    mutationFn: async (newSpot: Omit<TSpot, 'id'>) => {
      await fetch(`/api/lists/${newSpot.listId}/spots`, {
        method: 'POST',
        body: JSON.stringify({ newSpot }),
        headers: { 'Content-Type': 'application/json' },
      })
      posthog?.capture('spot_created', {
        listId: newSpot.listId,
        spot: newSpot,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] })
    },
  })

  const updateSpotMutation = useMutation({
    mutationFn: async (spot: TSpot) => {
      await fetch(`/api/lists/${spot.listId}/spots`, {
        method: 'PUT',
        body: JSON.stringify({ spotToUpdate: spot }),
        headers: { 'Content-Type': 'application/json' },
      })
      posthog?.capture('spot_updated', {
        listId: spot.listId,
        spot,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })

  const deleteSpotMutation = useMutation({
    mutationFn: async (spot: TSpot) => {
      await fetch(`/api/lists/${spot.listId}/spots`, {
        method: 'DELETE',
        body: JSON.stringify({ spotId: spot.id }),
        headers: { 'Content-Type': 'application/json' },
      })
      posthog?.capture('spot_deleted', {
        spotId: spot.id,
        listId: spot.listId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })

  return {
    listsQuery,
    tagsQuery,
    createListMutation,
    updateListMutation,
    deleteListMutation,
    createSpotMutation,
    updateSpotMutation,
    deleteSpotMutation,
  }
}
