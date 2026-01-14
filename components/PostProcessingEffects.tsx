'use client'

import { EffectComposer, Bloom, Vignette, Noise, Scanline } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

export default function PostProcessingEffects(): React.JSX.Element {
  return (
    <EffectComposer>
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
