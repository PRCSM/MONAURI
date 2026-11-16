'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useUI } from '@/providers/ui-provider'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import { useDebounce } from '@/hooks/use-debounce'
import { CloseIcon, SearchIcon } from '@/components/ui/icons'
import { categories, collections, products } from '@/data/catalog'
import { searchProducts } from '@/lib/filters'
import { formatPrice } from '@/lib/format'

const catNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]))
const colNames = Object.fromEntries(collections.map((c) => [c.slug, c.name]))
const SUGGESTIONS = ['Gold hoops', 'Pendant', 'Engagement', 'Diamond', 'Bracelet']

export function SearchOverlay() {
  const { panel, close } = useUI()
  const isOpen = panel === 'search'
  const root = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(-1)
  const q = useDebounce(query, 180)

  const results = useMemo(() => searchProducts(products, q, catNames, colNames).slice(0, 8), [q])
  const matchedCategories = useMemo(() => {
    const t = q.toLowerCase().trim()
    return t ? categories.filter((c) => c.name.toLowerCase().includes(t)) : []
  }, [q])

  useFocusTrap(root, isOpen, close, input)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: 'power3.out', duration: reduce ? 0.01 : 0.6 } })
        .set(root.current, { autoAlpha: 1 })
        .fromTo('[data-search-scrim]', { opacity: 0 }, { opacity: 1 }, 0)
        .fromTo('[data-search-panel]', { yPercent: reduce ? 0 : -6, opacity: 0 }, { yPercent: 0, opacity: 1 }, 0)
    },
    { scope: root },
  )
  useGSAP(() => {
    if (!tl.current) return
    if (isOpen) {
      gsap.set(root.current, { autoAlpha: 1 })
      tl.current.play()
    }
    else tl.current.reverse()
  }, [isOpen])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1))
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault()
      router.push(`/product/${results[active].slug}`)
      close()
    }
  }

  return (
    <div ref={root} role="dialog" aria-modal="true" aria-label="Search" inert={!isOpen} className="invisible fixed inset-0 z-[70] opacity-0">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        data-search-scrim
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-black/20"
      />
      <div data-search-panel className="relative max-h-[88svh] overflow-y-auto bg-white" data-lenis-prevent>
        <div className="wrap flex h-[var(--header-h)] items-center justify-between">
          <span className="eyebrow">Search</span>
          <button type="button" onClick={close} aria-label="Close search" className="-mr-2 grid h-11 w-11 place-items-center">
            <CloseIcon />
          </button>
        </div>
        <div className="wrap mx-auto max-w-[1100px] pb-12">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              if (active >= 0 && results[active]) router.push(`/product/${results[active].slug}`)
              else if (results[0]) router.push(`/product/${results[0].slug}`)
              close()
            }}
            className="flex items-center gap-4 border-b border-ink/80 pb-3"
          >
            <SearchIcon className="shrink-0 text-secondary" />
            <label htmlFor="site-search" className="sr-only">
              Search jewelry
            </label>
            <input
              id="site-search"
              ref={input}
              type="search"
              autoComplete="off"
              placeholder="Search rings, earrings, collections…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setActive(-1)
              }}
              onKeyDown={onKeyDown}
              role="combobox"
              aria-expanded={results.length > 0}
              aria-controls="search-results"
              aria-activedescendant={active >= 0 ? `search-opt-${active}` : undefined}
              className="w-full bg-transparent text-[clamp(20px,2.2vw,32px)] font-[300] text-ink placeholder:text-black/25 focus:outline-none"
            />
          </form>

          {!q.trim() && (
            <div className="mt-8">
              <p className="eyebrow mb-4">Popular</p>
              <ul className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => setQuery(s)}
                      className="border border-subtle px-4 py-2 text-[13px] text-foreground transition-colors hover:border-ink"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {q.trim() && matchedCategories.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
              {matchedCategories.map((c) => (
                <Link key={c.slug} href={`/catalog/${c.slug}`} onClick={close} className="link-underline">
                  View all {c.name}
                </Link>
              ))}
            </div>
          )}

          {q.trim() && (
            <div aria-live="polite" className="mt-8">
              {results.length === 0 ? (
                <p className="text-[15px] text-secondary">
                  No pieces match “{q}”. Try a material, stone or category — or{' '}
                  <Link href="/catalog" onClick={close} className="link-underline text-ink">
                    browse everything
                  </Link>
                  .
                </p>
              ) : (
                <>
                  <p className="eyebrow mb-5">
                    {results.length} {results.length === 1 ? 'result' : 'results'}
                  </p>
                  <ul id="search-results" role="listbox" className="grid grid-cols-2 gap-x-[var(--tile-gap)] gap-y-8 md:grid-cols-4">
                    {results.map((p, i) => (
                      <li key={p.id} id={`search-opt-${i}`} role="option" aria-selected={i === active}>
                        <Link
                          href={`/product/${p.slug}`}
                          onClick={close}
                          onMouseEnter={() => setActive(i)}
                          className={`group block outline-offset-4 ${i === active ? 'outline outline-1 outline-ink/40' : ''}`}
                        >
                          <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
                            <Image
                              src={p.images[0].src}
                              alt={p.images[0].alt}
                              fill
                              sizes="(min-width:768px) 22vw, 45vw"
                              quality={70}
                              className="object-cover transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.025]"
                            />
                          </div>
                          <p className="mt-3 text-[13px] text-ink">{p.name}</p>
                          <p className="mt-0.5 text-[12px] text-secondary">{formatPrice(p.price)}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
