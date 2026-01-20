'use client'

import { useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, Noise, Scanline, SMAA } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useIsMobile } from '@/hooks'
import type { QualityLevel } from '@/types'

/**
 * Determines rendering quality based on device capabilities.
 * Uses RENDERER parameter (WEBGL_debug_renderer_info is deprecated in Firefox).
 */
function usePerformanceLevel(): QualityLevel {
  const { gl } = useThree()
  const isMobile = useIsMobile()
  const [quality, setQuality] = useState<QualityLevel>('high')

  useEffect(() => {
    const renderer = gl.getContext()
    
    // Try to get GPU info - use RENDERER as fallback (Firefox deprecated WEBGL_debug_renderer_info)
    let gpuVendor = ''
    try {
      // First try the standard RENDERER parameter
      gpuVendor = renderer.getParameter(renderer.RENDERER) || ''
      
      // If that doesn't give useful info, try the debug extension (still works in Chrome/Safari)
      if (!gpuVendor || gpuVendor === 'WebKit WebGL') {
        const debugInfo = renderer.getExtension('WEBGL_debug_renderer_info')
        if (debugInfo) {
          gpuVendor = renderer.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || gpuVendor
        }
      }
    } catch {
      // Silently fail - will use default high quality
    }
    
    const isLowEndGPU = /Intel|Mali|Adreno 3|Adreno 4|PowerVR/i.test(gpuVendor)
    const isHighDPR = window.devicePixelRatio > 2

    if (isMobile || isLowEndGPU) {
      setQuality('low')
    } else if (isHighDPR) {
      setQuality('medium')
    } else {
      setQuality('high')
    }
  }, [gl, isMobile])

  return quality
}

export default function PostProcessingEffects(): React.JSX.Element | null {
  const quality = usePerformanceLevel()

  if (quality === 'low') {
    return (
      <EffectComposer multisampling={0}>
        <Vignette
          offset={0.3}
          darkness={0.7}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    )
  }

  if (quality === 'medium') {
    return (
      <EffectComposer multisampling={0}>
        <SMAA />
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette
          offset={0.3}
          darkness={0.8}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    )
  }

  return (
    <EffectComposer multisampling={0}>
      <SMAA />
      <Bloom
        intensity={2.0}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.8}
        mipmapBlur
      />
      <Vignette
        offset={0.3}
        darkness={0.9}
        blendFunction={BlendFunction.NORMAL}
      />
      <Scanline
        blendFunction={BlendFunction.OVERLAY}
        density={1.5}
        opacity={0.15}
      />
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={0.4}
      />
    </EffectComposer>
  )
}
