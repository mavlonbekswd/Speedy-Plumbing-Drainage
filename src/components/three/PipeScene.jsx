import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { cinematicScroll } from './scrollState'

/**
 * The cinematic water journey. Scroll (0..1) tells one continuous story:
 *
 *   STAGE 1–2 (p 0.00–0.62)  inside a curved metal main, riding the flow
 *   STAGE 3   (p ~0.66)      the pipe mouth opens into light — the seam
 *                            between camera paths hides inside the bloom
 *   STAGE 4–5 (p 0.72–1.00)  a premium kitchen resolves; the tap pours,
 *                            ripples spread in the basin, lighting warms
 *
 * All geometry is procedural (no downloaded models). Water is an illusion:
 * scrolling streak textures, curve-following particles and ribbon streams —
 * never a fluid simulation. Rendering pauses when the scene leaves the
 * viewport (parent gate) and everything reads scroll from shared mutable
 * state, so nothing re-renders React per frame.
 */

// ---------------------------------------------------------------------------
// Story timing (progress breakpoints)
// ---------------------------------------------------------------------------
const EXIT_P = 0.66 // camera crosses the pipe mouth
const REVEAL_START = 0.58 // kitchen lighting begins
const REVEAL_END = 0.8 // kitchen fully lit
const POUR_START = 0.76 // tap starts pouring
const POUR_END = 0.87 // full stream

// ---------------------------------------------------------------------------
// Camera paths. The pipe leg and kitchen leg are separate curves; the hand-off
// happens at EXIT_P, masked by the light gate.
// ---------------------------------------------------------------------------
const pipePath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, -0.15, 6),
  new THREE.Vector3(0.7, -0.2, -2),
  new THREE.Vector3(-0.85, 0.1, -10),
  new THREE.Vector3(0.5, -0.15, -17),
  new THREE.Vector3(-0.3, 0.15, -24),
  new THREE.Vector3(0, 0.35, -28.5),
  new THREE.Vector3(0, 0.6, -32),
])

const kitchenPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0.6, -32),
  new THREE.Vector3(0, 0.95, -35.5),
  new THREE.Vector3(0, 1.4, -38.6),
  new THREE.Vector3(0, 1.72, -41.3),
])

// Pipe geometry extends behind the camera start so the entry never shows a rim.
const pipeGeoCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, -0.1, 9.5),
  ...pipePath.points,
])

const MOUTH = new THREE.Vector3(0, 0.6, -32)
const FAUCET_LOOK = new THREE.Vector3(0, 1.32, -43.5)

const smoothstep = (x, a, b) => THREE.MathUtils.smoothstep(x, a, b)
const bell = (x, c, w) => Math.exp(-(((x - c) / w) ** 2))

// ---------------------------------------------------------------------------
// Procedural textures
// ---------------------------------------------------------------------------
function makeStreakTexture(size = 256, streaks = 90, vertical = false) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'rgba(8,20,32,1)'
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < streaks; i++) {
    const a = 0.05 + Math.random() * 0.22
    const len = size * (0.2 + Math.random() * 0.5)
    const w = 1 + Math.random() * 2
    const x = Math.random() * size
    const y = Math.random() * size
    const g = vertical
      ? ctx.createLinearGradient(0, y, 0, y + len)
      : ctx.createLinearGradient(x, 0, x + len, 0)
    g.addColorStop(0, 'rgba(190,230,255,0)')
    g.addColorStop(0.5, `rgba(190,230,255,${a})`)
    g.addColorStop(1, 'rgba(190,230,255,0)')
    ctx.fillStyle = g
    if (vertical) ctx.fillRect(x, y, w, len)
    else ctx.fillRect(x, y, len, w)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}

function makeGlowTexture(size = 128) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(230,244,255,1)')
  g.addColorStop(0.45, 'rgba(150,210,250,0.5)')
  g.addColorStop(1, 'rgba(120,190,245,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}

function makeWindowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, 0, 64)
  g.addColorStop(0, '#f2f7fb')
  g.addColorStop(0.6, '#cfe2ef')
  g.addColorStop(1, '#a8c4d8')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(canvas)
}

