'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

export default function CameraController(): null {
  const { camera } = useThree()
  const initialized = useRef<boolean>(false)
  
  useFrame(() => {
    if (!initialized.current) {
      camera.position.set(0, 2.5, 3)
      camera.lookAt(0, 0, -5)
      initialized.current = true
    }
  })
  
  return null
}
