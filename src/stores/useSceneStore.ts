import { create } from 'zustand'

interface SceneState {
  isSceneReady: boolean
  setSceneReady: (ready: boolean) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  isSceneReady: false,
  setSceneReady: (ready) => set({ isSceneReady: ready }),
}))
