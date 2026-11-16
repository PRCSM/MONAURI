'use client'

import { useState } from 'react'
import type { Material, Product } from '@/types'
import { useCart, useWishlist } from '@/lib/store'
import { useUI } from '@/providers/ui-provider'
import { useHydrated } from '@/hooks/use-hydrated'
import { availabilityLabel, cn, formatPrice } from '@/lib/format'
import { QtyStepper } from '@/components/ui/qty-stepper'
import { HeartIcon } from '@/components/ui/icons'

export function ProductPurchase({ product }: { product: Product }) {
  const { add } = useCart()
  const { has, toggle } = useWishlist()
  const { open } = useUI()
  const hydrated = useHydrated()
  const [metal, setMetal] = useState<Material>(product.metals?.[0] ?? product.material)
  const [size, setSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const saved = hydrated && has(product.id)
  const soldOut = product.availability === 'sold-out'

  const onAdd = () => {
    if (product.sizes && !size) {
      setError('Please select a ring size.')
      document.getElementById('size-group')?.focus()
      return
    }
    setError(null)
    add({ productId: product.id, qty, size: size ?? undefined, metal: product.metals ? metal : undefined })
    open('cart')
  }

  return (
    <div>
      <div className="flex items-center gap-3 text-[12px] text-secondary">
        <span className={cn('h-1.5 w-1.5 rounded-full', soldOut ? 'bg-black/25' : product.availability === 'low-stock' ? 'bg-gold' : 'bg-[#7c9a7a]')} aria-hidden />
        {availabilityLabel[product.availability]}
      </div>

      {product.metals && product.metals.length > 1 && (
        <fieldset className="mt-8">
          <legend className="eyebrow mb-3">
            Metal — <span className="normal-case tracking-normal text-ink">{metal}</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {product.metals.map((m) => (
              <label key={m} className="cursor-pointer">
                <input type="radio" name="metal" value={m} checked={metal === m} onChange={() => setMetal(m)} className="peer sr-only" />
                <span className="block border border-subtle px-4 py-2.5 text-[12.5px] transition-colors peer-checked:border-ink peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 hover:border-ink/60">
                  {m}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {product.sizes && (
        <fieldset className="mt-8">
          <legend className="eyebrow mb-3 flex w-full justify-between">
            <span>Ring size (US)</span>
          </legend>
          <div
            id="size-group"
            tabIndex={-1}
            aria-describedby={error ? 'purchase-error' : undefined}
            className="grid grid-cols-6 gap-1.5 focus:outline-none sm:grid-cols-11 lg:grid-cols-6 xl:grid-cols-11"
          >
            {product.sizes.map((s) => (
              <label key={s} className="cursor-pointer">
                <input
                  type="radio"
                  name="size"
                  value={s}
                  checked={size === s}
                  onChange={() => {
                    setSize(s)
                    setError(null)
                  }}
                  className="peer sr-only"
                />
                <span className="grid h-10 place-items-center border border-subtle text-[12.5px] transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 hover:border-ink/60">
                  {s}
                </span>
              </label>
            ))}
          </div>
          <p className="mt-3 text-[12px] text-secondary">Unsure of your size? Complimentary resizing within 30 days.</p>
        </fieldset>
      )}

      <div className="mt-8 flex gap-2">
        <QtyStepper value={qty} onChange={setQty} label="Quantity" />
        <button type="button" onClick={onAdd} disabled={soldOut} className="btn-solid flex-1">
          {soldOut ? 'Sold Out' : `Add to Bag — ${formatPrice(product.price * qty)}`}
        </button>
        <button
          type="button"
          onClick={() => toggle(product.id)}
          aria-pressed={saved}
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          className="grid h-[52px] w-[52px] shrink-0 place-items-center border border-subtle transition-colors hover:border-ink"
        >
          <HeartIcon filled={saved} />
        </button>
      </div>
      <p id="purchase-error" role="alert" className="mt-3 min-h-[18px] text-[12.5px] text-[#9b3b3b]">
        {error}
      </p>
    </div>
  )
}
