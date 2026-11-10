import { ArrowUpRight, Check } from 'lucide-react'
import { solutions, process, whatsappLink } from '../../config/site'
import SectionHeading from '../ui/SectionHeading'
import Icon from '../ui/Icon'

function trackPointer(e) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

function SolutionCard({ s, index }) {
  return (
    <article
      data-reveal
      onPointerMove={trackPointer}
      className="shine group relative flex flex-col overflow-hidden rounded-[28px] border border-navy-900/[0.07] bg-white p-7 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_-30px_rgba(16,32,77,.35)] sm:p-9"
    >
      {/* brilho que segue o cursor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(500px circle at var(--mx) var(--my), rgba(31,107,255,.07), transparent 40%)' }}
      />

      <div className="relative flex items-start justify-between">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy-900 text-white transition-all duration-500 group-hover:bg-electric group-hover:shadow-glow">
          <Icon name={s.icon} className="h-6 w-6" strokeWidth={1.6} />
        </span>
        <span className="font-display text-sm font-medium text-navy-900/25">0{index + 1}</span>
      </div>

      <p className="relative mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-electric">{s.kind}</p>
      <h3 className="relative mt-2 font-display text-2xl font-semibold tracking-tight text-navy-900 sm:text-[1.75rem]">{s.name}</h3>
      <p className="relative mt-3 leading-relaxed text-navy-700/75">{s.summary}</p>

      <ul className="relative mt-7 space-y-3 border-t border-navy-900/[0.07] pt-6">
        {s.features.map((f) => (
          <li key={f} className="flex gap-3 text-[15px] text-navy-800/85">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-electric" aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>

      <div className="relative mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
        <span className="rounded-full bg-mist-100 px-3.5 py-1.5 text-xs font-medium text-navy-700">{s.highlight}</span>
        <a
          href={whatsappLink(s.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 transition-colors hover:text-electric"
          aria-label={`Saber mais sobre ${s.name} pelo WhatsApp`}
        >
          Saber mais
          <span className="grid h-8 w-8 place-items-center rounded-full border border-navy-900/10 transition-all duration-300 group-hover:rotate-45 group-hover:border-electric group-hover:bg-electric group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </a>
      </div>
    </article>
  )
}

export default function Solutions() {
  return (
    <section id="solucoes" aria-labelledby="solucoes-title" className="relative bg-mist-100 py-24 sm:py-32">
      <div aria-hidden="true" className="absolute inset-0 grid-lines-light [mask-image:linear-gradient(to_bottom,#000,transparent_40%)]" />
      <div className="container-site relative">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            id="solucoes-title"
            eyebrow="Soluções"
            title={
              <>
                Tecnologia TIM Empresas, <span className="text-gradient-blue">sob medida</span> para sua operação.
              </>
            }
          />
          <p data-reveal className="max-w-sm text-navy-700/70 lg:pb-2">
            Mais do que vender um plano: entendemos sua necessidade e desenhamos a solução ideal com você.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:gap-6">
          {solutions.map((s, i) => (
            <SolutionCard key={s.id} s={s} index={i} />
          ))}
        </div>

        <p data-reveal className="mt-6 text-xs text-navy-700/50">
          Planos, condições e disponibilidade conforme ofertas vigentes e cobertura da TIM. Consulte um especialista Unity.
        </p>

        {/* Processo */}
        <div className="mt-24">
          <p data-reveal className="eyebrow text-electric">O nosso trabalho</p>
          <ol className="mt-8 grid gap-px overflow-hidden rounded-[28px] border border-navy-900/[0.07] bg-navy-900/[0.07] md:grid-cols-3">
            {process.map((p, i) => (
              <li key={p.title} data-reveal className="relative bg-white p-8 sm:p-10">
                <span className="font-display text-5xl font-semibold text-electric/15">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-6 font-display text-xl font-semibold text-navy-900">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-navy-700/70">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
