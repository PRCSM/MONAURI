import { getProductById } from '@/data/catalog'
import type { CartLine } from '@/types'
import { SHIPPING_METHODS, type ShippingMethodId } from './config'

export const MAX_QTY = 10

export function priceLines(lines: CartLine[]) {
  const resolved = lines
    .map((l) => ({ line: l, product: getProductById(l.productId) }))
    .filter((r): r is { line: CartLine; product: NonNullable<ReturnType<typeof getProductById>> } => !!r.product)
  const subtotal = resolved.reduce((s, r) => s + r.product.price * r.line.qty, 0)
  return { resolved, subtotal }
}

export function shippingCost(method: ShippingMethodId, subtotal: number) {
  const m = SHIPPING_METHODS.find((s) => s.id === method) ?? SHIPPING_METHODS[0]
  if ('freeOver' in m && subtotal >= m.freeOver) return 0
  return m.price
}
