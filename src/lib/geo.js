import brazil from '../data/brazil.json'

/**
 * Projeção equiretangular com correção de latitude média (cos φ₀).
 * Para a extensão do Brasil ela preserva o contorno de forma reconhecível,
 * sem distorções perceptíveis.
 */
const LAT0 = -14.2
const K = Math.cos((LAT0 * Math.PI) / 180)

// Limites calculados pelo continente (ilhas oceânicas distantes ficam de fora)
const all = brazil.rings[0]
const minLon = Math.min(...all.map((p) => p[0]))
const maxLon = Math.max(...all.map((p) => p[0]))
const minLat = Math.min(...all.map((p) => p[1]))
const maxLat = Math.max(...all.map((p) => p[1]))
const cLon = (minLon + maxLon) / 2
const cLat = (minLat + maxLat) / 2

const W = (maxLon - minLon) * K
const H = maxLat - minLat

/** Coordenadas normalizadas: o eixo maior vai de -1 a 1, y para cima. */
const norm = 2 / Math.max(W, H)
export const project = ([lon, lat]) => [(lon - cLon) * K * norm, (lat - cLat) * norm]

export const aspect = W / H
export const rings = brazil.rings.map((r) => r.map(project))
export const mainland = rings[0]

/** Rings sem o ponto final repetido, com ilhas muito pequenas descartadas. */
export const shapes = rings
  .filter((r) => area(r) > 0.00015 && r.every(([x, y]) => Math.abs(x) <= 1.02 && Math.abs(y) <= 1.02))
  .map((r) => r.slice(0, -1))

function area(r) {
  let a = 0
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += (r[j][0] + r[i][0]) * (r[j][1] - r[i][1])
  return Math.abs(a / 2)
}

export function pointInRing([x, y], ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

export function rng(seed = 1) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Distribui pontos em grade com jitter dentro do território (uso visual). */
export function sampleInterior(step = 0.04, jitter = 0.5, seed = 7) {
  const r = rng(seed)
  const out = []
  const xs = mainland.map((p) => p[0])
  const ys = mainland.map((p) => p[1])
  for (let x = Math.min(...xs); x < Math.max(...xs); x += step) {
    for (let y = Math.min(...ys); y < Math.max(...ys); y += step) {
      const p = [x + (r() - 0.5) * step * jitter, y + (r() - 0.5) * step * jitter]
      if (pointInRing(p, mainland)) out.push(p)
    }
  }
  return out
}

/**
 * Nós ILUSTRATIVOS para as conexões luminosas. Não representam cidades
 * nem áreas atendidas — são posições aleatórias (semente fixa) no território.
 */
export function illustrativeNodes(count = 16, seed = 21, minDist = 0.22) {
  const r = rng(seed)
  const xs = mainland.map((p) => p[0])
  const ys = mainland.map((p) => p[1])
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
  const nodes = []
  let guard = 0
  while (nodes.length < count && guard++ < 5000) {
    const p = [x0 + r() * (x1 - x0), y0 + r() * (y1 - y0)]
    if (!pointInRing(p, mainland)) continue
    // margem da borda: o ponto e um pequeno anel em volta devem estar dentro
    const m = 0.06
    if (![[m, 0], [-m, 0], [0, m], [0, -m]].every(([dx, dy]) => pointInRing([p[0] + dx, p[1] + dy], mainland))) continue
    if (nodes.some((n) => Math.hypot(n[0] - p[0], n[1] - p[1]) < minDist)) continue
    nodes.push(p)
  }
  return nodes
}

/** Liga cada nó aos vizinhos mais próximos, sem duplicar arestas. */
export function nearestLinks(nodes, k = 2) {
  const seen = new Set()
  const links = []
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ j, d: Math.hypot(a[0] - b[0], a[1] - b[1]) }))
      .filter((o) => o.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, k)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`
        if (!seen.has(key)) {
          seen.add(key)
          links.push([i, j])
        }
      })
  })
  return links
}

/** Converte para o espaço de um viewBox SVG (y para baixo). */
const hx = Math.max(...mainland.map((p) => Math.abs(p[0])))
const hy = Math.max(...mainland.map((p) => Math.abs(p[1])))
export const halfExtent = [hx, hy]

export function toSvg(width, pad = 0) {
  const s = (width - pad * 2) / (2 * hx)
  const height = Math.round(2 * hy * s + pad * 2)
  const map = ([x, y]) => [width / 2 + x * s, height / 2 - y * s]
  const path = shapes
    .map((r) => 'M' + r.map((p) => map(p).map((v) => v.toFixed(1)).join(',')).join('L') + 'Z')
    .join('')
  return { width, height, path, map }
}
