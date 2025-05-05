import type { tag } from '@/lib/db/schema'
import { create } from 'zustand'

export type Tag = typeof tag.$inferSelect

interface FiltersState {
  tags: Tag[]
  setTags: (tags: Tag[]) => void
  selectedTags: Tag[]
  setSelectedTags: (tags: Tag[]) => void
  showVisited: boolean
  setShowVisited: (showVisited: boolean) => void
}
export const useFiltersStore = create<FiltersState>()(
  (set) => ({
    tags: [],
    setTags: (tags) => set(() => ({ tags })),
    selectedTags: [],
    setSelectedTags: (tags) =>
      set(() => ({ selectedTags: tags })),
    showVisited: true,
    setShowVisited: (showVisited) =>
      set(() => ({ showVisited })),
  }),
)
