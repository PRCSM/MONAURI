'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUI } from '@/providers/ui-provider'
import { useCart, useWishlist } from '@/lib/store'
import { useHydrated } from '@/hooks/use-hydrated'
import { BagIcon, HeartIcon, MenuIcon, SearchIcon } from '@/components/ui/icons'
import { cn } from '@/lib/format'

export function Header() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const { open } = useUI()
  const { count } = useCart()
  const { ids } = useWishlist()
  const hydrated = useHydrated()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const solid = !isHome || scrolled

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ease-[var(--ease-lux)]',
        solid ? 'border-b border-black/[0.06] bg-white/92 backdrop-blur-md' : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="wrap grid h-[var(--header-h)] grid-cols-[1fr_auto_1fr] items-center">
        {/* Left — catalog menu */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => open('menu')}
            className="-ml-2 flex h-11 items-center gap-3 px-2 text-ink"
            aria-label="Open catalog menu"
            aria-haspopup="dialog"
            data-cursor="hover"
          >
            <MenuIcon />
            <span className="hidden text-[10.5px] tracking-[0.18em] uppercase sm:inline">Catalog</span>
          </button>
        </div>

        {/* Center — wordmark, truly centered via the 1fr/auto/1fr grid */}
        <Link
          href="/"
          aria-label="MONAURI — home"
          className="font-serif text-[clamp(20px,1.75vw,27px)] font-[400] tracking-[0.14em] text-ink"
        >
          MONAURI
        </Link>

        {/* Right — actions */}
        <nav aria-label="Account" className="-mr-2 flex items-center justify-end">
          <button
            type="button"
            onClick={() => open('search')}
            aria-label="Search"
            className="grid h-11 w-10 place-items-center text-ink"
            data-cursor="hover"
          >
            <SearchIcon />
          </button>
          <Link href="/favorites" aria-label={`Wishlist${hydrated && ids.length ? `, ${ids.length} items` : ''}`} className="relative grid h-11 w-10 place-items-center text-ink">
            <HeartIcon />
            {hydrated && ids.length > 0 && (
              <span className="absolute top-[11px] right-[6px] h-[5px] w-[5px] rounded-full bg-gold" aria-hidden />
            )}
          </Link>
          <button
            type="button"
            onClick={() => open('cart')}
            aria-label={`Shopping bag${hydrated ? `, ${count} items` : ''}`}
            className="relative grid h-11 w-10 place-items-center text-ink"
            data-cursor="hover"
          >
            <BagIcon />
            {hydrated && count > 0 && (
              <span className="absolute top-[7px] right-[3px] min-w-[15px] rounded-full bg-ink px-[3px] text-center text-[9px] leading-[15px] text-white">
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}
