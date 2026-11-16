'use client'

import Image from 'next/image'
import { useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { ImageAsset } from '@/types'
import { cn } from '@/lib/format'

gsap.registerPlugin(ScrollTrigger)

/** Photograph revealed with a vertical mask, plus optional subtle parallax. */
export function RevealImage({
  image,
  sizes,
  className,
  parallax = 0,
  from = 'bottom',
}: {
  image: ImageAsset
  sizes: string
  className?: string
  parallax?: number
  from?: 'bottom' | 'left' | 'right'
}) {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const start = from === 'left' ? 'inset(0 100% 0 0)' : from === 'right' ? 'inset(0 0 0 100%)' : 'inset(100% 0 0 0)'
        gsap.fromTo(
          root.current,
          { clipPath: start },
          { clipPath: 'inset(0 0% 0 0%)', duration: 1.3, ease: 'power3.inOut', scrollTrigger: { trigger: root.current, start: 'top 85%', once: true } },
        )
        gsap.fromTo('[data-ri-img]', { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'power2.out', scrollTrigger: { trigger: root.current, start: 'top 85%', once: true } })
        if (parallax) {
          gsap.fromTo(
            '[data-ri-par]',
            { yPercent: -parallax },
            { yPercent: parallax, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
          )
        }
      })
      return () => mm.revert()
    },
    { scope: root },
  )
  return (
    <div ref={root} className={cn('relative overflow-hidden bg-ivory', className)}>
      <div data-ri-par className={cn('absolute', parallax ? '-inset-y-[8%] inset-x-0' : 'inset-0')}>
        <div data-ri-img className="absolute inset-0">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            quality={80}
            style={image.position ? { objectPosition: image.position } : undefined}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  )
}

/** Staggered fade/translate for a block of text children marked with [data-rt]. */
export function RevealText({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-rt]', {
          opacity: 0,
          y: 18,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: 'top 82%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )
  return (
    <div ref={root} className={className}>
      {children}
    </div>
  )
}
