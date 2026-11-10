import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { mainland, shapes, sampleInterior, illustrativeNodes, nearestLinks, rng } from '../lib/geo'

/* ------------------------------------------------------------------ */
/* Shaders                                                             */
/* ------------------------------------------------------------------ */

const pointsVertex = /* glsl */ `
  attribute float aRand;
  uniform float uTime;
  uniform float uSize;
  uniform float uReveal;
  uniform float uPixelRatio;
  uniform float uTwinkle;
  varying float vAlpha;
  varying float vRand;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float tw = 0.5 + 0.5 * sin(uTime * (0.5 + aRand * 1.8) + aRand * 40.0);
    // revelação radial a partir do centro do território
    float reveal = clamp(uReveal * 1.6 - length(position.xy) + 0.2, 0.0, 1.0);
    vAlpha = mix(1.0, 0.25 + 0.75 * pow(tw, 3.0), uTwinkle) * reveal;
    vRand = aRand;
    gl_PointSize = uSize * (0.55 + aRand * 0.9) * uPixelRatio * (3.0 / -mv.z);
  }
`

const pointsFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vRand;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a = pow(a, 1.6);
    vec3 c = mix(uColorA, uColorB, vRand);
    gl_FragColor = vec4(c, a * vAlpha * uOpacity);
  }
`

const arcVertex = /* glsl */ `
  attribute float aT;
  attribute float aOff;
  varying float vT;
  varying float vOff;
  void main() {
    vT = aT; vOff = aOff;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const arcFragment = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;
  uniform vec3 uColor;
  uniform vec3 uHead;
  varying float vT;
  varying float vOff;
  void main() {
    float speed = 0.22 + fract(vOff * 7.31) * 0.18;
    float head = fract(uTime * speed + vOff);
    float d = vT - head;
    float trail = smoothstep(-0.28, 0.0, d) * (1.0 - step(0.0, d));
    float base = 0.22;
    float a = (base + trail * 1.4) * uReveal;
    vec3 c = mix(uColor, uHead, trail);
    gl_FragColor = vec4(c, a);
  }
`

const haloVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
const haloFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float a = pow(smoothstep(1.0, 0.0, d), 2.2);
    gl_FragColor = vec4(uColor, a * uOpacity);
  }
`

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const ELECTRIC = new THREE.Color('#2f7bff')
const CYAN = new THREE.Color('#5fd8ff')
const WHITE = new THREE.Color('#dff1ff')

/** Reamostra o contorno em espaçamento uniforme (para o brilho da borda). */
function resample(ring, step) {
  const out = []
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]
    const b = ring[(i + 1) % ring.length]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.max(1, Math.floor(len / step))
    for (let k = 0; k < n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n])
  }
  return out
}

function makePointsMaterial({ size, colorA = ELECTRIC, colorB = CYAN, opacity = 1, twinkle = 1 }) {
  return new THREE.ShaderMaterial({
    vertexShader: pointsVertex,
    fragmentShader: pointsFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: size },
      uReveal: { value: 0 },
      uPixelRatio: { value: 1 },
      uTwinkle: { value: twinkle },
      uColorA: { value: colorA },
      uColorB: { value: colorB },
      uOpacity: { value: opacity },
    },
  })
}

function pointsGeometry(pts, z, seed) {
  const r = rng(seed)
  const pos = new Float32Array(pts.length * 3)
  const rand = new Float32Array(pts.length)
  pts.forEach((p, i) => {
    pos[i * 3] = p[0]
    pos[i * 3 + 1] = p[1]
    pos[i * 3 + 2] = typeof z === 'function' ? z(r) : z
    rand[i] = r()
  })
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('aRand', new THREE.BufferAttribute(rand, 1))
  return g
}

/* ------------------------------------------------------------------ */
/* Cena                                                                */
/* ------------------------------------------------------------------ */

const DEPTH = 0.09

