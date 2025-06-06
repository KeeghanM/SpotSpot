import { create } from 'zustand'
import type { TTag } from './filters'

export type TList = {
  id: number
  name: string
  parentId: number | null
  createdAt: Date
  updatedAt: Date
}

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

export type TMode = 'list' | 'map'

export interface IAppState {
  mode: TMode
  setMode: (mode: TMode) => void
  currentList: TList | null
  setCurrentList: (list: TList | null) => void
}

export const useAppStore = create<IAppState>((set) => ({
  mode: 'list',
  setMode: (mode) => set(() => ({ mode })),
  currentList: null,
  setCurrentList: (list) =>
    set(() => ({ currentList: list })),
}))
