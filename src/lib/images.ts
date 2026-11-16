/**
 * Remote image helpers. Photos are hotlinked from the Unsplash and Pexels CDNs
 * (both permit hotlinking) and optimized by next/image at request time.
 * Swap these for your own product photography in /public/images when available.
 */
export const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2000&q=80`

export const pexels = (id: number, ext: 'jpeg' | 'png' = 'jpeg') =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${ext}?auto=compress&cs=tinysrgb&w=2000`

/** Local campaign photography (generated, optimized, in /public/images). */
export const LOCAL = {
  heroDesktop: '/images/hero/hero-desktop.jpg',
  heroMobile: '/images/hero/hero-mobile.jpg',
  callaLilyRing: '/images/collections/calla-lily-ring.jpg',
  callaBridal: '/images/collections/calla-bridal.jpg',
  engagement: '/images/categories/engagement.jpg',
  philosophy: '/images/editorial/philosophy.jpg',
  callaPearMacro: '/images/products/calla-pear-macro.jpg',
} as const

export const IMG = {
  heroLily: unsplash('photo-1778409556316-9694ba30edd7'),
  heroLilyAlt: unsplash('photo-1778409556359-971cf7969312'),
  lilyShadow: unsplash('photo-1744296813791-5344fbf16af8'),
  // Products
  goldRingWhite: unsplash('photo-1598560917807-1bae44bd2be8'),
  goldHoopsWhite: unsplash('photo-1623279743107-152e86999257'),
  hoopsDiamondSatin: unsplash('photo-1777999745582-781ebbd8c7b9'),
  goldPendantFabric: pexels(17833829),
  twistedHoops: unsplash('photo-1617038220319-276d3cfab638'),
  ovalPendant: unsplash('photo-1783541507490-edb026e2a961'),
  threeRingsBox: unsplash('photo-1631982690223-8aa4be0a2497'),
  charmBracelets: unsplash('photo-1778000000743-87e855360c51'),
  goldBraceletTextile: unsplash('photo-1625792508300-0e1f913a3a50'),
  silverPendant: pexels(16109190),
  emeraldEarrings: pexels(7258925, 'png'),
  emeraldRing: pexels(32786083),
  diamondStuds: unsplash('photo-1787520309842-6a8e4b7cdd7f'),
  goldRingTextile: unsplash('photo-1617038260897-41a1f14a8ca0'),
  pinkGemRing: unsplash('photo-1603561591411-07134e71a2a9'),
  weddingBands: unsplash('photo-1615655114865-4cc1bda5901e'),
  handRing: unsplash('photo-1623251209756-e7a6fad1cf94'),
  chainBraceletMagazine: unsplash('photo-1602173574767-37ac01994b2a'),
  goldNecklaceTextile: unsplash('photo-1625792508553-5e66a81659fa'),
  goldNecklaceTextile2: unsplash('photo-1625792508272-bc6ad2788b14'),
  earringsPillow: pexels(15491634),
  roundPendantsMarble: pexels(4735887),
  silverChain: pexels(16124724),
  // Editorial / lifestyle
  handsRings: unsplash('photo-1481980235850-66e47651e431'),
  handsClasped: unsplash('photo-1769038931426-dba74f079ccd'),
  necklaceVNeck: unsplash('photo-1585960622850-ed33c41d6418'),
  ringsAndNecklace: unsplash('photo-1633934542430-0905ccb5f050'),
  benchWorking: unsplash('photo-1772442125267-7640b4b5f2fe'),
  benchExamining: unsplash('photo-1772442125263-c9dd28bbd938'),
  toolInHand: unsplash('photo-1516652695352-6118f7cc1a07'),
  windowLight: unsplash('photo-1521694139475-da661702d635'),
  necklaceShadow: unsplash('photo-1725033796942-bd6100a5b838'),
  ringInPlant: unsplash('photo-1623251208571-42d05df0c77b'),
  tissueBox: unsplash('photo-1580582202907-d01fd0bd4c87'),
} as const
