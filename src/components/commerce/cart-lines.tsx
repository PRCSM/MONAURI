'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart, lineKey } from '@/lib/store'
import { priceLines } from '@/lib/pricing'
import { formatPrice } from '@/lib/format'
import { QtyStepper } from '@/components/ui/qty-stepper'

export function CartLines({ onNavigate, compact = false }: { onNavigate?: () => void; compact?: boolean }) {
  const { lines, setQty, remove } = useCart()
  const { resolved } = priceLines(lines)

  return (
    <ul className="divide-y divide-black/[0.07]">
      {resolved.map(({ line, product }) => (
        <li key={lineKey(line)} className="flex gap-4 py-5">
          <Link
            href={`/product/${product.slug}`}
            onClick={onNavigate}
            className={`relative shrink-0 overflow-hidden bg-ivory ${compact ? 'h-[112px] w-[90px]' : 'h-[150px] w-[120px]'}`}
          >
            <Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="120px" quality={70} className="object-cover" />
          </Link>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-start justify-between gap-3">
              <Link href={`/product/${product.slug}`} onClick={onNavigate} className="text-[14px] text-ink hover:underline">
                {product.name}
              </Link>
              <p className="shrink-0 text-[13px] text-ink">{formatPrice(product.price * line.qty)}</p>
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-secondary">
              {line.metal ?? product.material}
              {line.size ? ` · Size ${line.size}` : ''}
              {line.qty > 1 ? ` · ${formatPrice(product.price)} each` : ''}
            </p>
            <div className="mt-auto flex items-center justify-between pt-3">
              <QtyStepper
                value={line.qty}
                onChange={(q) => setQty(line, q)}
                label={`Quantity for ${product.name}`}
                small
              />
              <button type="button" onClick={() => remove(line)} className="text-[12px] text-secondary underline underline-offset-2 hover:text-ink">
                Remove
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
