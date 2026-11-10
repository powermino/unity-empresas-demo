import { lazy, Suspense, useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { gsap } from '../../lib/gsap'
import { hasWebGL } from '../../lib/webgl'
import { site, whatsappLink } from '../../config/site'
import BrazilMapSVG from '../BrazilMapSVG'
import WhatsAppIcon from '../ui/WhatsAppIcon'

// O 3D é carregado sob demanda: o texto do hero aparece antes do Three.js.
const BrazilMap3D = lazy(() => import('../BrazilMap3D'))

const lines = [
  { text: 'Conectando empresas.', gradient: false },
  { text: 'Impulsionando negócios.', gradient: true },
]

export default function Hero({ reduced }) {
  const root = useRef(null)
  const [webgl, setWebgl] = useState(null)
  useEffect(() => setWebgl(hasWebGL()), [])

  const words = useMemo(() => lines.map((l) => ({ ...l, words: l.text.split(' ') })), [])

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 })
      tl.from('.hero-badge', { y: 16, opacity: 0, duration: 1 })
        .from('.hero-word', { yPercent: 110, rotate: 4, duration: 1.3, stagger: 0.07 }, '-=0.7')
        .from('.hero-sub', { y: 20, opacity: 0, duration: 1.1 }, '-=0.9')
        .from('.hero-cta', { y: 18, opacity: 0, duration: 1 }, '-=0.85')
        .from('.hero-map', { opacity: 0, scale: 0.94, duration: 2, ease: 'power3.out' }, 0.1)
        .from('.hero-foot', { opacity: 0, duration: 1 }, '-=1')

      // Parallax de saída ao rolar
      gsap.to('.hero-copy', {
        yPercent: -18,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero-map', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  const fallback = <BrazilMapSVG variant="dark" animate={!reduced} className="h-full w-full p-[8%]" />

  return (
    <section
      id="inicio"
      ref={root}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-navy-950 text-white"
      aria-labelledby="hero-title"
    >
      {/* Atmosfera */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-lines-dark [mask-image:radial-gradient(ellipse_at_70%_45%,#000_10%,transparent_70%)]" />
        <div className="absolute -right-[20%] top-[5%] h-[80vmax] w-[80vmax] rounded-full bg-[radial-gradient(circle,rgba(31,107,255,.28),transparent_60%)]" />
        <div className="absolute -left-[30%] -top-[30%] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(24,48,107,.55),transparent_65%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-navy-950" />
      </div>

      <div className="container-site relative grid flex-1 grid-cols-1 items-center gap-6 pb-24 pt-28 sm:pt-32 lg:grid-cols-12 lg:gap-0 lg:pb-16">
        {/* Texto */}
        <div className="hero-copy relative z-10 lg:col-span-6 xl:col-span-6">
          <p className="hero-badge inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/80 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-electric-glow animate-ping-soft" />
              <span className="relative h-2 w-2 rounded-full bg-electric-glow" />
            </span>
            {site.tagline} · desde 2013
          </p>

          <h1 id="hero-title" className="h-display mt-7 text-[clamp(2.2rem,5.1vw,4.6rem)] uppercase">
            {words.map((l, li) => (
              <span key={li} className="block">
                {l.words.map((w, wi) => (
                  <span key={wi} className="-mt-[0.16em] inline-block overflow-hidden pb-[0.08em] pt-[0.16em] align-top">
                    <span className={`hero-word inline-block ${l.gradient ? 'text-gradient' : ''}`}>
                      {w}
                      {wi < l.words.length - 1 ? ' ' : ''}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p className="hero-sub mt-7 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
            Soluções de conectividade e telecomunicações TIM Empresas para o seu negócio: telefonia móvel, fibra, internet
            sem fio e telemetria, com a consultoria de quem é representante oficial da operadora.
          </p>

          <div className="hero-cta mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#solucoes" className="btn-primary group">
              Conheça nossas soluções
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-ghost-dark">
              <WhatsAppIcon className="h-4 w-4" /> Fale com um especialista
            </a>
          </div>
        </div>

        {/* Mapa 3D */}
        <div className="relative mx-auto aspect-square w-full max-w-[520px] sm:max-w-[600px] lg:absolute lg:right-[-4%] lg:top-1/2 lg:w-[58%] lg:max-w-[860px] lg:-translate-y-1/2">
          <div className="hero-map h-full w-full">
          {webgl === false ? (
            fallback
          ) : webgl === null ? null : (
            <Suspense fallback={<div className="h-full w-full opacity-30">{fallback}</div>}>
              <BrazilMap3D reducedMotion={reduced} className="h-full w-full" />
            </Suspense>
          )}
          </div>
          <p className="pointer-events-none absolute bottom-[6%] right-[8%] text-[10px] uppercase tracking-[0.2em] text-white/30">
            Conexões ilustrativas
          </p>
        </div>
      </div>

      <div className="hero-foot container-site relative z-10 hidden pb-8 sm:flex sm:items-end sm:justify-between">
        <a href="#autoridade" className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-white/45 hover:text-white">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition-colors group-hover:border-white/40">
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </span>
          Role para explorar
        </a>
        <p className="max-w-xs text-right text-xs text-white/40">{site.slogan}</p>
      </div>
    </section>
  )
}
