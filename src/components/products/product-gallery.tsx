'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import type { ImageAsset } from '@/types'
import { cn } from '@/lib/format'

export function ProductGallery({ images, name }: { images: ImageAsset[]; name: string }) {
  const [index, setIndex] = useState(0)
  const stage = useRef<HTMLDivElement>(null)
  const thumbs = useRef<(HTMLButtonElement | null)[]>([])

  const go = (i: number, focus = false) => {
    const next = (i + images.length) % images.length
    if (next === index) return
    setIndex(next)
    if (focus) thumbs.current[next]?.focus()
    if (stage.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(stage.current, { opacity: 0.35 }, { opacity: 1, duration: 0.6, ease: 'power2.out' })
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      go(index + 1, true)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      go(index - 1, true)
    }
  }

  const current = images[index]
  return (
    <div className="flex flex-col-reverse gap-[var(--tile-gap)] lg:flex-row">
      {images.length > 1 && (
        <div role="tablist" aria-label={`${name} images`} aria-orientation="vertical" onKeyDown={onKeyDown} className="flex gap-[var(--tile-gap)] lg:w-[84px] lg:flex-col">
          {images.map((img, i) => (
            <button
              key={img.src}
              ref={(el) => {
                thumbs.current[i] = el
              }}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-controls="pdp-stage"
              tabIndex={i === index ? 0 : -1}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              onClick={() => go(i)}
              className={cn(
                'relative aspect-[4/5] w-[72px] overflow-hidden bg-ivory transition-opacity lg:w-full',
                i === index ? 'opacity-100 outline outline-1 outline-offset-2 outline-ink/40' : 'opacity-60 hover:opacity-100',
              )}
            >
              <Image src={img.src} alt="" fill sizes="90px" quality={70} className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <div ref={stage} id="pdp-stage" role="tabpanel" className="relative aspect-[4/5] flex-1 overflow-hidden bg-ivory">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority={index === 0}
          quality={80}
          sizes="(min-width:1024px) 52vw, 100vw"
          style={current.position ? { objectPosition: current.position } : undefined}
          className="object-cover"
        />
        {images.length > 1 && (
          <p className="absolute right-4 bottom-4 text-[11px] tracking-[0.12em] text-ink/70" aria-hidden>
            {index + 1} / {images.length}
          </p>
        )}
      </div>
    </div>
  )
}