function BrazilScene({ quality, animate, pointer }) {
  const group = useRef()
  const { gl } = useThree()
  const start = useRef(null)

  const built = useMemo(() => {
    // Volume (extrusão) do território
    const shape = new THREE.Shape(mainland.slice(0, -1).map(([x, y]) => new THREE.Vector2(x, y)))
    const extrude = new THREE.ExtrudeGeometry(shape, { depth: DEPTH, bevelEnabled: false, curveSegments: 1 })
    extrude.translate(0, 0, -DEPTH)

    // Contornos (continente + ilhas costeiras), topo e camadas de profundidade
    const outlineGeos = shapes.map((r) => {
      const g = new THREE.BufferGeometry().setFromPoints(r.map(([x, y]) => new THREE.Vector3(x, y, 0.002)))
      return g
    })

    // Borda luminosa (pontos densos ao longo do contorno)
    const edge = pointsGeometry(resample(mainland, quality === 'low' ? 0.012 : 0.007), 0.004, 3)

    // Partículas internas
    const interior = pointsGeometry(sampleInterior(quality === 'low' ? 0.05 : 0.034, 0.6, 9), 0.006, 5)

    // Poeira flutuante
    const r = rng(42)
    const dust = []
    for (let i = 0; i < (quality === 'low' ? 90 : 220); i++) dust.push([(r() - 0.5) * 3, (r() - 0.5) * 3])
    const dustGeo = pointsGeometry(dust, (rr) => -0.6 + rr() * 1.4, 11)

    // Nós e conexões ilustrativos
    const nodes = illustrativeNodes(quality === 'low' ? 11 : 16, 21, 0.24)
    const links = nearestLinks(nodes, 2)
    const SEG = 40
    const arcPos = []
    const arcT = []
    const arcOff = []
    const lr = rng(77)
    links.forEach(([i, j]) => {
      const a = new THREE.Vector3(nodes[i][0], nodes[i][1], 0.01)
      const b = new THREE.Vector3(nodes[j][0], nodes[j][1], 0.01)
      const dist = a.distanceTo(b)
      const mid = a.clone().add(b).multiplyScalar(0.5)
      mid.z = 0.08 + dist * 0.55
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b)
      const pts = curve.getPoints(SEG)
      const off = lr()
      for (let k = 0; k < SEG; k++) {
        arcPos.push(pts[k].x, pts[k].y, pts[k].z, pts[k + 1].x, pts[k + 1].y, pts[k + 1].z)
        arcT.push(k / SEG, (k + 1) / SEG)
        arcOff.push(off, off)
      }
    })
    const arcs = new THREE.BufferGeometry()
    arcs.setAttribute('position', new THREE.Float32BufferAttribute(arcPos, 3))
    arcs.setAttribute('aT', new THREE.Float32BufferAttribute(arcT, 1))
    arcs.setAttribute('aOff', new THREE.Float32BufferAttribute(arcOff, 1))

    const nodeGeo = pointsGeometry(nodes, 0.012, 13)

    return { extrude, outlineGeos, edge, interior, dustGeo, arcs, nodeGeo, nodes }
  }, [quality])

  const mats = useMemo(() => {
    const arcMat = new THREE.ShaderMaterial({
      vertexShader: arcVertex,
      fragmentShader: arcFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uReveal: { value: 0 }, uColor: { value: ELECTRIC }, uHead: { value: WHITE } },
    })
    const haloMat = new THREE.ShaderMaterial({
      vertexShader: haloVertex,
      fragmentShader: haloFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color('#1446c8') }, uOpacity: { value: 0 } },
    })
    return {
      edge: makePointsMaterial({ size: 3.2, colorA: ELECTRIC, colorB: CYAN, twinkle: 0.35 }),
      interior: makePointsMaterial({ size: 3.2, colorA: new THREE.Color('#2a6bff'), colorB: CYAN, opacity: 1 }),
      dust: makePointsMaterial({ size: 2.2, colorA: ELECTRIC, colorB: WHITE, opacity: 0.45 }),
      nodes: makePointsMaterial({ size: 26, colorA: CYAN, colorB: WHITE, twinkle: 0.5 }),
      arc: arcMat,
      halo: haloMat,
      outline: [0, 1, 2, 3].map(
        (k) =>
          new THREE.LineBasicMaterial({
            color: k === 0 ? '#7fc4ff' : '#2f7bff',
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
      ),
      body: new THREE.MeshStandardMaterial({
        color: '#0b1c48',
        emissive: '#06122f',
        metalness: 0.55,
        roughness: 0.38,
        transparent: true,
        opacity: 0,
      }),
    }
  }, [])

  useEffect(
    () => () => {
      Object.values(built).forEach((g) => (Array.isArray(g) ? g.forEach((x) => x.dispose?.()) : g.dispose?.()))
      Object.values(mats).forEach((m) => (Array.isArray(m) ? m.forEach((x) => x.dispose()) : m.dispose()))
    },
    [built, mats],
  )

  const pointMats = [mats.edge, mats.interior, mats.dust, mats.nodes]
  const layerOpacity = [0.95, 0.38, 0.2, 0.1]

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (start.current === null) start.current = t
    const e = animate ? Math.min(1, (t - start.current) / 2.4) : 1
    const ease = 1 - Math.pow(1 - e, 3)
    const pr = gl.getPixelRatio()

    pointMats.forEach((m) => {
      m.uniforms.uTime.value = animate ? t : 2
      m.uniforms.uReveal.value = ease
      m.uniforms.uPixelRatio.value = pr
    })
    mats.arc.uniforms.uTime.value = animate ? t : 0.4
    mats.arc.uniforms.uReveal.value = Math.max(0, (ease - 0.55) / 0.45)
    mats.halo.uniforms.uOpacity.value = 0.55 * ease
    mats.body.opacity = 0.92 * ease
    mats.outline.forEach((m, k) => (m.opacity = layerOpacity[k] * Math.min(1, ease * 1.4 - k * 0.1)))

    const g = group.current
    if (!g) return
    // Parallax suave com o mouse + flutuação
    const px = animate ? pointer.current.x : 0
    const py = animate ? pointer.current.y : 0
    const targetX = -0.52 + py * 0.12
    const targetY = 0.18 + px * 0.22
    const k = 1 - Math.pow(0.001, delta)
    g.rotation.x += (targetX - g.rotation.x) * k * 0.6
    g.rotation.y += (targetY - g.rotation.y) * k * 0.6
    g.rotation.z = -0.06
    g.position.y = animate ? Math.sin(t * 0.6) * 0.035 : 0
    const s = 0.86 + 0.14 * ease
    g.scale.setScalar(s)
  })

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[-2, 3, 4]} intensity={1.1} color="#9cc3ff" />
      <pointLight position={[1.6, -1.2, 1.2]} intensity={6} distance={6} color="#2f7bff" />

      <mesh position={[0.05, 0, -0.9]} scale={4.2} material={mats.halo}>
        <planeGeometry args={[1, 1]} />
      </mesh>

      <group ref={group} rotation={[-0.52, 0.18, -0.06]}>
        <mesh geometry={built.extrude} material={mats.body} />

        {built.outlineGeos.map((g, i) =>
          [0, 1, 2, 3].map((k) => (
            <lineLoop key={`${i}-${k}`} geometry={g} material={mats.outline[k]} position={[0, 0, k === 0 ? 0 : -DEPTH - k * 0.11]} />
          )),
        )}

        <points geometry={built.edge} material={mats.edge} />
        <points geometry={built.interior} material={mats.interior} />
        <lineSegments geometry={built.arcs} material={mats.arc} />
        <points geometry={built.nodeGeo} material={mats.nodes} />
        <Pulses nodes={built.nodes} animate={animate} />
      </group>

      <points geometry={built.dustGeo} material={mats.dust} />
    </>
  )
}

