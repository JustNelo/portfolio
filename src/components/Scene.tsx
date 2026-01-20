'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import TopographicPlane from '@/components/TopographicPlane'
import CameraController from '@/components/CameraController'
import PostProcessingEffects from '@/components/PostProcessingEffects'
import Loader from '@/components/ui/Loader'
import { useSceneStore } from '@/stores/useSceneStore'

export default function Scene(): React.JSX.Element {
  const isSceneReady = useSceneStore((state) => state.isSceneReady)
  const hasInitialized = useSceneStore((state) => state.hasInitialized)
  const setHasInitialized = useSceneStore((state) => state.setHasInitialized)
  const setContextLost = useSceneStore((state) => state.setContextLost)
  
  const [isVisible, setIsVisible] = useState(hasInitialized)
  const [frameloop, setFrameloop] = useState<'demand' | 'always'>(hasInitialized ? 'always' : 'demand')
  const [dpr, setDpr] = useState<[number, number]>([1, 1.5])

  useEffect(() => {
    if (isSceneReady && !hasInitialized) {
      setHasInitialized(true)
      setFrameloop('always')
      const timer = setTimeout(() => setIsVisible(true), 100)
      return () => clearTimeout(timer)
    } else if (hasInitialized) {
      setIsVisible(true)
      setFrameloop('always')
    }
  }, [isSceneReady, hasInitialized, setHasInitialized])

  const handleContextLost = useCallback((event: WebGLContextEvent) => {
    event.preventDefault()
    console.warn('WebGL context lost - attempting recovery')
    setContextLost(true)
    setFrameloop('demand')
  }, [setContextLost])

  const handleContextRestored = useCallback(() => {
    console.log('WebGL context restored')
    setContextLost(false)
    setFrameloop('always')
  }, [setContextLost])

  // Show loader only on first visit
  const showLoader = !hasInitialized

  return (
    <>
      {showLoader && <Loader />}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'opacity'
        }}
      >
        <Canvas
          frameloop={frameloop}
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
            {isSceneReady && <PostProcessingEffects />}
          </Suspense>
        </Canvas>
      </div>
    </>
  )
}
