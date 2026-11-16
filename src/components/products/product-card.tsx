'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types'
import { formatPrice, cn } from '@/lib/format'
import { useWishlist } from '@/lib/store'
import { useHydrated } from '@/hooks/use-hydrated'
import { HeartIcon } from '@/components/ui/icons'

export function ProductCard({
  product,
  sizes = '(min-width:1024px) 24vw, (min-width:640px) 45vw, 50vw',
  priority,
  aspect = 'aspect-[3/4]',
}: {
  product: Product
  sizes?: string
  priority?: boolean
  aspect?: string
}) {
  const { has, toggle } = useWishlist()
  const hydrated = useHydrated()
  const saved = hydrated && has(product.id)
  const img = product.images[0]

  return (
    <article className="group relative" data-product-card>
      <Link href={`/product/${product.slug}`} className="block" aria-label={`${product.name}, ${formatPrice(product.price)}`}>
        <div className={cn('relative overflow-hidden bg-ivory', aspect)} data-card-media>
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes={sizes}
            quality={80}
            priority={priority}
            style={img.position ? { objectPosition: img.position } : undefined}
            className="object-cover transition-transform duration-[900ms] ease-[var(--ease-lux)] group-hover:scale-[1.025]"
          />
          {product.availability === 'sold-out' && (
            <span className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 text-[10px] tracking-[0.14em] uppercase text-secondary">
              Sold out
            </span>
          )}
          {product.isNew && product.availability !== 'sold-out' && (
            <span className="absolute bottom-3 left-3 text-[10px] tracking-[0.16em] uppercase text-ink/70">New</span>
          )}
        </div>
        <div className="mt-[clamp(10px,1vw,16px)]" data-card-meta>
          <h3 className="text-[clamp(12.5px,0.98vw,15px)] text-foreground transition-colors duration-500 group-hover:text-ink">
            {product.name}
          </h3>
          <p className="mt-1 text-[clamp(11px,0.85vw,13px)] text-secondary">{formatPrice(product.price)}</p>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => toggle(product.id)}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        className={cn(
          'absolute top-2 right-2 grid h-10 w-10 place-items-center text-ink transition-opacity duration-500',
          saved ? 'opacity-100' : 'opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100',
        )}
      >
        <HeartIcon filled={saved} width={17} height={17} />
      </button>
    </article>
  )
}
