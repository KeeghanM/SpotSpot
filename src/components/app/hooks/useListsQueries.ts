import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useListsStore } from '../stores/lists'
import { list, spot } from '@/lib/db/schema'
import { useEffect } from 'react'

type List = typeof list.$inferSelect
type Spot = typeof spot.$inferSelect

const fetchLists = async (): Promise<List[]> => {
  const response = await fetch('/api/lists')
  return response.json()
}

const fetchSpots = async (): Promise<Spot[]> => {
  const response = await fetch('/api/spots')
  return response.json()
}

export function useListsQueries() {
  const queryClient = useQueryClient()
  const { addList, removeList } = useListsStore()

  // Fetch the data
  const listsQuery = useQuery({
    queryKey: ['lists'],
    queryFn: fetchLists,
  })

  const spotsQuery = useQuery({
    queryKey: ['spots'],
    queryFn: fetchSpots,
  })

  // Update Zustand store whenever queries fetch new data
  useEffect(() => {
    if (!listsQuery.data) return

    useListsStore.setState({ lists: listsQuery.data })
  }, [listsQuery.data])

  useEffect(() => {
    if (!spotsQuery.data) return

    useListsStore.setState({ spots: spotsQuery.data })
  }, [spotsQuery.data])

  // Mutations for adding/deleting etc etc
  const createListMutation = useMutation({
    mutationFn: async (newList: {
      name: string
      parentId: number | null
    }) => {
      const response = await fetch('/api/lists', {
        method: 'POST',
        body: JSON.stringify(newList),
        headers: { 'Content-Type': 'application/json' },
      })
      return response.json() as Promise<List>
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
      return response.json() as Promise<List>
    },
    onSuccess: (list) => {
      // Remove it "eagerly" before the re-fetch comes into effect
      removeList(list)
      queryClient.invalidateQueries({ queryKey: ['lists'] })
    },
  })

  return {
    listsQuery,
    spotsQuery,
    createListMutation,
    deleteListMutation,
  }
}
