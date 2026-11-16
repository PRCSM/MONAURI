import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CatalogSkeleton, CatalogView } from '@/components/catalog/catalog-view'
import { PageIntro } from '@/components/layout/page-intro'
import { products } from '@/data/catalog'

export const metadata: Metadata = {
  title: 'Shop All Jewelry',
  description: 'Rings, earrings, necklaces, bracelets and engagement rings from MONAURI.',
  alternates: { canonical: '/catalog' },
}

export default function CatalogPage() {
  return (
    <>
      <PageIntro title="Shop All" description="Every MONAURI piece, from everyday gold to the stones you will keep for a lifetime." />
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogView items={products} />
      </Suspense>
    </>
  )
}
