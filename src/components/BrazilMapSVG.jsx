import { useId, useLayoutEffect, useMemo, useRef } from 'react'
import { toSvg, sampleInterior, illustrativeNodes, nearestLinks } from '../lib/geo'
import { gsap } from '../lib/gsap'

/**
 * Mapa do Brasil em SVG, com a mesma geometria real do mapa 3D.
 * variant="light": seção clara (Atuação). variant="dark": fallback do hero sem WebGL.
 * Linhas e nós são ILUSTRATIVOS — não indicam cidades ou cobertura.
 */
export default function BrazilMapSVG({ variant = 'light', animate = true, className = '', title }) {
  const root = useRef(null)
  const uid = useId().replace(/:/g, '')
  const dark = variant === 'dark'

  const data = useMemo(() => {
    const { width, height, path, map } = toSvg(600, 12)
    const dots = sampleInterior(0.045, 0.4, 4).map(map)
    const nodesN = illustrativeNodes(14, 33, 0.26)
    const nodes = nodesN.map(map)
    const links = nearestLinks(nodesN, 2).map(([i, j]) => {
      const [x1, y1] = nodes[i]
      const [x2, y2] = nodes[j]
      const mx = (x1 + x2) / 2
      const my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * 0.28
      return `M${x1.toFixed(1)},${y1.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`
    })
    return { width, height, path, dots, nodes, links }
  }, [])

  useLayoutEffect(() => {
    if (!animate || !root.current) return
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray('.map-link')
      lines.forEach((l) => {
        const len = l.getTotalLength()
        gsap.set(l, { strokeDasharray: `${len * 0.22} ${len}`, strokeDashoffset: len * 1.22 })
      })
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
      })
      tl.fromTo('.map-outline', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut' })
        .from('.map-fill', { opacity: 0, duration: 1.2 }, 0.4)
        .from('.map-dots', { opacity: 0, duration: 1.2 }, 0.8)
        .from('.map-node', { scale: 0, transformOrigin: 'center', stagger: 0.05, duration: 0.6, ease: 'back.out(2)' }, 1.1)
      lines.forEach((l, i) => {
        const len = l.getTotalLength()
        gsap.to(l, {
          strokeDashoffset: 0,
          duration: 2.4 + (i % 4) * 0.5,
          ease: 'none',
          repeat: -1,
          delay: 1.4 + (i % 7) * 0.35,
          repeatDelay: 0.6,
          onRepeat: () => gsap.set(l, { strokeDashoffset: len * 1.22 }),
        })
      })
    }, root)
    return () => ctx.revert()
  }, [animate])

  const c = dark
    ? { fill: `url(#g-fill-${uid})`, stroke: '#5aa2ff', dot: '#3b82ff', link: '#7cc8ff', node: '#bfe9ff', base: 'rgba(90,162,255,.16)' }
    : { fill: `url(#g-fill-${uid})`, stroke: '#1f6bff', dot: '#1f6bff', link: '#1f6bff', node: '#1f6bff', base: 'rgba(31,107,255,.14)' }

  return (
    <svg
      ref={root}
      viewBox={`0 0 ${data.width} ${data.height}`}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
    >
      <defs>
        <linearGradient id={`g-fill-${uid}`} x1="0" y1="0" x2="1" y2="1">
          {dark ? (
            <>
              <stop offset="0" stopColor="#10245c" />
              <stop offset="1" stopColor="#071436" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#eaf1ff" />
              <stop offset="1" stopColor="#d7e4ff" />
            </>
          )}
        </linearGradient>
        <filter id={`glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={dark ? 4 : 2.5} result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id={`clip-${uid}`}>
          <path d={data.path} />
        </clipPath>
      </defs>

      {/* camada de profundidade */}
      <path d={data.path} transform="translate(10 14)" fill={c.base} />
      <path className="map-fill" d={data.path} fill={c.fill} />

      <g className="map-dots" clipPath={`url(#clip-${uid})`} fill={c.dot} opacity={dark ? 0.55 : 0.28}>
        {data.dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 5 === 0 ? 1.6 : 1.1} />
        ))}
      </g>

      <path
        className="map-outline"
        d={data.path}
        pathLength={1}
        strokeDasharray={animate ? 1 : undefined}
        fill="none"
        stroke={c.stroke}
        strokeWidth={dark ? 1.6 : 1.4}
        strokeLinejoin="round"
        filter={`url(#glow-${uid})`}
      />

      <g fill="none" stroke={c.link} strokeWidth="1.1" opacity="0.28">
        {data.links.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <g fill="none" stroke={c.link} strokeWidth="2" strokeLinecap="round" filter={`url(#glow-${uid})`}>
        {data.links.map((d, i) => (
          <path key={i} className="map-link" d={d} strokeDasharray={animate ? undefined : 'none'} opacity={animate ? 1 : 0} />
        ))}
      </g>

      <g>
        {data.nodes.map(([x, y], i) => (
          <g key={i} className="map-node">
            <circle cx={x} cy={y} r="7" fill={c.node} opacity="0.15" />
            <circle cx={x} cy={y} r="3" fill={c.node} />
          </g>
        ))}
      </g>
    </svg>
  )
}
