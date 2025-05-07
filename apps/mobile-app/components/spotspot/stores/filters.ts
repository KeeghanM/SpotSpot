// Define the Tag type directly since we don't have access to the db schema
export interface Tag {
  id: string
  name: string
  // Add other properties as needed
}

import { create } from 'zustand'

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