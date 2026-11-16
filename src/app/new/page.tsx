import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CatalogSkeleton, CatalogView } from '@/components/catalog/catalog-view'
import { PageIntro } from '@/components/layout/page-intro'
import { products } from '@/data/catalog'

export const metadata: Metadata = {
  title: 'New Arrivals',
  description: 'The latest pieces from MONAURI.',
  alternates: { canonical: '/new' },
}

export default function NewPage() {
  const items = [...products].filter((p) => p.isNew).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return (
    <>
      <PageIntro eyebrow="Just arrived" title="New Arrivals" description="Recently finished at the bench — new forms, new stones, the same quiet line." />
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogView items={items} />
      </Suspense>
    </>
  )
}
