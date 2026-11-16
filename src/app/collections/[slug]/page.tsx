import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { collections, getCollection, productsByCollection } from '@/data/catalog'
import { RevealImage, RevealText } from '@/components/editorial/reveal'
import { ProductCard } from '@/components/products/product-card'
import Link from 'next/link'

export const dynamicParams = false
export const generateStaticParams = () => collections.map((c) => ({ slug: c.slug }))

export async function generateMetadata({ params }: PageProps<'/collections/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const c = getCollection(slug)
  if (!c) return {}
  return {
    title: `${c.name} Collection`,
    description: c.description,
    alternates: { canonical: `/collections/${c.slug}` },
    openGraph: { type: 'website', siteName: 'MONAURI', url: `/collections/${c.slug}`, title: `${c.name} Collection — MONAURI`, description: c.description, images: [{ url: c.image.src, alt: c.image.alt }] },
  }
}

export default async function CollectionPage({ params }: PageProps<'/collections/[slug]'>) {
  const { slug } = await params
  const c = getCollection(slug)
  if (!c) notFound()
  const items = productsByCollection(c.slug)
  return (
    <>
      <section className="grid pt-[var(--header-h)] lg:grid-cols-2">
        <RevealImage image={c.image} sizes="(min-width:1024px) 50vw, 100vw" className="aspect-[4/5] lg:aspect-auto lg:min-h-[calc(100svh-var(--header-h))]" />
        <RevealText className="wrap flex flex-col justify-center py-[clamp(48px,6vw,120px)] lg:px-[clamp(48px,7vw,140px)]">
          <nav aria-label="Breadcrumb" data-rt className="mb-8 text-[11.5px] text-secondary">
            <Link href="/collections" className="hover:text-ink">Collections</Link>
            <span aria-hidden> / </span>
            <span>{c.name}</span>
          </nav>
          <p data-rt className="eyebrow mb-4">{c.tagline}</p>
          <h1 data-rt className="text-[clamp(34px,3.8vw,60px)] leading-[1.05] font-[300] text-ink">{c.name}</h1>
          <p data-rt className="mt-7 max-w-[460px] text-[clamp(14px,1.05vw,16px)] leading-[1.75] text-[#5b5b5b]">{c.description}</p>
          <p data-rt className="mt-8 text-[12px] text-secondary">{items.length} pieces</p>
        </RevealText>
      </section>
      <section aria-label={`${c.name} pieces`} className="wrap mt-[clamp(56px,6vw,110px)]">
        <div className="grid grid-cols-2 gap-x-[var(--tile-gap)] gap-y-[clamp(32px,3.4vw,56px)] lg:grid-cols-4 lg:gap-x-[clamp(12px,1.4vw,24px)]">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  )
}
