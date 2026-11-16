import type { MetadataRoute } from 'next'
import { categories, collections, products } from '@/data/catalog'
import { SITE } from '@/lib/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/catalog', '/new', '/bestsellers', '/collections', '/about', '/craftsmanship', '/care', '/delivery', '/returns', '/contact', '/faq', '/privacy', '/terms']
  return [
    ...pages.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.6 })),
    ...categories.map((c) => ({ url: `${SITE.url}/catalog/${c.slug}`, priority: 0.8 })),
    ...collections.map((c) => ({ url: `${SITE.url}/collections/${c.slug}`, priority: 0.7 })),
    ...products.map((p) => ({ url: `${SITE.url}/product/${p.slug}`, lastModified: p.createdAt, priority: 0.8 })),
  ]
}
