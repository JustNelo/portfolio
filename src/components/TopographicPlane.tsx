'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneStore } from '@/stores/useSceneStore'
import { useIsMobile } from '@/hooks'
import { vertexShader, fragmentShader } from '@/lib/shaders/topographic'

interface Uniforms {
  [uniform: string]: THREE.IUniform<number | THREE.Vector2>
  uTime: THREE.IUniform<number>
  uMouse: THREE.IUniform<THREE.Vector2>
}

/**
 * Main 3D topographic plane component.
 * Renders an animated terrain with mouse-reactive parallax effect.
 */
export default function TopographicPlane(): React.JSX.Element {
  const isMobile = useIsMobile()
  const meshRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>>(null)
  const frameCount = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const setSceneReady = useSceneStore((state) => state.setSceneReady)
  
  const segments = isMobile ? 64 : 100
  
  const uniforms = useMemo<Uniforms>(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) }
  }), [])
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1
    }
    // Passive listener for better scroll/animation performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  // Dispose geometry and material to prevent memory leaks
  useEffect(() => {
    const mesh = meshRef.current
    return () => {
      if (mesh) {
        mesh.geometry?.dispose()
        ;(mesh.material as THREE.ShaderMaterial)?.dispose()
      }
    }
  }, [])
  
  useFrame((state) => {
    if (meshRef.current && meshRef.current.material) {
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime
      
      const lerp = 0.05
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * lerp
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * lerp
      meshRef.current.material.uniforms.uMouse.value.set(
        mouseRef.current.x,
        mouseRef.current.y
      )
      
      // Wait for more frames to ensure shaders are compiled and scene is stable
      if (frameCount.current < 10) {
        frameCount.current++
        state.invalidate()
        // Signal ready after 8 frames - gives GPU time to compile shaders
        if (frameCount.current === 8) {
          setSceneReady(true)
        }
      }
    }
  }, -1)
  
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.8, 0, 0.08]} position={[0, -0.5, -4]}>
      <planeGeometry args={[40, 40, segments, segments]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
