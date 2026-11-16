'use client'

import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import type { DemoOrder } from '@/lib/checkout-schema'
import { formatPrice } from '@/lib/format'

const read = () => {
  try {
    return sessionStorage.getItem('monauri:last-order')
  } catch {
    return null
  }
}
const noop = () => () => {}

export function OrderConfirmation({ orderId }: { orderId?: string }) {
  const raw = useSyncExternalStore(noop, read, () => undefined)
  if (raw === undefined) return <div className="skeleton mx-auto h-[260px] max-w-[640px]" />
  const order = raw ? (JSON.parse(raw) as DemoOrder) : null
  if (!order || (orderId && order.id !== orderId)) {
    return (
      <div className="text-center">
        <p className="text-[15px] text-secondary">We couldn’t find this order on this device.</p>
        <Link href="/catalog" className="btn-outline mt-8">Continue Shopping</Link>
      </div>
    )
  }
  return (
    <div className="mx-auto max-w-[640px]">
      <div role="note" className="mb-10 border border-gold/60 bg-[#fbf8f1] px-5 py-4 text-[13px] leading-relaxed text-[#6b5a33]">
        <strong className="font-[600]">Demonstration order.</strong> No payment was taken and nothing will ship. This confirmation shows
        how the post-purchase page will look once payments are connected.
      </div>
      <p className="eyebrow">Order {order.id}</p>
      <p className="mt-3 text-[14.5px] text-[#5b5b5b]">
        Thank you, {order.name.split(' ')[0]}. A confirmation would be sent to <span className="text-ink">{order.email}</span>.
      </p>
      <ul className="mt-8 divide-y divide-black/[0.07] border-y border-black/[0.07]">
        {order.lines.map((l, i) => (
          <li key={i} className="flex justify-between gap-4 py-4 text-[13.5px]">
            <span>
              {l.name}
              <span className="block text-[12px] text-secondary">
                {[l.metal, l.size && `Size ${l.size}`, `Qty ${l.qty}`].filter(Boolean).join(' · ')}
              </span>
            </span>
            <span>{formatPrice(l.unitPrice * l.qty)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-5 space-y-2 text-[13.5px]">
        <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
        <div className="flex justify-between"><dt>Shipping</dt><dd>{order.shipping === 0 ? 'Complimentary' : formatPrice(order.shipping)}</dd></div>
        <div className="flex justify-between text-[15px] text-ink"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
      </dl>
      <div className="mt-12 text-center">
        <Link href="/catalog" className="btn-outline">Continue Shopping</Link>
      </div>
    </div>
  )
}
