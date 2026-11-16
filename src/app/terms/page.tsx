import type { Metadata } from 'next'
import { ContentPage } from '@/components/layout/content-page'

export const metadata: Metadata = { title: 'Terms & Conditions', alternates: { canonical: '/terms' } }

export default function TermsPage() {
  return (
    <ContentPage title="Terms & Conditions" note="Template text for a demonstration site. Replace with terms reviewed for your business before launch.">
      <h2>Demonstration storefront</h2>
      <p>Products, prices, materials and availability shown on this site are illustrative. No order placed in demo mode is binding and no payment is taken.</p>
      <h2>Pricing</h2>
      <p>Prices are shown in US dollars. Final prices, shipping and any taxes are confirmed at checkout.</p>
      <h2>Images</h2>
      <p>Photography is used for demonstration and may not depict the exact product listed.</p>
    </ContentPage>
  )
}
