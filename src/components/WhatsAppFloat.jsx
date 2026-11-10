import { whatsappLink } from '../config/site'
import WhatsAppIcon from './ui/WhatsAppIcon'

export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Unity pelo WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-3 sm:bottom-7 sm:right-7"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <span className="pointer-events-none hidden translate-x-2 rounded-full bg-navy-900/90 px-4 py-2 text-sm font-medium text-white opacity-0 shadow-card backdrop-blur transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block">
        Fale com um especialista
      </span>
      <span className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_14px_40px_-10px_rgba(37,211,102,.7)] transition-transform duration-300 group-hover:scale-105">
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping-soft" />
        <WhatsAppIcon className="relative h-7 w-7" />
      </span>
    </a>
  )
}
