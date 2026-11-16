'use client'

import Link from 'next/link'
import { products } from '@/data/catalog'
import { useWishlist } from '@/lib/store'
import { useHydrated } from '@/hooks/use-hydrated'
import { ProductCard } from '@/components/products/product-card'
import { CatalogSkeleton } from '@/components/catalog/catalog-view'

export function FavoritesView() {
  const { ids } = useWishlist()
  const hydrated = useHydrated()
  if (!hydrated) return <CatalogSkeleton />
  const items = ids.map((id) => products.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p)
  if (!items.length)
    return (
      <div className="wrap flex flex-col items-center py-20 text-center">
        <p className="text-[22px] font-[300] text-ink">Your wishlist is empty</p>
        <p className="mt-3 max-w-[340px] text-[14px] text-secondary">Tap the heart on any piece to keep it here for later.</p>
        <Link href="/catalog" className="btn-outline mt-8">
          Explore the Collection
        </Link>
      </div>
    )
  return (
    <div className="wrap grid grid-cols-2 gap-x-[var(--tile-gap)] gap-y-[clamp(32px,3.4vw,56px)] lg:grid-cols-4 lg:gap-x-[clamp(12px,1.4vw,24px)]">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