/** Anéis de pulso em alguns nós (ilustrativos). */
function Pulses({ nodes, animate }) {
  const refs = useRef([])
  const picked = useMemo(() => nodes.filter((_, i) => i % 3 === 0), [nodes])
  const geo = useMemo(() => new THREE.RingGeometry(0.9, 1, 48), [])
  const mats = useMemo(
    () =>
      picked.map(
        () =>
          new THREE.MeshBasicMaterial({
            color: '#5fd8ff',
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide,
          }),
      ),
    [picked],
  )
  useEffect(() => () => (geo.dispose(), mats.forEach((m) => m.dispose())), [geo, mats])
  useFrame(({ clock }) => {
    if (!animate) return
    const t = clock.elapsedTime
    refs.current.forEach((m, i) => {
      if (!m) return
      const p = (t * 0.45 + i * 0.37) % 1
      m.scale.setScalar(0.015 + p * 0.09)
      mats[i].opacity = (1 - p) * 0.7 * Math.min(1, t / 2.5)
    })
  })
  return picked.map((n, i) => (
    <mesh key={i} ref={(el) => (refs.current[i] = el)} geometry={geo} material={mats[i]} position={[n[0], n[1], 0.012]} scale={0.001} />
  ))
}

/* ------------------------------------------------------------------ */
/* Componente público                                                  */
/* ------------------------------------------------------------------ */

export default function BrazilMap3D({ reducedMotion = false, className = '' }) {
  const wrap = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })
  const [visible, setVisible] = useState(true)
  const quality = useMemo(() => {
    const small = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
    const weak = typeof navigator !== 'undefined' && (navigator.hardwareConcurrency || 8) <= 4
    return small || weak ? 'low' : 'high'
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reducedMotion])

  // Pausa a renderização quando o mapa sai da tela (economia de bateria/GPU)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '100px' })
    if (wrap.current) io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrap} className={className} aria-hidden="true">
      <Canvas
        frameloop={reducedMotion ? 'demand' : visible ? 'always' : 'never'}
        dpr={quality === 'low' ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0, 3.4], fov: 36 }}
        gl={{ antialias: quality !== 'low', alpha: true, powerPreference: 'high-performance' }}
      >
        <BrazilScene quality={quality} animate={!reducedMotion} pointer={pointer} />
      </Canvas>
    </div>
  )
}
