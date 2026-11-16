'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useUI } from '@/providers/ui-provider'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import { CloseIcon } from '@/components/ui/icons'
import { LOCAL } from '@/lib/images'

const PRIMARY = [
  { href: '/catalog', label: 'Shop All' },
  { href: '/new', label: 'New Arrivals' },
  { href: '/bestsellers', label: 'Bestsellers' },
  { href: '/catalog/rings', label: 'Rings' },
  { href: '/catalog/earrings', label: 'Earrings' },
  { href: '/catalog/necklaces', label: 'Necklaces' },
  { href: '/catalog/bracelets', label: 'Bracelets' },
  { href: '/catalog/engagement-rings', label: 'Engagement Rings' },
]
const SECONDARY = [
  { href: '/collections', label: 'Collections' },
  { href: '/about', label: 'Our Story' },
  { href: '/craftsmanship', label: 'Craftsmanship' },
  { href: '/contact', label: 'Contact' },
]

export function MenuOverlay() {
  const { panel, close } = useUI()
  const isOpen = panel === 'menu'
  const root = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  useFocusTrap(root, isOpen, close)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: 'power3.out' } })
        .fromTo('[data-menu-bg]', { opacity: 0 }, { opacity: 1, duration: reduce ? 0.01 : 0.5 })
        .fromTo(
          '[data-menu-item]',
          { y: reduce ? 0 : 24, opacity: 0 },
          { y: 0, opacity: 1, duration: reduce ? 0.01 : 0.7, stagger: reduce ? 0 : 0.045 },
          '-=0.25',
        )
        .fromTo(
          '[data-menu-image]',
          { clipPath: 'inset(100% 0 0 0)' },
          { clipPath: 'inset(0% 0 0 0)', duration: reduce ? 0.01 : 1.1, ease: 'power2.inOut' },
          0.1,
        )
    },
    { scope: root },
  )

  useGSAP(() => {
    if (!tl.current) return
    const tl_ = tl.current
    if (isOpen) {
      tl_.eventCallback('onReverseComplete', null)
      gsap.set(root.current, { autoAlpha: 1 })
      tl_.timeScale(1).play()
    } else if (tl_.progress() > 0) {
      tl_.eventCallback('onReverseComplete', () => gsap.set(root.current, { autoAlpha: 0 }))
      tl_.timeScale(1.8).reverse()
    }
  }, [isOpen])

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Catalog menu"
      inert={!isOpen}
      className="invisible fixed inset-0 z-[70] opacity-0"
    >
      <div data-menu-bg className="absolute inset-0 bg-white" />
      <div className="relative grid h-full grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex h-full flex-col overflow-y-auto" data-lenis-prevent>
          <div className="wrap flex h-[var(--header-h)] shrink-0 items-center">
            <button
              type="button"
              onClick={close}
              className="-ml-2 flex h-11 items-center gap-3 px-2 text-ink"
              aria-label="Close menu"
            >
              <CloseIcon />
              <span className="text-[10.5px] tracking-[0.18em] uppercase">Close</span>
            </button>
          </div>
          <nav aria-label="Main" className="wrap flex flex-1 flex-col justify-center gap-10 py-10 lg:pl-[8vw]">
            <ul className="space-y-[0.35em] text-[clamp(26px,3vw,44px)] leading-[1.15] font-[300] text-ink">
              {PRIMARY.map((l) => (
                <li key={l.href} data-menu-item>
                  <Link href={l.href} onClick={close} className="link-quiet">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="flex flex-wrap gap-x-8 gap-y-2 text-[13px] text-secondary">
              {SECONDARY.map((l) => (
                <li key={l.href} data-menu-item>
                  <Link href={l.href} onClick={close} className="link-quiet hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div data-menu-image className="relative hidden bg-pearl lg:block">
          <Image
            src={LOCAL.callaLilyRing}
            alt="A white calla lily with a pear-cut ring on its stem"
            fill
            sizes="45vw"
            quality={70}
            className="object-cover object-[80%_50%]"
          />
          <p className="absolute bottom-8 left-8 font-serif text-[22px] tracking-[0.14em] text-ink/80">MONAURI</p>
        </div>
      </div>
    </div>
  )
}
