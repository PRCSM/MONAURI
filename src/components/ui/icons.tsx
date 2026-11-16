import type { SVGProps } from 'react'

const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export const MenuIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden {...base} {...p}>
    <path d="M3 8.5h18M3 15.5h18" />
  </svg>
)
export const SearchIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden {...base} {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 5 5" />
  </svg>
)
export const HeartIcon = ({ filled, ...p }: SVGProps<SVGSVGElement> & { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden {...base} fill={filled ? 'currentColor' : 'none'} {...p}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" />
  </svg>
)
export const BagIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden {...base} {...p}>
    <path d="M5 8h14l-1 12.5H6L5 8Z" />
    <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
  </svg>
)
export const CloseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden {...base} {...p}>
    <path d="m5 5 14 14M19 5 5 19" />
  </svg>
)
export const PlusIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)
export const MinusIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden {...base} {...p}>
    <path d="M5 12h14" />
  </svg>
)
export const ArrowIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...base} {...p}>
    <path d="M4 12h16m-5-5 5 5-5 5" />
  </svg>
)
