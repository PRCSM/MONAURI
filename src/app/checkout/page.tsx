import type { Metadata } from 'next'
import { PageIntro } from '@/components/layout/page-intro'
import { CheckoutForm } from '@/components/commerce/checkout-form'

export const metadata: Metadata = { title: 'Checkout', robots: { index: false } }

export default function CheckoutPage() {
  return (
    <>
      <PageIntro title="Checkout" />
      <CheckoutForm paymentsConfigured={!!process.env.STRIPE_SECRET_KEY} />
    </>
  )
}
