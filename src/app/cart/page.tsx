import type { Metadata } from 'next'
import { PageIntro } from '@/components/layout/page-intro'
import { CartView } from '@/components/commerce/cart-view'

export const metadata: Metadata = { title: 'Shopping Bag', robots: { index: false } }

export default function CartPage() {
  return (
    <>
      <PageIntro title="Shopping Bag" />
      <CartView />
    </>
  )
}
