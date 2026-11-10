import { ShieldCheck, Headset, Zap, Target, Eye, Gem } from 'lucide-react'
import { asset } from '../../config/site'

const pillars = [
  {
    icon: Target,
    title: 'Missão',
    text: 'Impulsionar empresas com soluções de comunicação inteligentes e um atendimento que resolve.',
  },
  {
    icon: Eye,
    title: 'Visão',
    text: 'Somos movidos pelo desejo de sermos reconhecidos como o melhor e maior representante comercial da marca TIM no Brasil.',
  },
  {
    icon: Gem,
    title: 'Valores',
    text: 'Transparência de um parceiro verdadeiro e agilidade, com um padrão de excelência focado no sucesso do cliente.',
  },
]

const diffs = [
  { icon: ShieldCheck, title: 'Segurança total', text: 'Parceiro validado pela TIM, da consultoria ao pós-venda.' },
  { icon: Headset, title: 'Atendimento especialista', text: 'Consultores que entendem a operação da sua empresa.' },
  { icon: Zap, title: 'Agilidade máxima', text: 'Acesso a canais diretos na TIM para resolver com rapidez.' },
]

export default function About() {
  return (
    <section id="sobre" aria-labelledby="sobre-title" className="relative overflow-hidden bg-navy-950 py-24 text-white sm:py-32">
      <div aria-hidden="true" className="absolute inset-0 grid-lines-dark [mask-image:radial-gradient(ellipse_at_20%_30%,#000,transparent_60%)]" />

      <div className="container-site relative">
        {/* Abertura editorial */}
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p data-reveal className="eyebrow text-electric-300">Sobre a Unity</p>
            <h2 id="sobre-title" data-reveal className="h-display mt-5 text-4xl sm:text-5xl lg:text-[3.6rem]">
              Desde 2013, a ponte entre empresas e a <span className="text-gradient">TIM.</span>
            </h2>
            <div data-reveal className="mt-8 space-y-5 text-base leading-relaxed text-white/65 sm:text-lg">
              <p>
                O Grupo Unity nasceu com o propósito de conectar empresas brasileiras às soluções de telecomunicações da
                TIM. Nossa proposta vai além de vender um plano: entendemos a sua necessidade e desenhamos a solução.
              </p>
              <p>
                Tudo isso com base em <strong className="font-semibold text-white">confiança, ética e resultados</strong>.
              </p>
            </div>
          </div>

          <figure data-reveal className="relative lg:col-span-7">
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 shadow-card">
              {/* a imagem original tem moldura; o recorte a remove */}
              <img
                src={asset('assets/matriz.png')}
                alt="Fachada de uma unidade Unity Empresas, com identidade visual Unity e TIM"
                width="1041"
                height="762"
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full scale-[1.09] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
              <figcaption className="absolute bottom-0 left-0 p-6 text-sm text-white/80 sm:p-8">
                Unidade Unity Empresas
              </figcaption>
            </div>

            {/* Selo Black Partner (imagem oficial do site) */}
            <div className="absolute -bottom-10 -left-4 hidden items-center gap-4 rounded-3xl bg-white p-4 pr-6 shadow-card sm:flex lg:-left-10">
              <img
                src={asset('assets/blckprtnr.png')}
                alt="Selo TIM Black Partner"
                width="855"
                height="705"
                loading="lazy"
                className="h-12 w-auto"
              />
              <p className="text-xs leading-snug text-navy-700">
                Somos <strong className="text-navy-900">Black Partners</strong>
                <br />
                TIM Empresas
              </p>
            </div>
          </figure>
        </div>

        {/* Missão, visão, valores */}
        <div className="mt-28 grid gap-5 md:grid-cols-3">
          {pillars.map(({ icon: I, title, text }) => (
            <article key={title} data-reveal className="glass-card group p-8 transition-colors duration-500 hover:border-electric/40">
              <I className="h-6 w-6 text-electric-300" strokeWidth={1.6} aria-hidden="true" />
              <h3 className="mt-8 font-display text-xl font-semibold">{title}</h3>
              <p className="mt-3 leading-relaxed text-white/60">{text}</p>
            </article>
          ))}
        </div>

        {/* Black Partner */}
        <div className="mt-24 grid items-center gap-12 rounded-[32px] border border-white/10 bg-gradient-to-br from-navy-800/80 to-navy-950 p-8 sm:p-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div data-reveal className="inline-flex rounded-2xl bg-white p-4">
              <img
                src={asset('assets/blckprtnr.png')}
                alt="Selo TIM Black Partner"
                width="855"
                height="705"
                loading="lazy"
                className="h-16 w-auto sm:h-20"
              />
            </div>
            <h3 data-reveal className="h-display mt-8 text-3xl sm:text-4xl">Somos Black Partners.</h3>
            <p data-reveal className="mt-5 leading-relaxed text-white/60">
              O selo Black Partner é o reconhecimento máximo de qualidade e desempenho concedido pela TIM, da consultoria
              ao pós-venda. Escolher a Unity é escolher um serviço de padrão máximo.
            </p>
          </div>
          <ul className="grid gap-4 lg:col-span-7">
            {diffs.map(({ icon: I, title, text }) => (
              <li key={title} data-reveal className="flex gap-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-electric/15 text-electric-300">
                  <I className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold">{title}</span>
                  <span className="mt-1 block text-white/60">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
