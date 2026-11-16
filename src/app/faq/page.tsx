import type { Metadata } from 'next'
import Link from 'next/link'
import { PageIntro } from '@/components/layout/page-intro'

export const metadata: Metadata = { title: 'FAQs', alternates: { canonical: '/faq' } }

const FAQ = [
  { q: 'How do I find my ring size?', a: 'Measure a ring that fits the intended finger, or visit a local jeweler for a sizing. Every ring includes one complimentary resize within 30 days.' },
  { q: 'How long does delivery take?', a: 'Standard delivery takes 5–7 business days and express 2–3. Made-to-order pieces ship within 4–6 weeks.' },
  { q: 'Can I return or exchange a piece?', a: 'Unworn pieces can be returned within 30 days. Engraved and made-to-order pieces are final sale unless faulty.' },
  { q: 'How should I care for my jewelry?', a: 'Remove pieces before swimming or exercise, store them separately and wipe with a soft cloth. See our care guide for details.' },
  { q: 'Is my wishlist saved?', a: 'Your wishlist and bag are saved in this browser on this device.' },
  { q: 'Is this a real store?', a: 'This is a demonstration storefront. Products, prices and specifications are illustrative, and checkout runs in demo mode until a payment provider is connected.' },
]

export default function FaqPage() {
  return (
    <>
      <PageIntro eyebrow="Customer care" title="Frequently Asked Questions" />
      <div className="wrap grid lg:grid-cols-12">
        <div className="divide-y divide-black/[0.08] border-y border-black/[0.08] lg:col-span-7 lg:col-start-4">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-[300] text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden className="text-[20px] font-[200] transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-[560px] text-[14.5px] leading-[1.75] text-[#555]">{f.a}</p>
            </details>
          ))}
          <p className="py-8 text-[14px] text-secondary">
            Still have a question? <Link href="/contact" className="link-underline text-ink">Contact us</Link>.
          </p>
        </div>
      </div>
    </>
  )
}
