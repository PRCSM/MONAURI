import type { Product } from '@/types'

export const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
] as const

export const PRICE_RANGES = [
  { id: 'u500', label: 'Under $500', min: 0, max: 499 },
  { id: '500-1000', label: '$500 – $1,000', min: 500, max: 1000 },
  { id: '1000-2500', label: '$1,000 – $2,500', min: 1001, max: 2500 },
  { id: 'o2500', label: 'Over $2,500', min: 2501, max: Infinity },
] as const

export interface FilterState {
  material: string[]
  stone: string[]
  price: string[]
  available: boolean
  sort: string
}

const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : [])

export function parseFilters(sp: URLSearchParams): FilterState {
  return {
    material: list(sp.get('material')),
    stone: list(sp.get('stone')),
    price: list(sp.get('price')),
    available: sp.get('available') === '1',
    sort: sp.get('sort') || 'featured',
  }
}

export function applyFilters(items: Product[], f: FilterState) {
  let out = items.filter((p) => {
    if (f.material.length && !f.material.some((m) => p.material === m || p.metals?.includes(m as never))) return false
    if (f.stone.length && !f.stone.includes(p.stone)) return false
    if (f.price.length) {
      const ok = f.price.some((id) => {
        const r = PRICE_RANGES.find((x) => x.id === id)
        return r ? p.price >= r.min && p.price <= r.max : true
      })
      if (!ok) return false
    }
    if (f.available && p.availability === 'sold-out') return false
    return true
  })
  out = [...out]
  switch (f.sort) {
    case 'newest':
      out.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      break
    case 'price-asc':
      out.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      out.sort((a, b) => b.price - a.price)
      break
    default:
      out.sort((a, b) => Number(!!b.featured || !!b.bestseller) - Number(!!a.featured || !!a.bestseller))
  }
  return out
}

export function searchProducts(items: Product[], q: string, categoryNames: Record<string, string>, collectionNames: Record<string, string>) {
  const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean)
  if (!terms.length) return []
  return items.filter((p) => {
    const hay = [p.name, p.material, p.stone, categoryNames[p.category], collectionNames[p.collection], p.description]
      .join(' ')
      .toLowerCase()
    return terms.every((t) => hay.includes(t))
  })
}
