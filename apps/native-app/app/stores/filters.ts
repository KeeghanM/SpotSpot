import { create } from 'zustand'

export type TTag = { id: number; name: string }

interface IFiltersState {
  tags: TTag[]
  setTags: (tags: TTag[]) => void
  selectedTags: TTag[]
  setSelectedTags: (tags: TTag[]) => void
  showVisited: boolean
  setShowVisited: (showVisited: boolean) => void
}

export const useFiltersStore = create<IFiltersState>(
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
