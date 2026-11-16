'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCart, lineKey } from '@/lib/store'
import { priceLines, shippingCost } from '@/lib/pricing'
import { formatPrice, cn } from '@/lib/format'
import { SHIPPING_METHODS, type ShippingMethodId } from '@/lib/config'
import { COUNTRIES, customerSchema, type DemoOrder } from '@/lib/checkout-schema'
import { useHydrated } from '@/hooks/use-hydrated'

type Errors = Partial<Record<string, string>>

export function CheckoutForm({ paymentsConfigured }: { paymentsConfigured: boolean }) {
  const { lines, clear } = useCart()
  const hydrated = useHydrated()
  const router = useRouter()
  const [method, setMethod] = useState<ShippingMethodId>('standard')
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { resolved, subtotal } = priceLines(lines)
  const shipping = shippingCost(method, subtotal)

  if (!hydrated) return <div className="wrap"><div className="skeleton h-[480px]" /></div>
  if (!lines.length)
    return (
      <div className="wrap flex flex-col items-center py-20 text-center">
        <p className="text-[22px] font-[300] text-ink">Your bag is empty</p>
        <Link href="/catalog" className="btn-outline mt-8">Explore the Collection</Link>
      </div>
    )

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    const parsed = customerSchema.safeParse({ ...data, shippingMethod: method })
    if (!parsed.success) {
      const next: Errors = {}
      for (const issue of parsed.error.issues) next[String(issue.path[0])] ??= issue.message
      setErrors(next)
      const first = Object.keys(next)[0]
      document.getElementsByName(first)[0]?.focus()
      return
    }
    setErrors({})
    setSubmitting(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...parsed.data, items: lines }),
      })
      const json = (await res.json()) as { mode?: string; url?: string; order?: DemoOrder; error?: string; issues?: { path: string; message: string }[] }
      if (!res.ok) {
        if (json.issues) {
          const next: Errors = {}
          json.issues.forEach((i) => (next[i.path.split('.')[0]] ??= i.message))
          setErrors(next)
        }
        setFormError(json.error ?? 'Something went wrong. Please try again.')
        return
      }
      if (json.mode === 'stripe' && json.url) {
        window.location.assign(json.url)
        return
      }
      if (json.mode === 'demo' && json.order) {
        try {
          sessionStorage.setItem('monauri:last-order', JSON.stringify(json.order))
        } catch {
          /* ignore */
        }
        clear()
        router.push(`/checkout/success?order=${encodeURIComponent(json.order.id)}`)
      }
    } catch {
      setFormError('We could not reach the server. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const field = (name: string, label: string, opts: { type?: string; autoComplete?: string; optional?: boolean; className?: string } = {}) => (
    <div className={opts.className}>
      <label htmlFor={`co-${name}`} className="block text-[11px] tracking-[0.12em] text-secondary uppercase">
        {label}
        {opts.optional && <span className="normal-case tracking-normal"> (optional)</span>}
      </label>
      <input
        id={`co-${name}`}
        name={name}
        type={opts.type ?? 'text'}
        autoComplete={opts.autoComplete}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `co-${name}-err` : undefined}
        className="field"
      />
      {errors[name] && (
        <p id={`co-${name}-err`} className="mt-1.5 text-[12px] text-[#9b3b3b]">
          {errors[name]}
        </p>
      )}
    </div>
  )

  return (
    <form noValidate onSubmit={onSubmit} className="wrap grid gap-12 lg:grid-cols-[1fr_420px] lg:gap-[clamp(40px,5vw,96px)]">
      <div>
        {!paymentsConfigured && (
          <div role="note" className="mb-10 border border-gold/60 bg-[#fbf8f1] px-5 py-4 text-[13px] leading-relaxed text-[#6b5a33]">
            <strong className="font-[600]">Demo checkout.</strong> No payment provider is connected, so no payment will be taken and
            no real order will be placed. Submitting creates a demonstration order confirmation only.
          </div>
        )}

        <fieldset>
          <legend className="eyebrow mb-6">Contact</legend>
          <div className="grid gap-6 sm:grid-cols-2">
            {field('email', 'Email', { type: 'email', autoComplete: 'email', className: 'sm:col-span-2' })}
            {field('phone', 'Phone', { type: 'tel', autoComplete: 'tel', optional: true, className: 'sm:col-span-2' })}
          </div>
        </fieldset>

        <fieldset className="mt-12">
          <legend className="eyebrow mb-6">Shipping address</legend>
          <div className="grid gap-6 sm:grid-cols-2">
            {field('firstName', 'First name', { autoComplete: 'given-name' })}
            {field('lastName', 'Last name', { autoComplete: 'family-name' })}
            {field('address1', 'Address', { autoComplete: 'address-line1', className: 'sm:col-span-2' })}
            {field('address2', 'Apartment, suite', { autoComplete: 'address-line2', optional: true, className: 'sm:col-span-2' })}
            {field('city', 'City', { autoComplete: 'address-level2' })}
            {field('region', 'State / Region', { autoComplete: 'address-level1', optional: true })}
            {field('postalCode', 'Postal code', { autoComplete: 'postal-code' })}
            <div>
              <label htmlFor="co-country" className="block text-[11px] tracking-[0.12em] text-secondary uppercase">
                Country
              </label>
              <select
                id="co-country"
                name="country"
                defaultValue=""
                autoComplete="country-name"
                aria-invalid={!!errors.country}
                className="field cursor-pointer"
              >
                <option value="" disabled>
                  Select
                </option>
                {COUNTRIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              {errors.country && <p className="mt-1.5 text-[12px] text-[#9b3b3b]">{errors.country}</p>}
            </div>
          </div>
        </fieldset>

        <fieldset className="mt-12">
          <legend className="eyebrow mb-6">Delivery</legend>
          <div className="grid gap-2">
            {SHIPPING_METHODS.map((m) => {
              const cost = shippingCost(m.id, subtotal)
              return (
                <label
                  key={m.id}
                  className={cn('flex cursor-pointer items-center justify-between border px-5 py-4 text-[13.5px] transition-colors', method === m.id ? 'border-ink' : 'border-subtle hover:border-ink/50')}
                >
                  <span className="flex items-center gap-3">
                    <input type="radio" name="shipping" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} className="accent-[#1f1f1f]" />
                    <span>
                      {m.label} <span className="text-secondary">· {m.detail}</span>
                    </span>
                  </span>
                  <span>{cost === 0 ? 'Complimentary' : formatPrice(cost)}</span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <fieldset className="mt-12">
          <legend className="eyebrow mb-4">Payment</legend>
          <p className="text-[13.5px] leading-relaxed text-secondary">
            {paymentsConfigured
              ? 'You will be redirected to our secure payment provider to complete your purchase. Card details are never entered on this site.'
              : 'Payments are not connected on this demonstration site. Configure a payment provider (see README) to accept real orders.'}
          </p>
        </fieldset>

        {formError && (
          <p role="alert" className="mt-8 text-[13px] text-[#9b3b3b]">
            {formError}
          </p>
        )}
        <button type="submit" disabled={submitting} className="btn-solid mt-8 w-full sm:w-auto sm:min-w-[320px]">
          {submitting ? 'Processing…' : paymentsConfigured ? `Continue to Payment — ${formatPrice(subtotal + shipping)}` : `Place Demo Order — ${formatPrice(subtotal + shipping)}`}
        </button>
      </div>

      <aside aria-label="Order summary" className="h-fit bg-ivory p-[clamp(24px,2.4vw,40px)] lg:sticky lg:top-[calc(var(--header-h)+24px)] max-lg:-order-1">
        <p className="eyebrow mb-6">Order summary</p>
        <ul className="space-y-4">
          {resolved.map(({ line, product }) => (
            <li key={lineKey(line)} className="flex gap-4">
              <div className="relative h-[84px] w-[68px] shrink-0 overflow-hidden bg-white">
                <Image src={product.images[0].src} alt="" fill sizes="68px" quality={70} className="object-cover" />
              </div>
              <div className="flex-1 text-[13px]">
                <p className="text-ink">{product.name}</p>
                <p className="mt-1 text-[12px] text-secondary">
                  {line.metal ?? product.material}
                  {line.size ? ` · Size ${line.size}` : ''} · Qty {line.qty}
                </p>
              </div>
              <p className="text-[13px]">{formatPrice(product.price * line.qty)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-black/[0.08] pt-5 text-[13.5px]">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Shipping</dt><dd>{shipping === 0 ? 'Complimentary' : formatPrice(shipping)}</dd></div>
          <div className="flex justify-between border-t border-black/[0.08] pt-3 text-[15px] text-ink"><dt>Total</dt><dd>{formatPrice(subtotal + shipping)}</dd></div>
        </dl>
        <p className="mt-4 text-[11.5px] text-secondary">Taxes, if applicable, are calculated by the payment provider.</p>
      </aside>
    </form>
  )
}
