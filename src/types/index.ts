export type CategorySlug = 'rings' | 'earrings' | 'necklaces' | 'bracelets' | 'engagement-rings'

export type Material = '18k Yellow Gold' | '18k White Gold' | '14k Rose Gold' | 'Sterling Silver'

export type Stone = 'None' | 'White Topaz' | 'Diamond' | 'Emerald' | 'Pink Tourmaline' | 'Yellow Sapphire'

export type Availability = 'in-stock' | 'low-stock' | 'made-to-order' | 'sold-out'

export interface ImageAsset {
  src: string
  alt: string
  /** CSS object-position, used to tune crops per image */
  position?: string
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  details: string[]
  category: CategorySlug
  collection: string
  /** Whole currency units (configured currency, USD by default) */
  price: number
  images: ImageAsset[]
  material: Material
  /** Selectable metal finishes (variant). Price is identical across finishes. */
  metals?: Material[]
  stone: Stone
  stoneDetails?: string
  /** US ring sizes; only present for ring products */
  sizes?: string[]
  availability: Availability
  bestseller?: boolean
  featured?: boolean
  isNew?: boolean
  /** ISO date used for "Newest" sorting */
  createdAt: string
}

export interface Category {
  slug: CategorySlug
  name: string
  description: string
  image: ImageAsset
}

export interface Collection {
  slug: string
  name: string
  tagline: string
  description: string
  image: ImageAsset
}

export interface CartLine {
  productId: string
  qty: number
  size?: string
  metal?: Material
}
