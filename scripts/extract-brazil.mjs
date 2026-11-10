// Extrai o contorno real do Brasil (Natural Earth 1:50m via world-atlas)
// e grava em src/data/brazil.json. Executar: npm run geo
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { feature } from 'topojson-client'

const require = createRequire(import.meta.url)
const topo = JSON.parse(readFileSync(require.resolve('world-atlas/countries-50m.json'), 'utf8'))
const countries = feature(topo, topo.objects.countries)
const br = countries.features.find((f) => f.id === '076' || f.properties?.name === 'Brazil')
if (!br) throw new Error('Brasil não encontrado no atlas')

const polys = br.geometry.type === 'Polygon' ? [br.geometry.coordinates] : br.geometry.coordinates
// Mantém apenas o anel externo de cada polígono; descarta ilhas minúsculas (< 4 pontos)
const rings = polys
  .map((p) => p[0].map(([x, y]) => [+x.toFixed(3), +y.toFixed(3)]))
  .filter((r) => r.length >= 4)
  .sort((a, b) => b.length - a.length)

writeFileSync(new URL('../src/data/brazil.json', import.meta.url), JSON.stringify({ source: 'Natural Earth 1:50m (domínio público) via world-atlas', rings }))
console.log('Anéis:', rings.length, 'pontos no continente:', rings[0].length)
