import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { CatalogSkeleton, CatalogView } from '@/components/catalog/catalog-view'
import { PageIntro } from '@/components/layout/page-intro'
import { categories, getCategory, products } from '@/data/catalog'

export const dynamicParams = false
export const generateStaticParams = () => categories.map((c) => ({ category: c.slug }))

export async function generateMetadata({ params }: PageProps<'/catalog/[category]'>): Promise<Metadata> {
  const { category } = await params
  const c = getCategory(category)
  if (!c) return {}
  return { title: c.name, description: c.description, alternates: { canonical: `/catalog/${c.slug}` } }
}

export default async function CategoryPage({ params }: PageProps<'/catalog/[category]'>) {
  const { category } = await params
  const c = getCategory(category)
  if (!c) notFound()
  const items = products.filter((p) => p.category === c.slug)
  return (
    <>
      <PageIntro
        title={c.name}
        description={c.description}
        crumbs={[
          { href: '/', label: 'Home' },
          { href: '/catalog', label: 'Shop All' },
        ]}
      />
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogView items={items} activeCategory={c.slug} />
      </Suspense>
    </>
  )
}
