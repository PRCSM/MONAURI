import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageIntro } from '@/components/layout/page-intro'
import { collections, productsByCollection } from '@/data/catalog'

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Auri, Lumière, Calla Bridal and Linea Essentials — the MONAURI collections.',
  alternates: { canonical: '/collections' },
}

export default function CollectionsPage() {
  return (
    <>
      <PageIntro title="Collections" description="Four families of pieces, each built around a single idea." />
      <div className="wrap grid gap-x-[var(--tile-gap)] gap-y-[clamp(40px,4vw,72px)] md:grid-cols-2">
        {collections.map((c, i) => (
          <Link key={c.slug} href={`/collections/${c.slug}`} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden bg-ivory md:aspect-[5/6]">
              <Image
                src={c.image.src}
                alt={c.image.alt}
                fill
                priority={i < 2}
                quality={80}
                sizes="(min-width:768px) 50vw, 100vw"
                style={c.image.position ? { objectPosition: c.image.position } : undefined}
                className="object-cover transition-transform duration-[1100ms] ease-[var(--ease-lux)] group-hover:scale-[1.025]"
              />
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <div>
                <p className="eyebrow">{c.tagline}</p>
                <h2 className="mt-2 text-[clamp(22px,2vw,30px)] font-[300] text-ink">{c.name}</h2>
              </div>
              <span className="text-[12px] text-secondary">{productsByCollection(c.slug).length} pieces</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
