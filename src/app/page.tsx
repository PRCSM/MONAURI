import { Hero } from '@/components/home/hero'
import { Bestsellers } from '@/components/home/bestsellers'
import { CategoryGrid } from '@/components/home/category-grid'
import { Philosophy, CollectionFeature, Craft, Moments, FinalCta } from '@/components/home/editorial-sections'
import { bestsellers, categories, productsByCollection } from '@/data/catalog'

export default function HomePage() {
  const auri = productsByCollection('auri').filter((p) => !p.bestseller)
  return (
    <>
      <Hero />
      <Bestsellers items={bestsellers()} />
      <CategoryGrid items={categories} />
      <Philosophy />
      <CollectionFeature items={auri} />
      <Craft />
      <Moments />
      <FinalCta />
    </>
  )
}
