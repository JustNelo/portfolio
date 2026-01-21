'use client'

import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

export default function CameraController(): null {
  const { camera } = useThree()
  
  // Initialize camera once on mount instead of checking every frame
  useEffect(() => {
    camera.position.set(0, 2.5, 3)
    camera.lookAt(0, 0, -5)
  }, [camera])
  
  return null
}
