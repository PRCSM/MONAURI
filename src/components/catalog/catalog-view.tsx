'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState, useTransition } from 'react'
import type { Product } from '@/types'
import { categories, MATERIALS, STONES } from '@/data/catalog'
import { applyFilters, parseFilters, PRICE_RANGES, SORTS, type FilterState } from '@/lib/filters'
import { cn } from '@/lib/format'
import { ProductCard } from '@/components/products/product-card'
import { MinusIcon, PlusIcon } from '@/components/ui/icons'

const TABS = [{ slug: '', name: 'All' }, ...categories.map((c) => ({ slug: c.slug, name: c.name }))]

export function CatalogView({ items, activeCategory }: { items: Product[]; activeCategory?: string }) {
  const sp = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const filters = useMemo(() => parseFilters(new URLSearchParams(sp.toString())), [sp])
  const results = useMemo(() => applyFilters(items, filters), [items, filters])
  const activeCount = filters.material.length + filters.stone.length + filters.price.length + (filters.available ? 1 : 0)
  const [open, setOpen] = useState(activeCount > 0)

  // Only offer facet values present in this listing
  const materials = MATERIALS.filter((m) => items.some((p) => p.material === m || p.metals?.includes(m)))
  const stones = STONES.filter((s) => items.some((p) => p.stone === s))
  const showTabs = pathname.startsWith('/catalog')

  const update = (next: Partial<FilterState>) => {
    const f = { ...filters, ...next }
    const params = new URLSearchParams()
    if (f.material.length) params.set('material', f.material.join(','))
    if (f.stone.length) params.set('stone', f.stone.join(','))
    if (f.price.length) params.set('price', f.price.join(','))
    if (f.available) params.set('available', '1')
    if (f.sort && f.sort !== 'featured') params.set('sort', f.sort)
    const qs = params.toString()
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }))
  }
  const toggleIn = (key: 'material' | 'stone' | 'price', value: string) => {
    const list = filters[key]
    update({ [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] })
  }
  const qsSuffix = sp.toString() ? `?${sp.toString()}` : ''

  return (
    <div className="wrap">
      {/* Toolbar */}
      <div className="sticky top-[var(--header-h)] z-30 -mx-[var(--gutter)] border-b border-black/[0.06] bg-white/95 px-[var(--gutter)] backdrop-blur-md">
        <div className="flex min-h-[56px] flex-wrap items-center justify-between gap-x-8 gap-y-2 py-2">
          {showTabs ? (
            <nav aria-label="Categories" className="-mx-1 flex max-w-full gap-1 overflow-x-auto">
              {TABS.map((t) => {
                const href = t.slug ? `/catalog/${t.slug}` : '/catalog'
                const active = (activeCategory ?? '') === t.slug
                return (
                  <Link
                    key={t.slug || 'all'}
                    href={`${href}${qsSuffix}`}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'shrink-0 px-2 py-2 text-[12.5px] whitespace-nowrap transition-colors',
                      active ? 'text-ink underline underline-offset-[6px]' : 'text-secondary hover:text-ink',
                    )}
                  >
                    {t.name}
                  </Link>
                )
              })}
            </nav>
          ) : (
            <span className="text-[12.5px] text-secondary">
              {results.length} {results.length === 1 ? 'piece' : 'pieces'}
            </span>
          )}
          <div className="ml-auto flex items-center gap-6">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="filter-panel"
              className="flex items-center gap-2 text-[12.5px] text-ink"
            >
              {open ? <MinusIcon /> : <PlusIcon />}
              Filters{activeCount > 0 && ` (${activeCount})`}
            </button>
            <label className="flex items-center gap-2 text-[12.5px] text-secondary">
              <span className="max-sm:sr-only">Sort by</span>
              <select
                value={filters.sort}
                onChange={(e) => update({ sort: e.target.value })}
                className="cursor-pointer bg-transparent py-2 text-ink focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Filter panel */}
        <div id="filter-panel" hidden={!open} className="grid gap-8 pt-4 pb-8 sm:grid-cols-2 lg:grid-cols-4">
          <FacetGroup legend="Material">
            {materials.map((m) => (
              <Check key={m} label={m} checked={filters.material.includes(m)} onChange={() => toggleIn('material', m)} />
            ))}
          </FacetGroup>
          <FacetGroup legend="Stone">
            {stones.map((s) => (
              <Check key={s} label={s === 'None' ? 'No stone' : s} checked={filters.stone.includes(s)} onChange={() => toggleIn('stone', s)} />
            ))}
          </FacetGroup>
          <FacetGroup legend="Price">
            {PRICE_RANGES.map((r) => (
              <Check key={r.id} label={r.label} checked={filters.price.includes(r.id)} onChange={() => toggleIn('price', r.id)} />
            ))}
          </FacetGroup>
          <FacetGroup legend="Availability">
            <Check label="Hide sold out" checked={filters.available} onChange={() => update({ available: !filters.available })} />
            {activeCount > 0 && (
              <button
                type="button"
                onClick={() => update({ material: [], stone: [], price: [], available: false })}
                className="mt-4 self-start text-[12.5px] text-ink underline underline-offset-4"
              >
                Clear all filters
              </button>
            )}
          </FacetGroup>
        </div>
      </div>

      {/* Results */}
      <p className="sr-only" aria-live="polite">
        {results.length} {results.length === 1 ? 'piece' : 'pieces'} shown
      </p>
      <div className={cn('pt-[clamp(24px,2.4vw,40px)] transition-opacity duration-300', pending && 'opacity-50')} aria-busy={pending}>
        {results.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <p className="text-[22px] font-[300] text-ink">No pieces match these filters</p>
            <p className="mt-3 max-w-[340px] text-[14px] text-secondary">Try removing a filter or two — or explore the full collection.</p>
            <button
              type="button"
              onClick={() => update({ material: [], stone: [], price: [], available: false })}
              className="btn-outline mt-8"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-[var(--tile-gap)] gap-y-[clamp(32px,3.4vw,56px)] lg:grid-cols-4 lg:gap-x-[clamp(12px,1.4vw,24px)]">
            {results.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 4} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FacetGroup({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="eyebrow mb-3">{legend}</legend>
      {children}
    </fieldset>
  )
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 text-[13.5px] text-foreground">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden
        className="grid h-[14px] w-[14px] place-items-center border border-black/30 transition-colors peer-checked:border-ink peer-checked:bg-ink peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink"
      >
        <svg viewBox="0 0 12 12" className={cn('h-2.5 w-2.5 text-white', !checked && 'invisible')}>
          <path d="m2.5 6.2 2.2 2.2 4.8-4.8" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </span>
      <span className="group-hover:text-ink">{label}</span>
    </label>
  )
}

export function CatalogSkeleton() {
  return (
    <div className="wrap pt-24">
      <div className="grid grid-cols-2 gap-x-[var(--tile-gap)] gap-y-12 lg:grid-cols-4 lg:gap-x-[clamp(12px,1.4vw,24px)]">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="skeleton aspect-[3/4]" />
            <div className="skeleton mt-4 h-3 w-2/3" />
            <div className="skeleton mt-2 h-3 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  )
}
