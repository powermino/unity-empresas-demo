import { ArrowUpRight } from 'lucide-react'
import { asset, instagramThumbs, site } from '../../config/site'
import InstagramIcon from '../ui/InstagramIcon'

/**
 * Sem integração com a API do Instagram, o bloco NÃO simula um feed:
 * mostra imagens institucionais do site oficial como vitrine da marca,
 * todas levando ao perfil real. Adicione miniaturas autorizadas em
 * `instagramThumbs` (src/config/site.js) para substituí-las.
 */
const brandTiles = [
  { src: asset('assets/matriz.png'), alt: 'Unidade Unity Empresas', fit: 'cover', bg: 'bg-navy-900', zoom: 'scale-[1.12]' },
  { src: asset('assets/timblack.png'), alt: 'Smartphone com a marca TIM', fit: 'contain', bg: 'bg-gradient-to-br from-electric to-navy-700' },
  { src: asset('assets/blckprtnr.png'), alt: 'Selo TIM Black Partner', fit: 'contain', bg: 'bg-white', pad: 'p-10' },
  { src: asset('assets/wttx.png'), alt: 'Modem Unity TIM Empresas', fit: 'contain', bg: 'bg-mist-100', pad: 'p-6' },
  { src: asset('assets/logo-white.png'), alt: 'Logo Unity Empresas', fit: 'contain', bg: 'bg-navy-950', pad: 'p-8' },
  { src: asset('assets/m2m.png'), alt: 'Chip TIM para Telemetria M2M', fit: 'contain', bg: 'bg-white', pad: 'p-5' },
]

export default function Social() {
  const tiles = instagramThumbs.length ? instagramThumbs.map((t) => ({ ...t, fit: 'cover', bg: 'bg-navy-900' })) : brandTiles
  const ig = site.social.instagram

  return (
    <section id="instagram" aria-labelledby="social-title" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="container-site grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p data-reveal className="eyebrow text-electric">Redes sociais</p>
          <h2 id="social-title" data-reveal className="h-display mt-5 text-4xl text-navy-900 sm:text-5xl lg:text-6xl">
            Acompanhe a Unity no <span className="text-gradient-blue">Instagram.</span>
          </h2>
          <p data-reveal className="mt-6 max-w-md text-lg leading-relaxed text-navy-700/70">
            Novidades, bastidores e conteúdos sobre conectividade para empresas, direto no nosso perfil oficial.
          </p>

          <a
            data-reveal
            href={ig.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 inline-flex items-center gap-4 rounded-full border border-navy-900/10 p-2 pr-6 transition-all duration-300 hover:border-transparent hover:shadow-soft"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[linear-gradient(135deg,#f9ce34,#ee2a7b_50%,#6228d7)] text-white">
              <InstagramIcon className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-display font-semibold text-navy-900">{ig.handle}</span>
              <span className="block text-xs text-navy-700/60">Seguir no Instagram</span>
            </span>
            <ArrowUpRight className="ml-2 h-5 w-5 text-navy-700 transition-transform group-hover:rotate-45" aria-hidden="true" />
          </a>
        </div>

        <div className="lg:col-span-7">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {tiles.map((t, i) => (
              <li key={i} data-reveal className={i % 3 === 1 ? 'sm:mt-8' : ''}>
                <a
                  href={t.url || ig.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t.alt} — abrir ${ig.handle} no Instagram`}
                  className={`group relative block aspect-square overflow-hidden rounded-3xl ${t.bg}`}
                >
                  <img
                    src={t.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={`h-full w-full transition-all duration-700 ease-out group-hover:scale-110 ${
                      t.fit === 'cover' ? `object-cover ${t.zoom || ''}` : 'object-contain'
                    } ${t.pad || ''}`}
                  />
                  <span className="absolute inset-0 flex items-end bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-white">
                      <InstagramIcon className="h-4 w-4" /> Ver no Instagram
                    </span>
                  </span>
                  <span className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-navy-900/5 transition-all duration-500 group-hover:ring-2 group-hover:ring-electric" />
                </a>
              </li>
            ))}
          </ul>
          {!instagramThumbs.length && (
            <p className="mt-12 text-xs text-navy-700/45">Imagens institucionais da marca. As publicações estão no perfil oficial.</p>
          )}
        </div>
      </div>
    </section>
  )
}
