'use client'

import { create } from 'zustand'

// Module-level flag - survives soft navigations, reset on hard reload
let hasCompletedFirstLoad = false

export const getHasCompletedFirstLoad = () => hasCompletedFirstLoad
export const setHasCompletedFirstLoad = (value: boolean) => {
  hasCompletedFirstLoad = value
}

interface SceneState {
  isSceneReady: boolean
  canReveal: boolean // Synced state for Loader to listen to
  isLoaderGone: boolean // True when loader has fully exited
  isContextLost: boolean
  shouldShowLoader: boolean // Trigger to show loader for language change
  setSceneReady: (ready: boolean) => void
  setCanReveal: (reveal: boolean) => void
  setLoaderGone: (gone: boolean) => void
  setContextLost: (lost: boolean) => void
  triggerLoader: () => void
  resetLoaderTrigger: () => void
}

export const useSceneStore = create<SceneState>((set) => ({
  isSceneReady: false,
  canReveal: false,
  isLoaderGone: false,
  isContextLost: false,
  shouldShowLoader: false,
  setSceneReady: (ready) => set({ isSceneReady: ready }),
  setCanReveal: (reveal) => set({ canReveal: reveal }),
  setLoaderGone: (gone) => set({ isLoaderGone: gone }),
  setContextLost: (lost) => set({ isContextLost: lost }),
  triggerLoader: () => set({ shouldShowLoader: true, canReveal: false, isLoaderGone: false }),
  resetLoaderTrigger: () => set({ shouldShowLoader: false }),
}))
