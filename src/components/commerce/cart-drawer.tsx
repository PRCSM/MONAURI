'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useUI } from '@/providers/ui-provider'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import { useCart } from '@/lib/store'
import { priceLines } from '@/lib/pricing'
import { formatPrice } from '@/lib/format'
import { CloseIcon } from '@/components/ui/icons'
import { CartLines } from './cart-lines'

export function CartDrawer() {
  const { panel, close } = useUI()
  const isOpen = panel === 'cart'
  const root = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const { lines, count } = useCart()
  const { subtotal } = priceLines(lines)

  useFocusTrap(root, isOpen, close)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: 'power3.out', duration: reduce ? 0.01 : 0.7 } })
        .set(root.current, { autoAlpha: 1 })
        .fromTo('[data-cart-scrim]', { opacity: 0 }, { opacity: 1, duration: reduce ? 0.01 : 0.5 }, 0)
        .fromTo('[data-cart-panel]', { xPercent: 100 }, { xPercent: 0 }, 0)
    },
    { scope: root },
  )
  useGSAP(() => {
    if (!tl.current) return
    if (isOpen) {
      gsap.set(root.current, { autoAlpha: 1 })
      tl.current.timeScale(1).play()
    }
    else tl.current.timeScale(1.6).reverse()
  }, [isOpen])

  return (
    <div ref={root} role="dialog" aria-modal="true" aria-label="Shopping bag" inert={!isOpen} className="invisible fixed inset-0 z-[70] opacity-0">
      <button type="button" tabIndex={-1} aria-hidden data-cart-scrim onClick={close} className="absolute inset-0 h-full w-full cursor-default bg-black/25" />
      <aside data-cart-panel className="absolute top-0 right-0 flex h-full w-full max-w-[460px] flex-col bg-white">
        <div className="wrap flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-black/[0.06]">
          <p className="text-[12px] tracking-[0.16em] uppercase">Bag {count > 0 && <span className="text-secondary">({count})</span>}</p>
          <button type="button" onClick={close} aria-label="Close bag" className="-mr-2 grid h-11 w-11 place-items-center">
            <CloseIcon />
          </button>
        </div>
        {lines.length === 0 ? (
          <div className="wrap flex flex-1 flex-col items-center justify-center text-center">
            <p className="text-[22px] font-[300] text-ink">Your bag is empty</p>
            <p className="mt-3 max-w-[280px] text-[14px] text-secondary">Discover pieces made to be worn every day and kept for a lifetime.</p>
            <Link href="/catalog" onClick={close} className="btn-outline mt-8">
              Explore the Collection
            </Link>
          </div>
        ) : (
          <>
            <div className="wrap flex-1 overflow-y-auto" data-lenis-prevent>
              <CartLines onNavigate={close} compact />
            </div>
            <div className="wrap shrink-0 border-t border-black/[0.06] py-6">
              <div className="flex items-baseline justify-between text-[14px]">
                <span>Subtotal</span>
                <span className="text-ink">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-[12px] text-secondary">Shipping and taxes calculated at checkout.</p>
              <div className="mt-5 grid gap-2">
                <Link href="/checkout" onClick={close} className="btn-solid w-full">
                  Checkout
                </Link>
                <Link href="/cart" onClick={close} className="btn-outline w-full">
                  View Bag
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
