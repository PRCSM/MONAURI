'use client'

import { getImageProps } from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { LOCAL } from '@/lib/images'

gsap.registerPlugin(ScrollTrigger)

const ALT = 'A white calla lily with a pale champagne pear-cut diamond ring on its stem, in soft grey studio light'

export function Hero() {
  const root = useRef<HTMLElement>(null)

  // Art direction: wide campaign frame on desktop, portrait crop on mobile
  const common = { alt: ALT, fill: true, priority: true, quality: 80, sizes: '100vw' } as const
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: LOCAL.heroDesktop })
  const {
    props: { srcSet: mobileSrcSet, ...mobile },
  } = getImageProps({ ...common, src: LOCAL.heroMobile })

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .fromTo('[data-hero-media]', { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.35, ease: 'power2.out' })
          .fromTo('[data-hero-line]', { yPercent: 105 }, { yPercent: 0, duration: 0.85, stagger: 0.12 }, '-=0.7')
          .fromTo('[data-hero-cta]', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.35')
        gsap.to('[data-hero-parallax]', {
          yPercent: 7,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      aria-label="Introduction"
      className="relative h-[max(560px,min(56.25vw,100svh))] overflow-hidden bg-pearl max-md:h-[min(92svh,780px)]"
    >
      <div data-hero-parallax className="absolute inset-0 will-change-transform">
        <div data-hero-media className="absolute inset-0">
          <picture>
            <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
            <source media="(max-width: 767px)" srcSet={mobileSrcSet} />
            {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is included in the spread props */}
            <img {...mobile} className="h-full w-full object-cover object-[50%_50%] md:object-[70%_50%]" />
          </picture>
        </div>
      </div>

      <div className="wrap absolute inset-x-0 bottom-[clamp(28px,4.2vw,64px)]">
        <h1 className="text-[clamp(30px,2.95vw,46px)] leading-[1.08] font-[300] tracking-[-0.01em] text-[#4a4a4a]">
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero-line className="block">
              Jewelry that feels
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero-line className="block">
              like you
            </span>
          </span>
        </h1>
        <Link
          href="/catalog"
          data-hero-cta
          className="link-underline mt-[clamp(10px,1vw,16px)] text-[clamp(12px,0.9vw,14px)] text-[#5a5a5a]"
        >
          Explore the Collection
        </Link>
      </div>
    </section>
  )
}
