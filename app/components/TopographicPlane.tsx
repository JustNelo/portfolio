'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Uniforms {
  [uniform: string]: THREE.IUniform<number>
  uTime: { value: number }
}

const noiseGLSL = `
  // Simplex 3D Noise
  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  float fbm(vec3 p) {
    float value = 0.0;
    value += 0.5 * snoise(p);
    value += 0.25 * snoise(p * 2.0);
    value += 0.125 * snoise(p * 4.0);
    return value;
  }
`

const vertexShader = `
  uniform float uTime;
  
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  ${noiseGLSL}
  
  float getElevation(vec2 coord) {
    float elev = fbm(vec3(coord, uTime * 0.02));
    return elev * 0.5 + 0.5;
  }
  
  void main() {
    vUv = uv;
    
    vec3 pos = position;
    
    // Scale for terrain features
    vec2 noiseCoord = pos.xy * 0.3;
    
    // Get elevation
    float elevation = getElevation(noiseCoord);
    pos.z = elevation * 2.5;
    
    // Calculate normal using finite differences - optimized with inline noise
    float eps = 0.08;
    vec3 timeVec = vec3(0.0, 0.0, uTime * 0.02);
    float elevL = fbm(vec3(noiseCoord - vec2(eps, 0.0), 0.0) + timeVec) * 0.5 + 0.5;
    float elevR = fbm(vec3(noiseCoord + vec2(eps, 0.0), 0.0) + timeVec) * 0.5 + 0.5;
    float elevD = fbm(vec3(noiseCoord - vec2(0.0, eps), 0.0) + timeVec) * 0.5 + 0.5;
    float elevU = fbm(vec3(noiseCoord + vec2(0.0, eps), 0.0) + timeVec) * 0.5 + 0.5;
    
    vec3 tangentX = vec3(2.0 * eps, 0.0, (elevR - elevL) * 2.5);
    vec3 tangentY = vec3(0.0, 2.0 * eps, (elevU - elevD) * 2.5);
    vNormal = normalize(cross(tangentY, tangentX));
    
    vElevation = elevation;
    vPosition = pos;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  // Simple hash for procedural texture
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  // Value noise for texture
  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  // FBM for detailed texture - optimized to 2 octaves
  float fbmTexture(vec2 p) {
    return 0.6 * valueNoise(p) + 0.4 * valueNoise(p * 2.0);
  }
  
  void main() {
    float elevation = vElevation;
    vec3 normal = normalize(vNormal);
    
    // Distance-based fog
    float dist = length(vPosition.xy);
    float fog = smoothstep(5.0, 18.0, dist);
    
    // Directional light from top-left
    vec3 lightDir = normalize(vec3(-0.4, 0.7, 0.5));
    float diffuse = max(dot(normal, lightDir), 0.0);
    
    // Ambient occlusion based on slope
    float ao = 0.3 + 0.7 * diffuse;
    
    // Procedural micro-texture - more visible on slopes
    float slope = 1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0)));
    vec2 texCoord = vPosition.xy * 6.0;
    float texture = fbmTexture(texCoord);
    
    // Texture intensity based on slope and elevation
    float texIntensity = (0.3 + slope * 0.7) * (0.5 + elevation * 0.5);
    texIntensity *= (1.0 - fog * 0.8);
    
    // Create smooth topographic lines - thickness varies with elevation
    float lineFreq = 12.0;
    float lineVal = fract(elevation * lineFreq);
    
    // Line width increases on peaks, thinner in valleys
    float lineWidth = 0.02 + elevation * 0.015;
    float lines = smoothstep(0.0, lineWidth * 0.5, lineVal) * (1.0 - smoothstep(lineWidth * 0.5, lineWidth, lineVal));
    
    // Reduce lines intensity based on lighting and distance
    float lineIntensity = lines * ao * (1.0 - fog * 0.7);
    
    // Colors
    vec3 shadowColor = vec3(0.008, 0.015, 0.025);
    vec3 midColor = vec3(0.015, 0.045, 0.07);
    vec3 highlightColor = vec3(0.03, 0.09, 0.13);
    vec3 lineColor = vec3(0.0, 0.5, 0.7);
    vec3 glowColor = vec3(0.0, 0.65, 0.85);
    vec3 fogColor = vec3(0.01, 0.025, 0.04);
    
    // Terrain shading based on lighting
    vec3 terrainColor = mix(shadowColor, midColor, ao);
    terrainColor = mix(terrainColor, highlightColor, diffuse * elevation);
    
    // Apply micro-texture to terrain
    vec3 texColor = vec3(0.02, 0.06, 0.09);
    terrainColor = mix(terrainColor, terrainColor + texColor * texture, texIntensity * 0.4);
    
    // Add texture variation on slopes (rocky appearance)
    terrainColor += vec3(0.01, 0.03, 0.04) * texture * slope * 0.6 * (1.0 - fog);
    
    // Add rim lighting on slopes
    float rim = 1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0);
    rim = pow(rim, 2.5) * 0.12;
    terrainColor += vec3(0.0, 0.08, 0.12) * rim * (1.0 - fog);
    
    // Mix colors
    vec3 color = mix(terrainColor, lineColor, lineIntensity * 0.75);
    
    // Soft glow around main lines
    float glow = smoothstep(0.1, 0.0, abs(lineVal - lineWidth * 0.5)) * 0.12 * ao;
    color += glowColor * glow * (1.0 - fog * 0.5);
    
    // Peak highlights with texture
    float peakHighlight = smoothstep(0.7, 1.0, elevation) * diffuse * 0.2;
    color += vec3(0.04, 0.15, 0.22) * peakHighlight * (0.8 + texture * 0.4);
    
    // Valley darkening
    float valleyDark = smoothstep(0.35, 0.1, elevation) * 0.4;
    color *= (1.0 - valleyDark);
    
    // Apply fog
    color = mix(color, fogColor, fog * 0.6);
    
    gl_FragColor = vec4(color, 1.0);
  }
`

export default function TopographicPlane(): React.JSX.Element {
  const meshRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>>(null)
  
  const uniforms = useMemo<Uniforms>(() => ({
    uTime: { value: 0 }
  }), [])
  
  useFrame((state) => {
    if (meshRef.current && meshRef.current.material) {
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime
    }
  })
  
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.8, 0, 0.08]} position={[0, -0.5, -4]}>
      <planeGeometry args={[40, 40, 250, 250]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
