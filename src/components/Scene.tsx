'use client'

import { useState, useEffect, Suspense, useCallback, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor, Preload } from '@react-three/drei'
import TopographicPlane from '@/components/TopographicPlane'
import CameraController from '@/components/CameraController'
import PostProcessingEffects from '@/components/PostProcessingEffects'
import Loader from '@/components/ui/Loader/index'
import { useSceneStore, getHasCompletedFirstLoad, setHasCompletedFirstLoad } from '@/stores/useSceneStore'
import { useIsMobile } from '@/hooks'

// Minimum time to show loader for smooth UX (in ms)
const MIN_LOADER_DURATION = 2500
// Delay after "READY" before hiding loader (matches Loader animation)
const LOADER_EXIT_DELAY = 1400

interface SceneProps {
  withLoader?: boolean
}

export default function Scene({ withLoader = true }: SceneProps): React.JSX.Element {
  const isSceneReady = useSceneStore((state) => state.isSceneReady)
  const setContextLost = useSceneStore((state) => state.setContextLost)
  const setCanRevealStore = useSceneStore((state) => state.setCanReveal)
  const setLoaderGone = useSceneStore((state) => state.setLoaderGone)
  const shouldShowLoader = useSceneStore((state) => state.shouldShowLoader)
  const resetLoaderTrigger = useSceneStore((state) => state.resetLoaderTrigger)
  
  // Check module-level flag immediately (synchronous, no hydration issues)
  const isReturningVisitor = useRef(getHasCompletedFirstLoad()).current
  
  // Always render at full frameloop to pre-warm GPU, but keep scene hidden
  const [isVisible, setIsVisible] = useState(isReturningVisitor)
  const isMobile = useIsMobile()
  const [dpr, setDpr] = useState<[number, number]>([1, 1.5])
  
  // Proactively reduce DPR on mobile to save GPU/battery
  useEffect(() => {
    if (isMobile) {
      setDpr([0.75, 1])
    } else {
      setDpr([1, 1.5])
    }
  }, [isMobile])
  const [showLoader, setShowLoader] = useState(!isReturningVisitor)
  const [minTimeElapsed, setMinTimeElapsed] = useState(isReturningVisitor)
  const [canReveal, setCanReveal] = useState(isReturningVisitor)
  
  // Track willChange for performance (only during transition)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Listen for language change trigger to show loader
  useEffect(() => {
    if (shouldShowLoader) {
      setShowLoader(true)
      setCanReveal(false)
      setMinTimeElapsed(false)
      setIsVisible(false)
    }
  }, [shouldShowLoader])

  // Minimum loader duration timer
  useEffect(() => {
    if (isReturningVisitor && !shouldShowLoader) return
    if (minTimeElapsed && !shouldShowLoader) return
    
    const timer = setTimeout(() => {
      setMinTimeElapsed(true)
    }, MIN_LOADER_DURATION)
    
    return () => clearTimeout(timer)
  }, [isReturningVisitor, shouldShowLoader, minTimeElapsed])

  // When both conditions are met, signal we can reveal
  useEffect(() => {
    if (isReturningVisitor && !shouldShowLoader) return
    if (!isSceneReady || !minTimeElapsed) return
    
    setCanReveal(true)
    setCanRevealStore(true) // Sync to store for Loader
    setHasCompletedFirstLoad(true)
  }, [isSceneReady, minTimeElapsed, isReturningVisitor, shouldShowLoader, setCanRevealStore])

  // Handle the actual reveal after loader exit animation completes
  useEffect(() => {
    if (isReturningVisitor && !shouldShowLoader) {
      // For returning visitors, loader is already gone
      setLoaderGone(true)
      return
    }
    if (!canReveal) return
    
    // Start transition
    setIsTransitioning(true)
    
    // Wait for loader's "READY" animation + exit transition
    const timer = setTimeout(() => {
      setShowLoader(false)
      resetLoaderTrigger() // Reset the trigger flag
      // Use double rAF for browser to process loader removal first
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true)
          setLoaderGone(true) // Signal that loader is completely gone
          // Clean up willChange after transition
          setTimeout(() => setIsTransitioning(false), 1500)
        })
      })
    }, LOADER_EXIT_DELAY)
    
    return () => clearTimeout(timer)
  }, [canReveal, isReturningVisitor, shouldShowLoader, setLoaderGone, resetLoaderTrigger])

  const handleContextLost = useCallback((event: WebGLContextEvent) => {
    event.preventDefault()
    console.warn('WebGL context lost - attempting recovery')
    setContextLost(true)
  }, [setContextLost])

  const handleContextRestored = useCallback(() => {
    console.log('WebGL context restored')
    setContextLost(false)
  }, [setContextLost])

  return (
    <>
      {withLoader && showLoader && <Loader />}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: isTransitioning ? 'opacity' : 'auto'
        }}
      >
        <Canvas
          frameloop="always"
          dpr={dpr}
          performance={{ min: 0.5 }}
          camera={{ 
            position: [0, 2.5, 3],
            fov: 65,
            near: 0.1,
            far: 100
          }}
          gl={{ 
            antialias: false, 
            powerPreference: 'high-performance',
            preserveDrawingBuffer: true,
          }}
          style={{ background: 'var(--color-background)' }}
          onCreated={({ gl, camera, invalidate }) => {
            camera.lookAt(0, 0, -5)
            invalidate()
            
            // Handle WebGL context loss/restoration
            const canvas = gl.domElement
            canvas.addEventListener('webglcontextlost', handleContextLost as EventListener)
            canvas.addEventListener('webglcontextrestored', handleContextRestored)
          }}
        >
          <PerformanceMonitor
            onDecline={() => setDpr([1, 1])}
            onIncline={() => setDpr([1, 1.5])}
          />
          <Suspense fallback={null}>
            <CameraController />
            <TopographicPlane />
            <PostProcessingEffects />
          </Suspense>
          <Preload all />
        </Canvas>
      </div>
    </>
  )
}
