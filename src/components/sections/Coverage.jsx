import { MapPin } from 'lucide-react'
import { units } from '../../config/site'
import SectionHeading from '../ui/SectionHeading'
import BrazilMapSVG from '../BrazilMapSVG'

export default function Coverage({ reduced }) {
  const cityCount = units.reduce((n, u) => n + u.cities.length, 0)

  return (
    <section id="atuacao" aria-labelledby="atuacao-title" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div aria-hidden="true" className="absolute -right-40 top-20 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(31,107,255,.09),transparent_65%)]" />
      <div className="container-site relative grid items-center gap-16 lg:grid-cols-2">
        <div>
          <SectionHeading
            id="atuacao-title"
            eyebrow="Conectividade no Brasil"
            title={
              <>
                Presença regional, <span className="text-gradient-blue">alcance nacional.</span>
              </>
            }
            text="A Unity atua como ponte entre empresas brasileiras e as soluções de telecomunicações da TIM, com unidades em diferentes regiões do país e atendimento próximo de quem decide."
          />

          <div data-reveal className="mt-10 flex items-center gap-4 rounded-2xl border border-electric/15 bg-electric/[0.04] p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-electric text-white">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-sm text-navy-800">
              <strong className="font-semibold">
                {units.length} estados e {cityCount} cidades
              </strong>{' '}
              com unidades listadas no site oficial da Unity.
            </p>
          </div>

          <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {units.map((u) => (
              <li key={u.uf} data-reveal className="flex gap-3 border-b border-navy-900/[0.06] pb-4">
                <span className="mt-0.5 w-8 shrink-0 font-display text-sm font-semibold text-electric">{u.uf}</span>
                <span>
                  <span className="block text-sm font-semibold text-navy-900">{u.state}</span>
                  <span className="block text-sm text-navy-700/65">{u.cities.join(' · ')}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <figure data-reveal className="relative">
          <div className="relative mx-auto max-w-[580px]">
            <BrazilMapSVG
              variant="light"
              animate={!reduced}
              className="h-auto w-full drop-shadow-[0_30px_40px_rgba(31,107,255,.18)]"
              title="Mapa do Brasil com conexões digitais ilustrativas"
            />
          </div>
          <figcaption className="mx-auto mt-6 max-w-md text-center text-xs leading-relaxed text-navy-700/50">
            Representação ilustrativa. Linhas e pontos não indicam localização de unidades nem área de cobertura. A
            disponibilidade de cada serviço depende da cobertura TIM no endereço.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
