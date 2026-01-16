'use client'

import { Canvas } from '@react-three/fiber'
import TopographicPlane from '@/components/TopographicPlane'
import CameraController from '@/components/CameraController'
import PostProcessingEffects from '@/components/PostProcessingEffects'

export default function Scene(): React.JSX.Element {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ 
          position: [0, 2.5, 3],
          fov: 65,
          near: 0.1,
          far: 100
        }}
        gl={{ antialias: true }}
        style={{ background: 'var(--color-background)' }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 0, -5)
        }}
      >
        <CameraController />
        <TopographicPlane />
        <PostProcessingEffects />
      </Canvas>
    </div>
  )
}
