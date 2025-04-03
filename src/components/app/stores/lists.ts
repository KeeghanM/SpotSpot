import { create } from 'zustand'
import { list, spot } from '@/lib/db/schema'
export type List = typeof list.$inferSelect
export type Spot = typeof spot.$inferSelect
export type ListWithSpots = List & { spots: Spot[] }

interface ListsState {
  lists: ListWithSpots[]
  currentList: ListWithSpots | null
  currentSpot: Spot | null
  selectList: (list: ListWithSpots | null) => void
  selectSpot: (spot: Spot) => void
  deselectList: () => void
  deselectSpot: () => void
  addList: (list: ListWithSpots) => void
  addSpot: (listId: number, spot: Spot) => void
  removeList: (listId: number) => void
  removeSpot: (listId: number, spotId: number) => void
  updateList: (list: List) => void
  updateSpot: (listId: number, spot: Spot) => void
}
export const useListsStore = create<ListsState>()(
  (set) => ({
    lists: [],
    currentList: null,
    currentSpot: null,
    selectList: (list) =>
      set(() => ({ currentList: list })),
    selectSpot: (spot) =>
      set(() => ({ currentSpot: spot })),
    deselectList: () => set(() => ({ currentList: null })),
    deselectSpot: () => set(() => ({ currentSpot: null })),
    addList: (list) =>
      set((state) => ({ lists: [...state.lists, list] })),
    addSpot: (listId, spot) =>
      set((state) => {
        const lists = state.lists.map((l) => {
          if (l.id === listId) {
            return { ...l, spots: [...l.spots, spot] }
          }
          return l
        })
        return { lists }
      }),
    removeList: (listId) =>
      set((state) => {
        const lists = state.lists.filter(
          (l) => l.id !== listId,
        )
        return { lists }
      }),
    removeSpot: (listId, spotId) =>
      set((state) => {
        const lists = state.lists.map((l) => {
          if (l.id === listId) {
            return {
              ...l,
              spots: l.spots.filter((s) => s.id !== spotId),
            }
          }
          return l
        })
        return { lists }
      }),
    updateList: (list) =>
      set((state) => {
        const lists = state.lists.map((l) => {
          if (l.id === list.id) {
            return { ...l, ...list }
          }
          return l
        })
        return { lists }
      }),
    updateSpot: (listId, spot) =>
      set((state) => {
        const lists = state.lists.map((l) => {
          if (l.id === listId) {
            return {
              ...l,
              spots: l.spots.map((s) => {
                if (s.id === spot.id) {
                  return { ...s, ...spot }
                }
                return s
              }),
            }
          }
          return l
        })
        return { lists }
      }),
  }),
)
