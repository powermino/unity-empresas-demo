import { useLayoutEffect, useRef } from 'react'
import { ShieldCheck } from 'lucide-react'
import { gsap } from '../../lib/gsap'
import { stats } from '../../config/site'

const fmt = new Intl.NumberFormat('pt-BR')

function Counter({ stat, reduced }) {
  const el = useRef(null)

  useLayoutEffect(() => {
    if (stat.value == null || !el.current) return
    if (reduced) {
      el.current.textContent = fmt.format(stat.value)
      return
    }
    const obj = { v: 0 }
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        v: stat.value,
        duration: 2.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: el.current, start: 'top 90%', once: true },
        onUpdate: () => el.current && (el.current.textContent = fmt.format(Math.round(obj.v))),
      })
    })
    return () => ctx.revert()
  }, [stat.value, reduced])

  return (
    <div data-reveal className="group relative px-1 py-8 sm:px-8 lg:py-4">
      <p className="h-display flex items-baseline text-[clamp(2.8rem,6vw,4.75rem)] text-white">
        {stat.value == null ? (
          <span className="text-white/30" title="Preencher com dado verificado">—</span>
        ) : (
          <>
            <span className="text-electric-300">{stat.prefix}</span>
            <span ref={el} className="tabular-nums">
              {reduced ? fmt.format(stat.value) : '0'}
            </span>
            <span className="ml-1 text-[0.5em] text-white/80">{stat.suffix}</span>
          </>
        )}
      </p>
      <p className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-white/55">{stat.label}</p>
      {stat.note && <p className="mt-2 text-xs text-white/35">{stat.note}</p>}
    </div>
  )
}

export default function Authority({ reduced }) {
  return (
    <section id="autoridade" aria-labelledby="autoridade-title" className="relative overflow-hidden bg-navy-950 pb-24 pt-10 text-white sm:pb-32">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/40 to-transparent" />
      <div className="container-site">
        <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-12 lg:flex-row lg:items-end">
          <h2 id="autoridade-title" data-reveal className="h-display max-w-2xl text-3xl sm:text-4xl lg:text-5xl">
            Mais de uma década levando a <span className="text-gradient">TIM Empresas</span> ao seu negócio.
          </h2>
          <p data-reveal className="flex max-w-sm items-start gap-3 text-sm leading-relaxed text-white/60">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-electric-300" aria-hidden="true" />
            Representantes oficiais TIM Empresas. Escritório credenciado pela operadora TIM Brasil.
          </p>
        </div>

        <div className="grid grid-cols-2 divide-white/10 lg:grid-cols-4 lg:divide-x">
          {stats.map((s) => (
            <Counter key={s.label} stat={s} reduced={reduced} />
          ))}
        </div>
      </div>
    </section>
  )
}
