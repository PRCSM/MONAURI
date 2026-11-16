'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { Product } from '@/types'
import { ProductCard } from '@/components/products/product-card'

gsap.registerPlugin(ScrollTrigger)

export function Bestsellers({ items }: { items: Product[] }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const st = { trigger: root.current, start: 'top 78%', once: true }
        gsap.from('[data-bs-head]', { opacity: 0, y: 14, duration: 0.8, ease: 'power3.out', scrollTrigger: st })
        gsap.from('[data-card-media]', {
          opacity: 0,
          y: 28,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: st,
        })
        gsap.from('[data-card-meta]', {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.1,
          delay: 0.35,
          scrollTrigger: st,
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="bestsellers-title" className="wrap pt-[clamp(48px,6.8vw,110px)] pb-[clamp(40px,4.4vw,72px)]">
      <div data-bs-head className="mb-[clamp(18px,2.2vw,36px)] flex items-baseline justify-between">
        <h2 id="bestsellers-title" className="text-[clamp(20px,1.95vw,30px)] font-[400] tracking-[-0.005em] text-ink">
          Bestsellers
        </h2>
        <Link href="/bestsellers" className="link-underline text-[clamp(11px,0.85vw,13px)] text-secondary">
          Shop All
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-[var(--tile-gap)] gap-y-10 lg:grid-cols-4 lg:gap-x-[clamp(12px,1.6vw,28px)]">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} aspect="aspect-[3/4]" />
        ))}
      </div>
    </section>
  )
}
