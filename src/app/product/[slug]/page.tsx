import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCategory, getCollection, getProduct, products, relatedProducts } from '@/data/catalog'
import { ProductGallery } from '@/components/products/product-gallery'
import { ProductPurchase } from '@/components/products/product-purchase'
import { ProductCard } from '@/components/products/product-card'
import { formatPrice } from '@/lib/format'
import { SITE } from '@/lib/config'

export const dynamicParams = false
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }))

export async function generateMetadata({ params }: PageProps<'/product/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const p = getProduct(slug)
  if (!p) return {}
  return {
    title: p.name,
    description: p.description,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { title: `${p.name} — MONAURI`, description: p.description, images: [{ url: p.images[0].src, alt: p.images[0].alt }] },
  }
}

const availabilitySchema = {
  'in-stock': 'https://schema.org/InStock',
  'low-stock': 'https://schema.org/LimitedAvailability',
  'made-to-order': 'https://schema.org/PreOrder',
  'sold-out': 'https://schema.org/OutOfStock',
} as const

export default async function ProductPage({ params }: PageProps<'/product/[slug]'>) {
  const { slug } = await params
  const p = getProduct(slug)
  if (!p) notFound()
  const category = getCategory(p.category)
  const collection = getCollection(p.collection)
  const related = relatedProducts(p)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    sku: p.id,
    image: p.images.map((i) => i.src),
    brand: { '@type': 'Brand', name: 'MONAURI' },
    material: p.material,
    category: category?.name,
    offers: {
      '@type': 'Offer',
      url: `${SITE.url}/product/${p.slug}`,
      priceCurrency: SITE.currency,
      price: p.price.toFixed(2),
      availability: availabilitySchema[p.availability],
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <div className="wrap grid gap-[clamp(32px,4vw,80px)] pt-[calc(var(--header-h)+clamp(16px,2vw,32px))] lg:grid-cols-[1.15fr_1fr]">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start">
          <ProductGallery images={p.images} name={p.name} />
        </div>
        <div className="lg:max-w-[520px] lg:pt-[clamp(8px,3vw,56px)]">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap gap-2 text-[11.5px] text-secondary">
              <li>
                <Link href="/catalog" className="hover:text-ink">Shop All</Link>
              </li>
              {category && (
                <li className="flex gap-2">
                  <span aria-hidden>/</span>
                  <Link href={`/catalog/${category.slug}`} className="hover:text-ink">{category.name}</Link>
                </li>
              )}
            </ol>
          </nav>
          {collection && (
            <Link href={`/collections/${collection.slug}`} className="eyebrow hover:text-ink">
              {collection.name}
            </Link>
          )}
          <h1 className="mt-3 text-[clamp(28px,2.6vw,40px)] leading-[1.1] font-[300] text-ink">{p.name}</h1>
          <p className="mt-3 text-[16px] text-ink">{formatPrice(p.price)}</p>
          <p className="mt-6 text-[14.5px] leading-[1.75] text-[#5b5b5b]">{p.description}</p>

          <div className="mt-8">
            <ProductPurchase product={p} />
          </div>

          <div className="mt-6 divide-y divide-black/[0.08] border-y border-black/[0.08]">
            <Detail title="Details" open>
              <dl className="grid grid-cols-[120px_1fr] gap-y-2 text-[13.5px]">
                <dt className="text-secondary">Metal</dt>
                <dd>{p.metals ? p.metals.join(', ') : p.material}</dd>
                <dt className="text-secondary">Stone</dt>
                <dd>{p.stone === 'None' ? 'No stones' : (p.stoneDetails ?? p.stone)}</dd>
                {p.details.map((d) => (
                  <div key={d} className="contents">
                    <dt className="sr-only">Detail</dt>
                    <dd className="col-span-2 text-[#555]">— {d}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-[11.5px] text-secondary">Specifications shown are demonstration data.</p>
            </Detail>
            <Detail title="Shipping & Returns">
              <p>
                Complimentary standard shipping on orders over $500. Made-to-order pieces ship within 4–6 weeks. Unworn pieces may be
                returned within 30 days — see <Link href="/returns" className="underline underline-offset-2">Returns &amp; Exchanges</Link>.
              </p>
            </Detail>
            <Detail title="Jewelry Care">
              <p>
                Store pieces separately in their pouch, remove before swimming or exercise, and wipe with a soft dry cloth after
                wearing. <Link href="/care" className="underline underline-offset-2">Full care guide</Link>.
              </p>
            </Detail>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="wrap mt-[clamp(80px,9vw,160px)]">
          <h2 id="related-title" className="mb-[clamp(18px,2.2vw,36px)] text-[clamp(20px,1.95vw,30px)] font-[400] text-ink">
            You may also like
          </h2>
          <div className="grid grid-cols-2 gap-x-[var(--tile-gap)] gap-y-10 lg:grid-cols-4 lg:gap-x-[clamp(12px,1.4vw,24px)]">
            {related.map((r) => (
              <ProductCard key={r.id} product={r} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}

function Detail({ title, children, open }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[13px] tracking-[0.04em] text-ink [&::-webkit-details-marker]:hidden">
        {title}
        <span aria-hidden className="text-[18px] font-[200] transition-transform duration-300 group-open:rotate-45">+</span>
      </summary>
      <div className="mt-4 text-[13.5px] leading-[1.75] text-[#555]">{children}</div>
    </details>
  )
}
