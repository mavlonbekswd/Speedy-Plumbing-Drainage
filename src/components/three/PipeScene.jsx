import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { cinematicScroll } from './scrollState'

/**
 * The cinematic pipe journey. Scroll (0..1) drives the camera through a dark
 * metallic pipe environment: water flows, a blockage appears mid-journey,
 * clears as the user keeps scrolling, and the lighting shifts from cold steel
 * to clean electric blue — the service story told in one continuous scene.
 *
 * All geometry is procedural (no downloaded models). Rendering is paused by
 * the parent when the scene leaves the viewport.
 */

const TUNNEL_LENGTH = 70
const CAM_START_Z = 4
const CAM_END_Z = -44
const BLOCKAGE_Z = -30
const CLEAR_START = 0.5 // blockage starts dissolving
const CLEAR_END = 0.72 // fully cleared

function Tunnel() {
  const flanges = useMemo(() => {
    const arr = []
    for (let z = 2; z > -TUNNEL_LENGTH + 6; z -= 6) arr.push(z)
    return arr
  }, [])

  return (
    <group>
      {/* Main pipe interior */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -TUNNEL_LENGTH / 2 + 6]}>
        <cylinderGeometry args={[3.2, 3.2, TUNNEL_LENGTH, 40, 1, true]} />
        <meshStandardMaterial
          color="#232b36"
          metalness={0.88}
          roughness={0.42}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Flanged joints along the run */}
      {flanges.map((z) => (
        <mesh key={z} position={[0, 0, z]}>
          <torusGeometry args={[3.05, 0.16, 12, 48]} />
          <meshStandardMaterial color="#39434f" metalness={0.95} roughness={0.3} />
        </mesh>
      ))}

      {/* Secondary service pipes running along the walls */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[2.35, -1.5, -TUNNEL_LENGTH / 2 + 6]}>
        <cylinderGeometry args={[0.24, 0.24, TUNNEL_LENGTH, 14]} />
        <meshStandardMaterial color="#4a5563" metalness={0.9} roughness={0.35} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[-2.4, 1.4, -TUNNEL_LENGTH / 2 + 6]}>
        <cylinderGeometry args={[0.18, 0.18, TUNNEL_LENGTH, 14]} />
        <meshStandardMaterial color="#414c5a" metalness={0.9} roughness={0.38} />
      </mesh>

      {/* Valve wheels on the wall pipes */}
      {[-10, -26, -40].map((z) => (
        <group key={z} position={[2.35, -1.5, z]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.5, 0.07, 10, 28]} />
            <meshStandardMaterial color="#5c6875" metalness={0.9} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function WaterFlow({ mobile }) {
  const pointsRef = useRef()
  const count = mobile ? 140 : 420

  // Build the particle geometry imperatively — safer than JSX bufferAttribute
  // construction across three versions.
  const { geometry, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 0.9
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = -1.6 + Math.abs(Math.sin(angle)) * radius * 0.5
      positions[i * 3 + 2] = 4 - Math.random() * (TUNNEL_LENGTH - 8)
      seeds[i] = Math.random()
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return { geometry, seeds }
  }, [count])

  // Soft round sprite so droplets don't render as hard squares.
  const sprite = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 64
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.4, 'rgba(255,255,255,0.55)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((_, delta) => {
    const geo = pointsRef.current?.geometry
    if (!geo) return
    const p = cinematicScroll.progress
    // Flow chokes as the blockage nears, surges once cleared.
    const cleared = THREE.MathUtils.clamp((p - CLEAR_START) / (CLEAR_END - CLEAR_START), 0, 1)
    const approach = THREE.MathUtils.clamp((p - 0.3) / 0.2, 0, 1)
    const speed = 6 * (1 - approach * 0.75 + cleared * 1.4)
    const arr = geo.attributes.position.array
    for (let i = 0; i < count; i++) {
      const zi = i * 3 + 2
      arr[zi] -= speed * delta * (0.6 + seeds[i] * 0.8)
      // Particles pile up just before an uncleared blockage
      if (cleared < 1 && arr[zi] < BLOCKAGE_Z + 1.6 && arr[zi] > BLOCKAGE_Z - 0.5) {
        arr[zi] = BLOCKAGE_Z + 1.6 + seeds[i] * 1.2
      }
      if (arr[zi] < 4 - (TUNNEL_LENGTH - 8)) arr[zi] = 4
    }
    geo.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#7dd3fc"
        map={sprite}
        size={0.09}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function Blockage() {
  const meshRef = useRef()
  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) return
    const p = cinematicScroll.progress
    const cleared = THREE.MathUtils.clamp((p - CLEAR_START) / (CLEAR_END - CLEAR_START), 0, 1)
    const scale = Math.max(0.0001, 1 - cleared)
    mesh.scale.setScalar(scale)
    mesh.visible = cleared < 0.999
    mesh.rotation.y += delta * 0.08
  })
  return (
    <mesh ref={meshRef} position={[0, -1.4, BLOCKAGE_Z]}>
      <dodecahedronGeometry args={[1.35, 1]} />
      <meshStandardMaterial color="#171c22" roughness={1} metalness={0.05} flatShading />
    </mesh>
  )
}

