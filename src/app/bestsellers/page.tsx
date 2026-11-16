import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CatalogSkeleton, CatalogView } from '@/components/catalog/catalog-view'
import { PageIntro } from '@/components/layout/page-intro'
import { products } from '@/data/catalog'

export const metadata: Metadata = {
  title: 'Bestsellers',
  description: 'The MONAURI pieces our clients return to most.',
  alternates: { canonical: '/bestsellers' },
}

export default function BestsellersPage() {
  const items = products.filter((p) => p.bestseller)
  return (
    <>
      <PageIntro eyebrow="Most loved" title="Bestsellers" description="The pieces our clients return to again and again." />
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogView items={items} />
      </Suspense>
    </>
  )
}
