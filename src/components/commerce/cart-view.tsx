'use client'

import Link from 'next/link'
import { useCart } from '@/lib/store'
import { priceLines } from '@/lib/pricing'
import { formatPrice } from '@/lib/format'
import { useHydrated } from '@/hooks/use-hydrated'
import { CartLines } from './cart-lines'

export function CartView() {
  const { lines } = useCart()
  const hydrated = useHydrated()
  const { subtotal } = priceLines(lines)

  if (!hydrated) return <div className="wrap"><div className="skeleton h-[300px]" /></div>
  if (!lines.length)
    return (
      <div className="wrap flex flex-col items-center py-20 text-center">
        <p className="text-[22px] font-[300] text-ink">Your bag is empty</p>
        <p className="mt-3 max-w-[340px] text-[14px] text-secondary">Discover pieces made to be worn every day and kept for a lifetime.</p>
        <Link href="/catalog" className="btn-outline mt-8">Explore the Collection</Link>
      </div>
    )

  return (
    <div className="wrap grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-[clamp(40px,5vw,96px)]">
      <div className="border-t border-black/[0.07]">
        <CartLines />
      </div>
      <aside aria-label="Order summary" className="h-fit bg-ivory p-[clamp(24px,2.4vw,40px)] lg:sticky lg:top-[calc(var(--header-h)+24px)]">
        <p className="eyebrow mb-6">Summary</p>
        <div className="flex justify-between text-[14px]"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
        <div className="mt-2 flex justify-between text-[13px] text-secondary"><span>Shipping</span><span>Calculated at checkout</span></div>
        <p className="mt-6 text-[12px] leading-relaxed text-secondary">Complimentary standard shipping on orders over $500.</p>
        <Link href="/checkout" className="btn-solid mt-6 w-full">Checkout</Link>
        <Link href="/catalog" className="mt-4 block text-center text-[12.5px] text-secondary underline underline-offset-4 hover:text-ink">Continue shopping</Link>
      </aside>
    </div>
  )
}
