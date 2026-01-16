'use client'

import { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import TopographicPlane from '@/components/TopographicPlane'
import CameraController from '@/components/CameraController'
import PostProcessingEffects from '@/components/PostProcessingEffects'
import Loader from '@/components/ui/Loader'
import { useSceneStore } from '@/stores/useSceneStore'

export default function Scene(): React.JSX.Element {
  const isSceneReady = useSceneStore((state) => state.isSceneReady)
  const [isVisible, setIsVisible] = useState(false)
  const [frameloop, setFrameloop] = useState<'demand' | 'always'>('demand')
  const [dpr, setDpr] = useState<[number, number]>([1, 1.5])

  useEffect(() => {
    if (isSceneReady) {
      setFrameloop('always')
      const timer = setTimeout(() => setIsVisible(true), 100)
      return () => clearTimeout(timer)
    }
  }, [isSceneReady])

  return (
    <>
      <Loader />
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
          gl={{ antialias: false, powerPreference: 'high-performance' }}
          style={{ background: 'var(--color-background)' }}
          onCreated={({ camera, invalidate }) => {
            camera.lookAt(0, 0, -5)
            invalidate()
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
