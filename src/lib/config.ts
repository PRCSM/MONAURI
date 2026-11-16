export const SITE = {
  name: 'MONAURI',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://monauri.vercel.app').replace(/\/$/, ''),
  description:
    'MONAURI fine jewelry — sculptural rings, earrings, necklaces and engagement rings with a quiet, editorial sensibility.',
  currency: process.env.NEXT_PUBLIC_CURRENCY || 'USD',
  locale: 'en-US',
}

/** Demo shipping configuration. Adjust to your real carrier rates. */
export const SHIPPING_METHODS = [
  { id: 'standard', label: 'Standard', detail: '5–7 business days', price: 15, freeOver: 500 },
  { id: 'express', label: 'Express', detail: '2–3 business days', price: 35 },
] as const

export type ShippingMethodId = (typeof SHIPPING_METHODS)[number]['id']
