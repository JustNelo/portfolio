import { create } from 'zustand'

interface SceneState {
  isSceneReady: boolean
  hasInitialized: boolean // True after first load - prevents loader on navigation
  isContextLost: boolean
  setSceneReady: (ready: boolean) => void
  setHasInitialized: (initialized: boolean) => void
  setContextLost: (lost: boolean) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  isSceneReady: false,
  hasInitialized: false,
  isContextLost: false,
  setSceneReady: (ready) => set({ isSceneReady: ready }),
  setHasInitialized: (initialized) => set({ hasInitialized: initialized }),
  setContextLost: (lost) => set({ isContextLost: lost }),
}))
