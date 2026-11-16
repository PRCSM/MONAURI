import type { Metadata } from 'next'
import { PageIntro } from '@/components/layout/page-intro'
import { FavoritesView } from '@/components/commerce/favorites-view'

export const metadata: Metadata = { title: 'Wishlist', robots: { index: false } }

export default function FavoritesPage() {
  return (
    <>
      <PageIntro title="Wishlist" description="Pieces you have saved. Your wishlist is kept on this device." />
      <FavoritesView />
    </>
  )
}
