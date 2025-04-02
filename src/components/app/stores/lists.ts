import { create } from 'zustand'
import { list, spot } from '@/lib/db/schema'
type List = typeof list.$inferSelect
type Spot = typeof spot.$inferSelect

interface ListsState {
  lists: List[]
  spots: Spot[]
  currentList: List | null
  currentSpot: Spot | null
  selectList: (list: List) => void
  selectSpot: (spot: Spot) => void
  deselectList: () => void
  deselectSpot: () => void
  addList: (list: List) => void
  addSpot: (spot: Spot) => void
  removeList: (list: List) => void
  removeSpot: (spot: Spot) => void
}
export const useListsStore = create<ListsState>()(
  (set) => ({
    lists: [],
    currentList: null,
    spots: [],
    currentSpot: null,
    selectList: (list) =>
      set(() => ({ currentList: list })),
    selectSpot: (spot) =>
      set(() => ({ currentSpot: spot })),
    deselectList: () => set(() => ({ currentList: null })),
    deselectSpot: () => set(() => ({ currentSpot: null })),
    addList: (list) =>
      set((state) => ({ lists: [...state.lists, list] })),
    addSpot: (spot) =>
      set((state) => ({ spots: [...state.spots, spot] })),
    removeList: (list) =>
      set((state) => ({
        lists: state.lists.filter((l) => l.id !== list.id),
      })),
    removeSpot: (spot) =>
      set((state) => ({
        spots: state.spots.filter((s) => s.id !== spot.id),
        currentSpot:
          state.currentSpot?.id === spot.id
            ? null
            : state.currentSpot,
      })),
  }),
)
