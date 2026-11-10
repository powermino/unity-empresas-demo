import Header from './components/Header'
import Hero from './components/sections/Hero'
import Authority from './components/sections/Authority'
import Solutions from './components/sections/Solutions'
import Coverage from './components/sections/Coverage'
import About from './components/sections/About'
import Opportunities from './components/sections/Opportunities'
import Social from './components/sections/Social'
import Contact from './components/sections/Contact'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useScrollReveal } from './hooks/useScrollReveal'

export default function App() {
  const reduced = useReducedMotion()
  useScrollReveal(reduced)

  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-navy-900">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero reduced={reduced} />
        <Authority reduced={reduced} />
        <Solutions />
        <Coverage reduced={reduced} />
        <About />
        <Opportunities />
        <Social />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
