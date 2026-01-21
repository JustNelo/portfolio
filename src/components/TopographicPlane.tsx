'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneStore } from '@/stores/useSceneStore'
import { useIsMobile } from '@/hooks'

interface Uniforms {
  [uniform: string]: THREE.IUniform<number | THREE.Vector2>
  uTime: THREE.IUniform<number>
  uMouse: THREE.IUniform<THREE.Vector2>
}

/**
 * Vertex shader: Creates animated topographic terrain using simplex noise.
 * Mouse position creates subtle parallax offset for depth effect.
 */
const vertexShader = `
  precision highp float;
  
  uniform float uTime;
  uniform vec2 uMouse;
  
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vPosition;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SIMPLEX NOISE 2D - Single function, optimized for smooth waves
  // ═══════════════════════════════════════════════════════════════════════════
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Ultra-slow, hypnotic movement
    float time = uTime * 0.05;
    
    // Mouse parallax - subtle UV offset based on mouse position
    vec2 mouseOffset = uMouse * 0.15;
    
    // Single octave, large scale noise for smooth dunes
    vec2 noiseCoord = pos.xy * 0.06 + vec2(time * 0.5, time * 0.3) + mouseOffset;
    float noise = snoise(noiseCoord);
    
    // Sinusoidal smoothing - no sharp peaks, only gentle waves
    float wave = sin(noise * 3.14159 * 0.5) * 0.5 + 0.5;
    
    // Smoothstep to round the tops like sand dunes
    float elevation = smoothstep(0.0, 1.0, wave);
    elevation = smoothstep(0.0, 1.0, elevation); // Double smoothstep for extra softness
    
    // Gentle height
    pos.z = elevation * 1.8;
    
    vElevation = elevation;
    vPosition = pos;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

/**
 * Fragment shader: Renders dark oily surface with glowing topographic lines.
 * Uses Blinn-Phong lighting, depth/height fog, and film grain for cinematic look.
 */
const fragmentShader = `
  precision highp float;
  
  uniform float uTime;
  uniform vec2 uMouse;
  
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vPosition;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // RANDOM & GRAIN - For film grain dithering
  // ═══════════════════════════════════════════════════════════════════════════
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  // High-frequency noise for glints
  float glintNoise(vec2 st, float time) {
    return random(st * 50.0 + vec2(time * 10.0));
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SIMPLEX NOISE 2D - For smooth normal calculation
  // ═══════════════════════════════════════════════════════════════════════════
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  // Compute elevation at any point (must match vertex shader logic)
  float getElevation(vec2 pos, float time) {
    vec2 noiseCoord = pos * 0.06 + vec2(time * 0.5, time * 0.3);
    float noise = snoise(noiseCoord);
    float wave = sin(noise * 3.14159 * 0.5) * 0.5 + 0.5;
    float elev = smoothstep(0.0, 1.0, wave);
    return smoothstep(0.0, 1.0, elev);
  }
  
  void main() {
    float elevation = vElevation;
    float time = uTime * 0.05;
    
    // ═══════════════════════════════════════════════════════════════════════════
    // SMOOTH NORMALS - Computed from noise function directly
    // ═══════════════════════════════════════════════════════════════════════════
    float eps = 0.1;
    float hL = getElevation(vPosition.xy - vec2(eps, 0.0), time);
    float hR = getElevation(vPosition.xy + vec2(eps, 0.0), time);
    float hD = getElevation(vPosition.xy - vec2(0.0, eps), time);
    float hU = getElevation(vPosition.xy + vec2(0.0, eps), time);
    
    vec3 normal = normalize(vec3(
      (hL - hR) * 2.5,
      (hD - hU) * 2.5,
      1.0
    ));
    
    float slope = 1.0 - normal.z;
    
    // ═══════════════════════════════════════════════════════════════════════════
    // DEPTH FOG - Everything fades to pure black
    // ═══════════════════════════════════════════════════════════════════════════
    float dist = length(vPosition.xy);
    float depthFog = smoothstep(3.0, 16.0, dist);
    
    // ═══════════════════════════════════════════════════════════════════════════
    // HEIGHT FOG - Only crests carry the white lines
    // ═══════════════════════════════════════════════════════════════════════════
    float heightFog = smoothstep(0.5, 0.0, elevation) * 0.85;
    
    // Combined fog
    float fog = max(depthFog, heightFog);
    
    // ═══════════════════════════════════════════════════════════════════════════
    // LIGHTING - Blinn-Phong Specular for oily reflections
    // ═══════════════════════════════════════════════════════════════════════════
    vec3 lightDir = normalize(vec3(-0.3, 0.7, 0.6));
    vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
    vec3 halfDir = normalize(lightDir + viewDir);
    
    float diffuse = max(dot(normal, lightDir), 0.0);
    
    // Blinn-Phong specular - concentrated white highlights on crests
    float specAngle = max(dot(normal, halfDir), 0.0);
    float specular = pow(specAngle, 32.0) * elevation * 0.8;
    
    // ═══════════════════════════════════════════════════════════════════════════
    // TOPOGRAPHIC LINES - Double glow: sharp core + soft halo
    // ═══════════════════════════════════════════════════════════════════════════
    float lineFreq = 3.5;
    float lineVal = fract(elevation * lineFreq);
    
    // Use screen-space derivatives for anti-aliasing (no extra noise samples)
    float fw = fwidth(elevation) * lineFreq * 2.0;
    fw = max(fw, 0.002);
    
    // Sharp core line (fiber optic center)
    float coreWidth = 0.004;
    float coreLines = smoothstep(coreWidth + fw * 0.5, coreWidth, lineVal) + 
                      smoothstep(1.0 - coreWidth - fw * 0.5, 1.0 - coreWidth, lineVal);
    coreLines = clamp(coreLines, 0.0, 1.0);
    
    // Soft halo glow (neon bloom)
    float haloWidth = 0.04;
    float haloLines = smoothstep(haloWidth + fw, haloWidth * 0.3, lineVal) + 
                      smoothstep(1.0 - haloWidth - fw, 1.0 - haloWidth * 0.3, lineVal);
    haloLines = clamp(haloLines, 0.0, 1.0);
    
    // Lines only on slopes and crests, invisible in valleys
    float slopeVisibility = smoothstep(0.02, 0.12, slope);
    float crestVisibility = smoothstep(0.3, 0.7, elevation);
    float lineVisibility = slopeVisibility * crestVisibility * (1.0 - fog * 0.95);
    
    // Core: pure white, full intensity
    float coreIntensity = coreLines * lineVisibility * 0.9;
    // Halo: subtle glow around core with breathing effect
    float breathing = 0.12 + 0.06 * sin(uTime * 0.5);
    float haloIntensity = haloLines * lineVisibility * breathing;
    
    // ═══════════════════════════════════════════════════════════════════════════
    // COLOR - Abyssal black with electric white accents
    // ═══════════════════════════════════════════════════════════════════════════
    vec3 abyssBlack = vec3(0.0);
    vec3 coreWhite = vec3(1.0);
    vec3 haloWhite = vec3(0.9);
    
    // Base terrain: pure black with minimal shading
    vec3 terrainColor = vec3(diffuse * 0.02 * elevation);
    
    // Crush the grays to deepen blacks
    terrainColor = pow(terrainColor, vec3(1.5));
    
    // Add specular highlights (oily reflections on crests)
    terrainColor += vec3(1.0) * specular * (1.0 - fog);
    
    // ═══════════════════════════════════════════════════════════════════════════
    // GLINTS - Micro-sparkles on intense specular areas
    // ═══════════════════════════════════════════════════════════════════════════
    float glint = glintNoise(vPosition.xy, uTime);
    float glintThreshold = step(0.97, glint) * step(0.3, specular);
    terrainColor += vec3(1.0) * glintThreshold * 0.8 * (1.0 - fog);
    
    // Layer the glow lines
    vec3 color = terrainColor;
    color = mix(color, haloWhite, haloIntensity);
    color = mix(color, coreWhite, coreIntensity);
    
    // Fade everything to pure black at distance
    color = mix(color, abyssBlack, fog);
    
    // ═══════════════════════════════════════════════════════════════════════════
    // FILM GRAIN - Cinematic texture
    // ═══════════════════════════════════════════════════════════════════════════
    float grain = random(vUv * 1000.0 + uTime) * 0.03 - 0.015;
    color += grain;
    
    gl_FragColor = vec4(color, 1.0);
  }
`

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
