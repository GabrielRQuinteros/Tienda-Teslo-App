import { create } from 'zustand'

interface State {
  isSideMenuOpen: boolean
}

interface Actions {
  openSideMenu: () => void,
  closeSideMenu: () => void
}

type UIStore = State & Actions;

export const useUIStore = create<UIStore>( (set) => ({
  isSideMenuOpen:   false,
  openSideMenu:     () =>  set((state) => ({ isSideMenuOpen: true})),
  closeSideMenu:    () =>  set((state) => ({ isSideMenuOpen: false})),
}))