// ---------------------------------------------------------------------------
// Studio reflections — local, no network fetch
// ---------------------------------------------------------------------------
function StudioEnv() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])
  return null
}

// ---------------------------------------------------------------------------
// STAGE 1 — the pipe interior
// ---------------------------------------------------------------------------
function PipeRun({ mobile }) {
  const groupRef = useRef()
  const waterMatRef = useRef()
  const glowRef = useRef()

  const { pipeGeo, waterGeo, ribs, streakTex } = useMemo(() => {
    const pipeGeo = new THREE.TubeGeometry(pipeGeoCurve, mobile ? 70 : 120, 3, mobile ? 16 : 24, false)

    // The flowing stream: an offset copy of the pipe curve, squashed into a
    // wide shallow ellipse riding the bottom of the main.
    const waterPts = pipeGeoCurve.points.map((v) => new THREE.Vector3(v.x, v.y - 1.5, v.z))
    const waterCurve = new THREE.CatmullRomCurve3(waterPts)
    const waterGeo = new THREE.TubeGeometry(waterCurve, mobile ? 60 : 100, 2.72, mobile ? 12 : 18, false)
    waterGeo.scale(1, 0.32, 1)
    // scale() is applied about the origin, pulling offset curves toward y=0 —
    // recentre the stream back down onto the pipe floor.
    waterGeo.computeBoundingBox()
    waterGeo.translate(0, -1.5 * (1 - 0.32), 0)

    // Rib flanges perpendicular to the run — the passing rhythm of the journey.
    const ribs = []
    const count = mobile ? 9 : 14
    for (let i = 0; i < count; i++) {
      const t = 0.08 + (i / count) * 0.9
      const pos = pipeGeoCurve.getPointAt(t)
      const tan = pipeGeoCurve.getTangentAt(t)
      ribs.push({ pos, look: pos.clone().add(tan), key: i })
    }

    const streakTex = makeStreakTexture(256, mobile ? 60 : 100, false)
    streakTex.repeat.set(7, 2)
    return { pipeGeo, waterGeo, ribs, streakTex }
  }, [mobile])

  const glowTex = useMemo(() => makeGlowTexture(), [])

  useFrame((_, delta) => {
    const p = cinematicScroll.smoothProgress
    // Water always runs — the idle frame must feel alive.
    streakTex.offset.x -= delta * 0.55
    if (waterMatRef.current) {
      waterMatRef.current.opacity = 0.55 - smoothstep(p, 0.5, 0.7) * 0.25
    }
    if (glowRef.current) {
      // Daylight grows at the end of the run as the outlet nears.
      glowRef.current.material.opacity = 0.12 + smoothstep(p, 0.25, EXIT_P) * 0.85
      const s = 1 + smoothstep(p, 0.3, EXIT_P) * 0.6
      glowRef.current.scale.setScalar(s)
    }
    if (groupRef.current) groupRef.current.visible = p < 0.82
  })

  return (
    <group ref={groupRef}>
      {/* Main interior */}
      <mesh geometry={pipeGeo}>
        <meshStandardMaterial
          color="#242c37"
          metalness={0.9}
          roughness={0.38}
          envMapIntensity={0.5}
          side={THREE.BackSide}
        />
      </mesh>

      {/* The river inside the main */}
      <mesh geometry={waterGeo}>
        <meshStandardMaterial
          ref={waterMatRef}
          color="#2f86c4"
          emissive="#0d3f63"
          emissiveIntensity={0.9}
          metalness={0.1}
          roughness={0.16}
          envMapIntensity={0.8}
          transparent
          opacity={0.55}
          map={streakTex}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Rib flanges */}
      {ribs.map((rib) => (
        <mesh key={rib.key} position={rib.pos} onUpdate={(m) => m.lookAt(rib.look)}>
          <torusGeometry args={[3.02, 0.15, 10, 40]} />
          <meshStandardMaterial color="#39434f" metalness={0.95} roughness={0.3} envMapIntensity={0.6} />
        </mesh>
      ))}

      {/* Outlet rim + the light waiting at the end of the run */}
      <mesh position={MOUTH} onUpdate={(m) => m.lookAt(MOUTH.x, MOUTH.y, MOUTH.z - 2)}>
        <torusGeometry args={[2.96, 0.22, 12, 44]} />
        <meshStandardMaterial color="#4a5563" metalness={0.95} roughness={0.26} envMapIntensity={0.7} />
      </mesh>
      <mesh ref={glowRef} position={[MOUTH.x, MOUTH.y, MOUTH.z - 0.4]}>
        <circleGeometry args={[2.9, 40]} />
        <meshBasicMaterial
          map={glowTex}
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

// Streaks and bubbles riding the flow, sampled along the pipe curve so they
// follow every bend. Positions update imperatively — zero React churn.
function FlowParticles({ mobile }) {
  const streakRef = useRef()
  const bubbleRef = useRef()
  const streakCount = mobile ? 150 : 460
  const bubbleCount = mobile ? 40 : 90

  const { samples, streakGeo, bubbleGeo, streakData, bubbleData, sprite } = useMemo(() => {
    const SAMPLES = 220
    const samples = []
    for (let i = 0; i < SAMPLES; i++) samples.push(pipeGeoCurve.getPointAt(i / (SAMPLES - 1)))

    const mkGeo = (n) => {
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
      return g
    }
    const streakGeo = mkGeo(streakCount)
    const bubbleGeo = mkGeo(bubbleCount)

    const streakData = Array.from({ length: streakCount }, () => ({
      t: Math.random(),
      x: (Math.random() - 0.5) * 3.6,
      y: -1.45 + Math.random() * 1.1,
      speed: 0.055 + Math.random() * 0.075,
    }))
    const bubbleData = Array.from({ length: bubbleCount }, () => ({
      t: Math.random(),
      x: (Math.random() - 0.5) * 2.6,
      phase: Math.random(),
      speed: 0.03 + Math.random() * 0.03,
    }))

    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 64
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.4, 'rgba(255,255,255,0.55)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)
    const sprite = new THREE.CanvasTexture(canvas)

    return { samples, streakGeo, bubbleGeo, streakData, bubbleData, sprite }
  }, [streakCount, bubbleCount])

  useFrame((_, delta) => {
    const p = cinematicScroll.smoothProgress
    const hidden = p > 0.82
    if (streakRef.current) streakRef.current.visible = !hidden
    if (bubbleRef.current) bubbleRef.current.visible = !hidden
    if (hidden) return

    const last = samples.length - 1
    const surge = 1 + smoothstep(p, 0.15, 0.55) * 0.9 // flow accelerates toward the outlet

    const write = (geo, data, yFor) => {
      const arr = geo.attributes.position.array
      for (let i = 0; i < data.length; i++) {
        const d = data[i]
        d.t += d.speed * surge * delta
        if (d.t >= 0.985) d.t = 0.02 + Math.random() * 0.05
        const f = d.t * last
        const i0 = Math.floor(f)
        const i1 = Math.min(i0 + 1, last)
        const frac = f - i0
        const a = samples[i0]
        const b = samples[i1]
        arr[i * 3] = a.x + (b.x - a.x) * frac + d.x
        arr[i * 3 + 1] = a.y + (b.y - a.y) * frac + yFor(d)
        arr[i * 3 + 2] = a.z + (b.z - a.z) * frac
      }
      geo.attributes.position.needsUpdate = true
    }

    write(streakGeo, streakData, (d) => d.y)
    write(bubbleGeo, bubbleData, (d) => {
      d.phase = (d.phase + delta * 0.16) % 1
      return -1.35 + d.phase * 1.05 // bubbles rise through the stream
    })
  })

  return (
    <>
      <points ref={streakRef} geometry={streakGeo}>
        <pointsMaterial
          color="#8fdcff"
          map={sprite}
          size={0.075}
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points ref={bubbleRef} geometry={bubbleGeo}>
        <pointsMaterial
          color="#cdeeff"
          map={sprite}
          size={0.05}
          sizeAttenuation
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  )
}

// ---------------------------------------------------------------------------
// STAGE 3 — the light gate. A camera-locked additive plane blooms exactly as
// the camera crosses the pipe mouth, masking the path hand-off. Cheaper and
// softer than any post-processing pass.
// ---------------------------------------------------------------------------
function LightGate() {
  const meshRef = useRef()
  const { camera } = useThree()
  const fwd = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const p = cinematicScroll.smoothProgress
    const strength = bell(p, EXIT_P, 0.075)
    mesh.visible = strength > 0.01
    if (!mesh.visible) return
    camera.getWorldDirection(fwd)
    mesh.position.copy(camera.position).addScaledVector(fwd, 1.1)
    mesh.quaternion.copy(camera.quaternion)
    mesh.material.opacity = strength * 0.78
  })

  return (
    <mesh ref={meshRef} visible={false} renderOrder={999}>
      <planeGeometry args={[6, 4]} />
      <meshBasicMaterial
        color="#cfe6f7"
        transparent
        opacity={0}
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

// ---------------------------------------------------------------------------
// STAGE 4–5 — the kitchen. Counter with a true cut-out, under-mount steel
// basin, chrome gooseneck tap, backsplash and window light. Procedural,
// low-poly, premium materials.
// ---------------------------------------------------------------------------
const stoneMat = { color: '#b3bac0', metalness: 0.05, roughness: 0.62, envMapIntensity: 0.3 }

function Kitchen({ mobile }) {
  const groupRef = useRef()
  const streamRef = useRef()
  const streamMatRef = useRef()
  const foamRef = useRef()
  const rippleRefs = useRef([])
  const windowLightRef = useRef()
  const fillLightRef = useRef()

  const { spoutGeo, streamGeo, streamTex, windowTex } = useMemo(() => {
    const neck = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.4, -43.7),
      new THREE.Vector3(0, 1.63, -43.66),
      new THREE.Vector3(0, 1.7, -43.5),
      new THREE.Vector3(0, 1.62, -43.36),
      new THREE.Vector3(0, 1.53, -43.33),
    ])
    const spoutGeo = new THREE.TubeGeometry(neck, 32, 0.034, 12, false)

    const streamGeo = new THREE.CylinderGeometry(0.016, 0.026, 1.07, 10, 1, true)
    streamGeo.translate(0, -0.535, 0) // anchor at the aerator so it grows downward

    const streamTex = makeStreakTexture(128, 50, true)
    streamTex.repeat.set(2, 3)
    const windowTex = makeWindowTexture()
    return { spoutGeo, streamGeo, streamTex, windowTex }
  }, [])

  useFrame((state, delta) => {
    const p = cinematicScroll.smoothProgress
    const group = groupRef.current
    if (!group) return
    group.visible = p > 0.45
    if (!group.visible) return

    const reveal = smoothstep(p, REVEAL_START, REVEAL_END)
    const pour = smoothstep(p, POUR_START, POUR_END)
    const t = state.clock.elapsedTime

    if (windowLightRef.current) windowLightRef.current.intensity = reveal * 13
    if (fillLightRef.current) fillLightRef.current.intensity = reveal * 5

    // The pour: a thin, confident stream — no spectacle.
    streamTex.offset.y -= delta * 2.4
    if (streamRef.current) {
      streamRef.current.visible = pour > 0.01
      streamRef.current.scale.y = Math.max(pour, 0.0001)
    }
    if (streamMatRef.current) streamMatRef.current.opacity = pour * 0.75

    // Ripples breathe outward from the impact point while water runs.
    rippleRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const phase = (t * 0.55 + i / 3) % 1
      const on = pour > 0.35
      mesh.visible = on
      if (!on) return
      const s = 1 + phase * 9
      mesh.scale.set(s, s, s)
      mesh.material.opacity = (1 - phase) * 0.4 * pour
    })
    if (foamRef.current) {
      foamRef.current.visible = pour > 0.3
      foamRef.current.material.opacity = pour * (0.16 + Math.sin(t * 9) * 0.05)
    }
  })

  return (
    <group ref={groupRef} visible={false}>
      {/* Floor and back wall */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -42]}>
        <planeGeometry args={[26, 22]} />
        <meshStandardMaterial color="#171b20" roughness={0.9} metalness={0.05} envMapIntensity={0.15} />
      </mesh>
      <mesh position={[0, 2.4, -44.65]}>
        <planeGeometry args={[14, 5]} />
        <meshStandardMaterial color="#a7b1ba" roughness={0.85} metalness={0} envMapIntensity={0.25} />
      </mesh>

      {/* Window — the light source the room believes in */}
      <mesh position={[-1.95, 2.1, -44.6]}>
        <planeGeometry args={[1.7, 1.35]} />
        <meshBasicMaterial map={windowTex} toneMapped={false} />
      </mesh>
      {[-1.95].map((x) => (
        <group key={x}>
          <mesh position={[x, 2.1, -44.58]}>
            <boxGeometry args={[0.045, 1.35, 0.02]} />
            <meshStandardMaterial color="#2c3238" roughness={0.6} />
          </mesh>
          <mesh position={[x, 2.1, -44.58]}>
            <boxGeometry args={[1.7, 0.045, 0.02]} />
            <meshStandardMaterial color="#2c3238" roughness={0.6} />
          </mesh>
        </group>
      ))}
      <pointLight ref={windowLightRef} position={[-2.1, 2.1, -42.9]} color="#e9f2f9" intensity={0} distance={15} decay={1.6} />
      <pointLight ref={fillLightRef} position={[2.5, 2.3, -39.6]} color="#9fc2dc" intensity={0} distance={13} decay={1.7} />

      {/* Cabinets (handleless, matte) */}
      <mesh position={[0, 0.44, -43.45]}>
        <boxGeometry args={[7, 0.85, 2.3]} />
        <meshStandardMaterial color="#2e343b" roughness={0.75} metalness={0.1} envMapIntensity={0.3} />
      </mesh>

      {/* Stone counter, built as four slabs so the sink is a real cut-out */}
      <mesh position={[-2.125, 0.88, -43.4]}>
        <boxGeometry args={[2.75, 0.14, 2.4]} />
        <meshStandardMaterial {...stoneMat} />
      </mesh>
      <mesh position={[2.125, 0.88, -43.4]}>
        <boxGeometry args={[2.75, 0.14, 2.4]} />
        <meshStandardMaterial {...stoneMat} />
      </mesh>
      <mesh position={[0, 0.88, -44.1125]}>
        <boxGeometry args={[1.5, 0.14, 0.975]} />
        <meshStandardMaterial {...stoneMat} />
      </mesh>
      <mesh position={[0, 0.88, -42.4375]}>
        <boxGeometry args={[1.5, 0.14, 0.475]} />
        <meshStandardMaterial {...stoneMat} />
      </mesh>

      {/* Under-mount stainless basin (interior faces) */}
      <mesh position={[0, 0.675, -43.15]}>
        <boxGeometry args={[1.5, 0.55, 0.95]} />
        <meshStandardMaterial
          color="#aeb6bd"
          metalness={0.85}
          roughness={0.3}
          envMapIntensity={0.9}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.406, -43.15]}>
        <circleGeometry args={[0.05, 20]} />
        <meshStandardMaterial color="#3c4248" metalness={0.8} roughness={0.35} />
      </mesh>

      {/* Chrome gooseneck tap */}
      <group>
        <mesh position={[0, 1.17, -43.7]}>
          <cylinderGeometry args={[0.05, 0.058, 0.5, 16]} />
          <meshStandardMaterial color="#d9dfe4" metalness={1} roughness={0.12} envMapIntensity={1.25} />
        </mesh>
        <mesh geometry={spoutGeo}>
          <meshStandardMaterial color="#d9dfe4" metalness={1} roughness={0.12} envMapIntensity={1.25} />
        </mesh>
        <mesh position={[0, 1.5, -43.33]}>
          <cylinderGeometry args={[0.03, 0.03, 0.06, 12]} />
          <meshStandardMaterial color="#c3cad0" metalness={1} roughness={0.2} envMapIntensity={1.1} />
        </mesh>
        {/* Lever */}
        <mesh position={[0.09, 1.44, -43.7]} rotation={[0, 0, -0.55]}>
          <cylinderGeometry args={[0.014, 0.014, 0.16, 10]} />
          <meshStandardMaterial color="#d9dfe4" metalness={1} roughness={0.14} envMapIntensity={1.2} />
        </mesh>
        {/* Base plate */}
        <mesh position={[0, 0.955, -43.7]}>
          <cylinderGeometry args={[0.085, 0.095, 0.02, 20]} />
          <meshStandardMaterial color="#c9d0d6" metalness={1} roughness={0.18} envMapIntensity={1.1} />
        </mesh>
      </group>

      {/* The pour */}
      <mesh ref={streamRef} geometry={streamGeo} position={[0, 1.48, -43.33]} visible={false}>
        <meshStandardMaterial
          ref={streamMatRef}
          color="#bfe4f8"
          emissive="#7ec6ea"
          emissiveIntensity={0.25}
          metalness={0}
          roughness={0.1}
          transparent
          opacity={0}
          map={streamTex}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Impact: foam point + expanding ripples */}
      <mesh ref={foamRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.412, -43.33]} visible={false}>
        <circleGeometry args={[0.045, 16]} />
        <meshBasicMaterial color="#e8f6ff" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(el) => (rippleRefs.current[i] = el)}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.41 + i * 0.002, -43.33]}
          visible={false}
        >
          <ringGeometry args={[0.03, 0.04, 28]} />
          <meshBasicMaterial color="#cfeaf8" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}

      {/* Quiet shelf props — believable, never cluttered */}
      {!mobile && (
        <group>
          <mesh position={[1.75, 1.98, -44.45]}>
            <boxGeometry args={[2.2, 0.04, 0.28]} />
            <meshStandardMaterial color="#8a7f70" roughness={0.6} metalness={0.05} />
          </mesh>
          <mesh position={[1.3, 2.09, -44.45]}>
            <cylinderGeometry args={[0.055, 0.05, 0.14, 14]} />
            <meshStandardMaterial color="#e7e3da" roughness={0.5} />
          </mesh>
          <mesh position={[1.62, 2.08, -44.45]}>
            <cylinderGeometry args={[0.05, 0.046, 0.12, 14]} />
            <meshStandardMaterial color="#c4cdd2" roughness={0.5} />
          </mesh>
        </group>
      )}
    </group>
  )
}

