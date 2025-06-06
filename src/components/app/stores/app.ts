import { create } from 'zustand'
import { list } from '@/lib/db/schema'
import type { TTag } from './filters'
export type TList = typeof list.$inferSelect
export type TLocation = {
  name: string
  address: string
  link: string
  lat: number
  lng: number
}
export type TSpot = {
  id: number
  name: string
  visited: boolean
  rating: number | null
  notes: string | null
  tags: TTag[]
  location: TLocation | null
  listId: number
}
export type TListWithSpots = TList & { spots: TSpot[] }

interface IAppState {
  mode: 'list' | 'map'
  setMode: (mode: 'list' | 'map') => void
  currentList: TList | null
  setCurrentList: (list: TList | null) => void
}
export const useAppStore = create<IAppState>()((set) => ({
  mode: 'list',
  setMode: (mode) => set(() => ({ mode })),
  currentList: null,
  setCurrentList: (list) =>
    set(() => ({ currentList: list })),
}))
