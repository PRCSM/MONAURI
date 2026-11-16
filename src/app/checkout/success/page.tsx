import type { Metadata } from 'next'
import Link from 'next/link'
import { OrderConfirmation } from '@/components/commerce/order-confirmation'

export const metadata: Metadata = { title: 'Order Confirmation', robots: { index: false } }

async function stripeStatus(sessionId: string) {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return null
  const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
    headers: { Authorization: `Bearer ${key}` },
    cache: 'no-store',
  })
  if (!res.ok) return null
  return (await res.json()) as { payment_status: string; customer_details?: { email?: string } }
}

export default async function SuccessPage({ searchParams }: PageProps<'/checkout/success'>) {
  const sp = await searchParams
  const sessionId = typeof sp.session_id === 'string' ? sp.session_id : undefined
  const orderId = typeof sp.order === 'string' ? sp.order : undefined
  const session = sessionId ? await stripeStatus(sessionId) : null

  return (
    <div className="wrap pt-[calc(var(--header-h)+clamp(48px,6vw,110px))]">
      <h1 className="mb-10 text-center text-[clamp(32px,3.6vw,56px)] leading-[1.05] font-[300] text-ink">
        {session && session.payment_status !== 'paid' ? 'Payment pending' : 'Thank you'}
      </h1>
      {session ? (
        <div className="mx-auto max-w-[560px] text-center text-[14.5px] leading-relaxed text-[#5b5b5b]">
          {session.payment_status === 'paid'
            ? `Your payment was received. A confirmation has been sent to ${session.customer_details?.email ?? 'your email'}.`
            : 'Your payment has not been confirmed yet. You will receive an email once it completes.'}
          <div className="mt-10">
            <Link href="/catalog" className="btn-outline">Continue Shopping</Link>
          </div>
        </div>
      ) : (
        <OrderConfirmation orderId={orderId} />
      )}
    </div>
  )
}
