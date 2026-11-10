import { ArrowUpRight, Handshake, BriefcaseBusiness, Check, Mail } from 'lucide-react'
import { site, whatsappLink } from '../../config/site'
import SectionHeading from '../ui/SectionHeading'
import WhatsAppIcon from '../ui/WhatsAppIcon'

const partnerBenefits = [
  'Equipe de suporte, backoffice e pós-venda',
  'CRM para acompanhar pedidos em tempo real',
  'Parceria formalizada em contrato',
  'Comissionamento atrativo — condições com o gerente de parceiros',
]

export default function Opportunities() {
  return (
    <section aria-labelledby="oportunidades-title" className="relative bg-mist-50 py-24 sm:py-32">
      <div className="container-site">
        <SectionHeading
          id="oportunidades-title"
          eyebrow="Parceiros e oportunidades"
          title={
            <>
              Cresça com a <span className="text-gradient-blue">Unity.</span>
            </>
          }
          text="Seja como parceiro comercial ou como parte do nosso time, há espaço para quem quer conectar empresas em todo o Brasil."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-5">
          {/* Parceiro comercial */}
          <article
            id="parceiros"
            data-reveal
            className="relative overflow-hidden rounded-[32px] bg-navy-900 p-8 text-white shadow-soft sm:p-12 lg:col-span-3"
          >
            <div aria-hidden="true" className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(31,107,255,.45),transparent_65%)]" />
            <div aria-hidden="true" className="absolute inset-0 grid-lines-dark opacity-60 [mask-image:linear-gradient(to_left,#000,transparent_70%)]" />
            <div className="relative">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-electric shadow-glow">
                <Handshake className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="h-display mt-8 text-3xl sm:text-4xl">Seja um parceiro comercial</h3>
              <p className="mt-4 max-w-lg leading-relaxed text-white/65">
                Faça parte do Canal de Parceiros Unity e ofereça as soluções TIM Empresas com a estrutura de um Black
                Partner por trás.
              </p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {partnerBenefits.map((b) => (
                  <li key={b} className="flex gap-3 text-[15px] text-white/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-electric-300" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
              <a
                href={whatsappLink('Olá, gostaria de mais informações do Canal de Parceiros')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-10"
              >
                <WhatsAppIcon className="h-4 w-4" /> Fale com nosso gerente de parceiros
              </a>
            </div>
          </article>

          {/* Trabalhe conosco */}
          <article
            id="carreiras"
            data-reveal
            className="relative flex flex-col overflow-hidden rounded-[32px] border border-navy-900/[0.07] bg-white p-8 shadow-soft sm:p-12 lg:col-span-2"
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-mist-100 text-electric">
              <BriefcaseBusiness className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="h-display mt-8 text-3xl text-navy-900 sm:text-4xl">Trabalhe na Unity</h3>
            <p className="mt-4 leading-relaxed text-navy-700/70">
              Quer construir carreira em um time que conecta empresas pelo Brasil? Envie seu currículo pelos nossos canais
              oficiais de contato.
            </p>
            <div className="mt-auto flex flex-col gap-3 pt-10">
              <a href="#contato" className="btn-ghost-light justify-between">
                Enviar pelo formulário <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={`mailto:${site.contact.email}?subject=${encodeURIComponent('Currículo — Trabalhe na Unity')}`}
                className="inline-flex items-center gap-2 px-2 text-sm font-medium text-navy-700 hover:text-electric"
              >
                <Mail className="h-4 w-4" aria-hidden="true" /> {site.contact.email}
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
