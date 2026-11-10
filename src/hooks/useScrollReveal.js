import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

/**
 * Anima elementos com [data-reveal] ao entrarem na tela.
 * Com prefers-reduced-motion, nada é ocultado nem animado.
 */
export function useScrollReveal(reduced) {
  useLayoutEffect(() => {
    if (reduced) {
      document.documentElement.classList.remove('anim')
      return
    }
    document.documentElement.classList.add('anim')
    const ctx = gsap.context(() => {
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => {
          batch.forEach((el) => el.classList.add('is-revealed'))
          // Elementos que já ficaram acima da tela (salto por âncora) aparecem sem animação
          const els = batch.filter((el) => el.getBoundingClientRect().bottom > 0)
          if (!els.length) return
          gsap.fromTo(
            els,
            { opacity: 0, y: 28, filter: 'blur(6px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 1,
              ease: 'expo.out',
              stagger: { amount: Math.min(0.5, els.length * 0.08) },
              overwrite: true,
              // libera o transform para os efeitos de hover definidos em CSS
              clearProps: 'transform,filter,opacity',
            },
          )
        },
      })
    })
    // Recalcula posições quando fontes/imagens alteram a altura da página
    let t
    const refresh = () => {
      clearTimeout(t)
      t = setTimeout(() => ScrollTrigger.refresh(), 150)
    }
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)
    const ro = new ResizeObserver(refresh)
    ro.observe(document.body)
    return () => {
      clearTimeout(t)
      ro.disconnect()
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [reduced])
}
