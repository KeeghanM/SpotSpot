import { create } from 'zustand'

interface AppState {
  mode: 'list' | 'map'
  setMode: (mode: 'list' | 'map') => void
}
export const useAppStore = create<AppState>()((set) => ({
  mode: 'list',
  setMode: (mode) => set(() => ({ mode })),
}))
