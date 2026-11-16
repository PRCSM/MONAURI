import type { Metadata } from 'next'
import { ContentPage } from '@/components/layout/content-page'

export const metadata: Metadata = { title: 'Returns & Exchanges', alternates: { canonical: '/returns' } }

export default function ReturnsPage() {
  return (
    <ContentPage eyebrow="Customer care" title="Returns & Exchanges" note="Demonstration policy — review and adapt to your business and local consumer law before launch.">
      <h2>30-day returns</h2>
      <p>Unworn pieces in their original condition and packaging may be returned within 30 days of delivery for a refund to the original payment method.</p>
      <h2>Exchanges & resizing</h2>
      <p>Ring sizes can be exchanged or resized once, complimentary, within 30 days of delivery.</p>
      <h2>Exceptions</h2>
      <ul>
        <li>Engraved, personalised and made-to-order pieces cannot be returned unless faulty.</li>
        <li>Earrings can be returned only if unworn and with protective backs intact.</li>
      </ul>
      <h2>How to start a return</h2>
      <p>Contact us with your order number through the contact page, and we will send instructions.</p>
    </ContentPage>
  )
}