// ---------------------------------------------------------------------------
// STAGE 2 — the camera rig. Owns progress smoothing, the path hand-off,
// look-at blending, parallax, and the global lighting/fog crossfade.
// ---------------------------------------------------------------------------
function CameraRig({ mobile }) {
  const { camera, scene } = useThree()
  const keyLightRef = useRef()
  const accentLightRef = useRef()
  const ambientRef = useRef()
  const smoothed = useRef({ x: 0, y: 0 })
  const tmp = useMemo(
    () => ({
      pos: new THREE.Vector3(),
      look: new THREE.Vector3(),
      ahead: new THREE.Vector3(),
      bgDark: new THREE.Color('#0b0d10'),
      bgLight: new THREE.Color('#141a21'),
      bg: new THREE.Color('#0b0d10'),
    }),
    []
  )

  useFrame((state, delta) => {
    // Ease the raw scrub once, here; every other system reads the result.
    const target = cinematicScroll.progress
    const k = 1 - Math.exp(-delta * 7)
    cinematicScroll.smoothProgress += (target - cinematicScroll.smoothProgress) * k
    const p = cinematicScroll.smoothProgress

    // Pointer parallax — subtle, desktop only, heavily damped.
    const px = mobile ? 0 : cinematicScroll.mouseX * 0.26
    const py = mobile ? 0 : cinematicScroll.mouseY * 0.15
    smoothed.current.x += (px - smoothed.current.x) * 0.04
    smoothed.current.y += (py - smoothed.current.y) * 0.04

    // Idle breathing so the load state never freezes.
    const breathe = Math.sin(state.clock.elapsedTime * 0.5) * 0.05

    if (p < EXIT_P) {
      const t = p / EXIT_P
      pipePath.getPointAt(t, tmp.pos)
      pipePath.getPointAt(Math.min(t + 0.08, 1), tmp.look)
    } else {
      const t = (p - EXIT_P) / (1 - EXIT_P)
      kitchenPath.getPointAt(t, tmp.pos)
      kitchenPath.getPointAt(Math.min(t + 0.12, 1), tmp.ahead)
      // Settle the gaze onto the tap as the kitchen resolves.
      const gaze = smoothstep(p, 0.7, 0.85)
      tmp.look.copy(tmp.ahead).lerp(FAUCET_LOOK, gaze)
    }

    camera.position.set(
      tmp.pos.x + smoothed.current.x,
      tmp.pos.y + smoothed.current.y + breathe * (1 - smoothstep(p, 0.6, 0.8) * 0.6),
      tmp.pos.z
    )
    camera.lookAt(tmp.look.x + smoothed.current.x * 0.35, tmp.look.y + smoothed.current.y * 0.3, tmp.look.z)

    // Global crossfade: cold pressurised dark → soft domestic light.
    const reveal = smoothstep(p, REVEAL_START, REVEAL_END)
    if (keyLightRef.current) {
      keyLightRef.current.position.set(0.6, 1.6, tmp.pos.z - 4)
      keyLightRef.current.intensity = 30 * (1 - reveal)
    }
    if (accentLightRef.current) {
      accentLightRef.current.position.set(-1.2, -1.2, tmp.pos.z - 9)
      accentLightRef.current.intensity = 20 * (1 - reveal)
    }
    if (ambientRef.current) ambientRef.current.intensity = 0.22 + reveal * 0.24
    if (scene.fog) {
      scene.fog.near = THREE.MathUtils.lerp(7, 16, reveal)
      scene.fog.far = THREE.MathUtils.lerp(30, 85, reveal)
    }
    tmp.bg.copy(tmp.bgDark).lerp(tmp.bgLight, reveal)
    if (scene.background?.isColor) scene.background.copy(tmp.bg)
    if (scene.fog) scene.fog.color.copy(tmp.bg)
  })

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.22} color="#31404f" />
      <pointLight ref={keyLightRef} distance={26} decay={1.8} color="#dbe7f4" intensity={30} />
      <pointLight ref={accentLightRef} distance={22} decay={1.8} color="#49b7f0" intensity={20} />
    </>
  )
}

export default function PipeScene({ active = true, mobile = false }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, mobile ? 1.3 : 1.75]}
      camera={{ fov: 62, near: 0.1, far: 90, position: [0, -0.15, 6] }}
      gl={{
        antialias: !mobile,
        powerPreference: 'high-performance',
        alpha: false,
      }}
      shadows={false}
      className="h-full w-full"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <color attach="background" args={['#0b0d10']} />
      <fog attach="fog" args={['#0b0d10', 7, 30]} />
      <StudioEnv />
      <PipeRun mobile={mobile} />
      <FlowParticles mobile={mobile} />
      <LightGate />
      <Kitchen mobile={mobile} />
      <CameraRig mobile={mobile} />
    </Canvas>
  )
}
