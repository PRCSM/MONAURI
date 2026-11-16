import type { Metadata } from 'next'
import { ContentPage } from '@/components/layout/content-page'
import { SHIPPING_METHODS } from '@/lib/config'
import { formatPrice } from '@/lib/format'

export const metadata: Metadata = { title: 'Shipping & Delivery', alternates: { canonical: '/delivery' } }

export default function DeliveryPage() {
  return (
    <ContentPage
      eyebrow="Customer care"
      title="Shipping & Delivery"
      note="Demonstration policy — rates and timings come from the storefront’s demo configuration. Replace with your carrier terms before launch."
    >
      <h2>Options</h2>
      <ul>
        {SHIPPING_METHODS.map((m) => (
          <li key={m.id}>
            {m.label} ({m.detail}) — {formatPrice(m.price)}
            {'freeOver' in m ? `, complimentary on orders over ${formatPrice(m.freeOver)}` : ''}
          </li>
        ))}
      </ul>
      <h2>Made-to-order pieces</h2>
      <p>Pieces marked “Made to order” are crafted after purchase and typically ship within 4–6 weeks.</p>
      <h2>Packaging</h2>
      <p>Every order arrives in a protective pouch and gift box, with discreet outer packaging.</p>
    </ContentPage>
  )
}
