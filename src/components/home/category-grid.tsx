'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { Category } from '@/types'
import { cn } from '@/lib/format'

gsap.registerPlugin(ScrollTrigger)

/**
 * Five-tile editorial grid from the reference:
 *   Row 1: Bracelets | Necklaces | Earrings
 *   Row 2: Rings     | Engagement Rings (spans 2)
 */
export function CategoryGrid({ items }: { items: Category[] }) {
  const root = useRef<HTMLElement>(null)
  const order = ['bracelets', 'necklaces', 'earrings', 'rings', 'engagement-rings']
  const tiles = order.map((s) => items.find((c) => c.slug === s)!).filter(Boolean)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-tile]').forEach((tile, i) => {
          const img = tile.querySelector('[data-tile-img]')
          const label = tile.querySelector('[data-tile-label]')
          const tl = gsap.timeline({
            scrollTrigger: { trigger: tile, start: 'top 88%', once: true },
            delay: (i % 3) * 0.08,
          })
          tl.fromTo(tile, { clipPath: 'inset(8% 0 0 0)', opacity: 0 }, { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 1.1, ease: 'power3.out' })
            .from(img, { scale: 1.08, duration: 1.4, ease: 'power2.out' }, 0)
            .from(label, { opacity: 0, y: 10, duration: 0.6, ease: 'power2.out' }, 0.45)
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-label="Shop by category" className="px-0">
      <div className="grid grid-cols-2 gap-[var(--tile-gap)] lg:grid-cols-3">
        {tiles.map((c, i) => {
          const wide = c.slug === 'engagement-rings'
          return (
            <Link
              key={c.slug}
              href={`/catalog/${c.slug}`}
              data-tile
              className={cn(
                'group relative block overflow-hidden bg-ivory',
                // Mobile/tablet: 2+2 tiles, engagement full-width. Desktop: 3 + (1 | 2-span).
                wide ? 'col-span-2 aspect-[16/10] lg:aspect-[2.08/1]' : i < 3 ? 'aspect-[4/5] lg:aspect-[0.78/1]' : 'aspect-[4/5] lg:aspect-auto',
              )}
            >
              <div data-tile-img className="absolute inset-0 transition-transform duration-[1100ms] ease-[var(--ease-lux)] group-hover:scale-[1.03]">
                <Image
                  src={c.image.src}
                  alt={c.image.alt}
                  fill
                  quality={80}
                  sizes={wide ? '(min-width:1024px) 66vw, 100vw' : '(min-width:1024px) 33vw, 50vw'}
                  style={c.image.position ? { objectPosition: c.image.position } : undefined}
                  className="object-cover"
                />
              </div>
              <span
                data-tile-label
                className="absolute bottom-[clamp(14px,2vw,30px)] left-[clamp(14px,1.7vw,26px)] text-[clamp(17px,1.95vw,28px)] font-[300] text-[#555] transition-transform duration-700 ease-[var(--ease-lux)] group-hover:translate-x-1.5"
              >
                {c.name}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
