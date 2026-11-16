'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext<Lenis | null>(null)
export const useLenis = () => useContext(LenisContext)

/**
 * Lenis smooth scrolling for wheel/trackpad, synced with GSAP ScrollTrigger on the
 * GSAP ticker. Touch devices keep native scrolling (syncTouch off). Disabled for
 * users who prefer reduced motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches) return

    const instance = new Lenis({
      autoRaf: false,
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: { offset: -80 },
    })
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- instance must be created client-side after mount
    setLenis(instance)

    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  // Reset scroll + recalculate triggers on route change
  useEffect(() => {
    if (window.location.hash) return
    lenis?.scrollTo(0, { immediate: true, force: true })
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120)
    return () => window.clearTimeout(id)
  }, [pathname, lenis])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