function CameraRig({ mobile }) {
  const { camera } = useThree()
  const keyLightRef = useRef()
  const accentLightRef = useRef()
  const steel = useMemo(() => new THREE.Color('#9fb2c8'), [])
  const electric = useMemo(() => new THREE.Color('#38bdf8'), [])
  const smoothed = useRef({ x: 0, y: 0 })

  useFrame(() => {
    const p = cinematicScroll.progress
    const cleared = THREE.MathUtils.clamp((p - CLEAR_START) / (CLEAR_END - CLEAR_START), 0, 1)

    // Gentle pointer parallax (desktop only), heavily damped
    const targetX = mobile ? 0 : cinematicScroll.mouseX * 0.3
    const targetY = mobile ? 0 : cinematicScroll.mouseY * 0.18
    smoothed.current.x += (targetX - smoothed.current.x) * 0.04
    smoothed.current.y += (targetY - smoothed.current.y) * 0.04

    const z = THREE.MathUtils.lerp(CAM_START_Z, CAM_END_Z, p)
    const sway = mobile ? 0.15 : 0.45
    camera.position.set(
      Math.sin(p * Math.PI * 2) * sway + smoothed.current.x,
      -0.2 + Math.sin(p * Math.PI * 3) * 0.12 + smoothed.current.y,
      z
    )
    camera.lookAt(smoothed.current.x * 0.4, -0.35, z - 8)

    // Headlamp follows the camera; accent light warms from steel to electric
    // as the blockage clears — the "light direction/colour" scroll beat.
    if (keyLightRef.current) {
      keyLightRef.current.position.set(0.6, 1.6, z - 4)
      keyLightRef.current.intensity = 26 + cleared * 18
    }
    if (accentLightRef.current) {
      accentLightRef.current.position.set(-1.2, -1, z - 10)
      accentLightRef.current.color.copy(steel).lerp(electric, cleared)
      accentLightRef.current.intensity = 12 + cleared * 26
    }
  })

  return (
    <>
      <pointLight ref={keyLightRef} distance={26} decay={1.8} color="#dbe7f4" intensity={26} />
      <pointLight ref={accentLightRef} distance={22} decay={1.8} color="#9fb2c8" intensity={12} />
    </>
  )
}

export default function PipeScene({ active = true, mobile = false }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, mobile ? 1.5 : 2]}
      camera={{ fov: 62, near: 0.1, far: 60, position: [0, -0.2, CAM_START_Z] }}
      gl={{
        antialias: !mobile,
        powerPreference: 'high-performance',
        alpha: false,
      }}
      shadows={false}
      className="h-full w-full"
      aria-hidden="true"
    >
      <color attach="background" args={['#0b0d10']} />
      <fog attach="fog" args={['#0b0d10', 7, 30]} />
      <ambientLight intensity={0.22} color="#31404f" />
      <Tunnel />
      <WaterFlow mobile={mobile} />
      <Blockage />
      <CameraRig mobile={mobile} />
    </Canvas>
  )
}
