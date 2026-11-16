import { NextResponse } from 'next/server'
import { checkoutSchema, type DemoOrder } from '@/lib/checkout-schema'
import { getProductById } from '@/data/catalog'
import { shippingCost } from '@/lib/pricing'
import { SITE, SHIPPING_METHODS } from '@/lib/config'

/**
 * Server-side checkout.
 * - Validates input and re-prices every line from the catalog (client prices are never trusted).
 * - With STRIPE_SECRET_KEY set: creates a Stripe Checkout Session (hosted payment page — no card data touches this app).
 * - Without it: returns a clearly-labelled DEMO order. No payment is taken or claimed.
 */
export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
  const parsed = checkoutSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the highlighted fields.', issues: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })) }, { status: 422 })
  }
  const input = parsed.data

  const lines = []
  for (const item of input.items) {
    const p = getProductById(item.productId)
    if (!p) return NextResponse.json({ error: 'An item in your bag is no longer available.' }, { status: 409 })
    if (p.availability === 'sold-out') return NextResponse.json({ error: `${p.name} is sold out.` }, { status: 409 })
    if (p.sizes && (!item.size || !p.sizes.includes(item.size))) return NextResponse.json({ error: `Select a valid size for ${p.name}.` }, { status: 422 })
    if (item.metal && !(p.metals ?? [p.material]).includes(item.metal as never)) return NextResponse.json({ error: `Invalid metal for ${p.name}.` }, { status: 422 })
    lines.push({ product: p, qty: item.qty, size: item.size, metal: item.metal })
  }
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0)
  const shipping = shippingCost(input.shippingMethod, subtotal)
  const total = subtotal + shipping

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (stripeKey) {
    const origin = req.headers.get('origin') ?? SITE.url
    const form = new URLSearchParams()
    form.set('mode', 'payment')
    form.set('customer_email', input.email)
    form.set('success_url', `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`)
    form.set('cancel_url', `${origin}/checkout`)
    lines.forEach((l, i) => {
      const variant = [l.metal, l.size && `Size ${l.size}`].filter(Boolean).join(' · ')
      form.set(`line_items[${i}][quantity]`, String(l.qty))
      form.set(`line_items[${i}][price_data][currency]`, SITE.currency.toLowerCase())
      form.set(`line_items[${i}][price_data][unit_amount]`, String(Math.round(l.product.price * 100)))
      form.set(`line_items[${i}][price_data][product_data][name]`, variant ? `${l.product.name} (${variant})` : l.product.name)
    })
    if (shipping > 0) {
      const m = SHIPPING_METHODS.find((s) => s.id === input.shippingMethod)!
      const i = lines.length
      form.set(`line_items[${i}][quantity]`, '1')
      form.set(`line_items[${i}][price_data][currency]`, SITE.currency.toLowerCase())
      form.set(`line_items[${i}][price_data][unit_amount]`, String(shipping * 100))
      form.set(`line_items[${i}][price_data][product_data][name]`, `${m.label} shipping`)
    }
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${stripeKey}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    })
    const data = (await res.json()) as { url?: string; error?: { message?: string } }
    if (!res.ok || !data.url) {
      console.error('Stripe session error', data.error?.message)
      return NextResponse.json({ error: 'Payment could not be started. Please try again.' }, { status: 502 })
    }
    return NextResponse.json({ mode: 'stripe', url: data.url })
  }

  const order: DemoOrder = {
    id: `DEMO-${Date.now().toString(36).toUpperCase()}`,
    mode: 'demo',
    createdAt: new Date().toISOString(),
    email: input.email,
    name: `${input.firstName} ${input.lastName}`,
    lines: lines.map((l) => ({ name: l.product.name, qty: l.qty, unitPrice: l.product.price, size: l.size, metal: l.metal })),
    subtotal,
    shipping,
    total,
    currency: SITE.currency,
  }
  return NextResponse.json({ mode: 'demo', order })
}
