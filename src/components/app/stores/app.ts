import { create } from 'zustand'
import { list } from '@/lib/db/schema'
import type { Tag } from './filters'
export type List = typeof list.$inferSelect
export type Location = {
  name: string
  address: string
  link: string
  lat: number
  lng: number
}
export type Spot = {
  id: number
  name: string
  visited: boolean
  rating: number | null
  notes: string | null
  tags: Tag[]
  location: Location | null
  listId: number
}
export type ListWithSpots = List & { spots: Spot[] }

interface AppState {
  mode: 'list' | 'map'
  setMode: (mode: 'list' | 'map') => void
  currentList: List | null
  setCurrentList: (list: List | null) => void
}
export const useAppStore = create<AppState>()((set) => ({
  mode: 'list',
  setMode: (mode) => set(() => ({ mode })),
  currentList: null,
  setCurrentList: (list) =>
    set(() => ({ currentList: list })),
}))
