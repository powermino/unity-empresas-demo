import { useEffect, useState } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { nav, site, whatsappLink } from '../config/site'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  const solid = scrolled || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        solid ? 'border-b border-white/[0.07] bg-navy-950/90 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className={`container-site flex items-center justify-between transition-all duration-500 ${solid ? 'h-16' : 'h-20 sm:h-24'}`}>
        <a href="#inicio" className="flex items-center" aria-label="Unity Empresas — início">
          <img src={site.logo} alt="Unity Empresas — TIM Empresas" width="400" height="128" className={`w-auto transition-all duration-500 ${solid ? 'h-9' : 'h-10 sm:h-11'}`} />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="rounded-full px-4 py-2 text-[13px] font-medium text-white/70 transition-colors hover:text-white">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:border-electric hover:bg-electric sm:inline-flex"
          >
            Fale com um especialista <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full text-white lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        id="menu-mobile"
        className={`fixed inset-x-0 bottom-0 top-16 bg-navy-950/[0.97] backdrop-blur-xl transition-all duration-500 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav aria-label="Menu mobile" className="container-site flex h-full flex-col pb-10 pt-8">
          <ul className="flex flex-col">
            {nav.map((n, i) => (
              <li key={n.href} className="border-b border-white/[0.07]">
                <a
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between py-5 font-display text-2xl font-medium text-white transition-all duration-500 ${
                    open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                  }`}
                  style={{ transitionDelay: open ? `${80 + i * 45}ms` : '0ms' }}
                >
                  {n.label}
                  <ArrowUpRight className="h-5 w-5 text-electric-300" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-primary mt-auto w-full py-4 text-base">
            Fale com um especialista
          </a>
        </nav>
      </div>
    </header>
  )
}
