import { ArrowUp } from 'lucide-react'
import { nav, site, solutions, whatsappLink } from '../config/site'
import InstagramIcon from './ui/InstagramIcon'
import WhatsAppIcon from './ui/WhatsAppIcon'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-950 pt-20 text-white">
      <div className="container-site">
        <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <img src={site.logo} alt="Unity Empresas — TIM Empresas" width="400" height="128" loading="lazy" className="h-11 w-auto" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/50">
              {site.tagline}. Representantes oficiais TIM Empresas, desde 2013.
            </p>
            <div className="mt-8 flex gap-3">
              <a
                href={site.social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @unityempresas"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 transition-colors hover:border-electric hover:bg-electric"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp da Unity"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 transition-colors hover:border-[#25D366] hover:bg-[#25D366]"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
              <a
                href={site.social.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Unity Empresas"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-sm font-bold transition-colors hover:border-electric hover:bg-electric"
              >
                f
              </a>
            </div>
          </div>

          <nav aria-label="Rodapé — navegação" className="lg:col-span-2">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Navegação</h2>
            <ul className="mt-6 space-y-3 text-sm">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-white/70 hover:text-white">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Soluções</h2>
            <ul className="mt-6 space-y-3 text-sm">
              {solutions.map((s) => (
                <li key={s.id}>
                  <a href="#solucoes" className="text-white/70 hover:text-white">
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <address className="not-italic lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Contato</h2>
            <ul className="mt-6 space-y-3 text-sm text-white/70">
              <li>
                <a href={site.contact.phoneHref} className="hover:text-white">
                  {site.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.contact.email}`} className="break-all hover:text-white">
                  {site.contact.email}
                </a>
              </li>
              <li className="text-white/50">{site.contact.address}</li>
            </ul>
          </address>
        </div>

        <div className="flex flex-col gap-4 py-8 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName} · CNPJ {site.cnpj}
          </p>
          <p className="flex items-center gap-2">
            <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/45">
              Projeto conceitual demonstrativo
            </span>
            <span className="hidden sm:inline">Site oficial:</span>
            <a href={site.officialUrl} target="_blank" rel="noopener noreferrer" className="hidden underline-offset-4 hover:text-white hover:underline sm:inline">
              unityempresas.com.br
            </a>
          </p>
          <a href="#inicio" className="inline-flex items-center gap-2 hover:text-white">
            Voltar ao topo <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Marca d'água tipográfica */}
      <p aria-hidden="true" className="pointer-events-none select-none text-center font-display text-[22vw] font-semibold leading-[0.75] tracking-tightest text-white/[0.03]">
        UNITY
      </p>
    </footer>
  )
}
