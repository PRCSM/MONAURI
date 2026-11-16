import { SITE } from './config'

const fmt = new Intl.NumberFormat(SITE.locale, {
  style: 'currency',
  currency: SITE.currency,
  maximumFractionDigits: 0,
})

export const formatPrice = (value: number) => fmt.format(value)

export const availabilityLabel: Record<string, string> = {
  'in-stock': 'In stock',
  'low-stock': 'Only a few left',
  'made-to-order': 'Made to order',
  'sold-out': 'Sold out',
}

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
