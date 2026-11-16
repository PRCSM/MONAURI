import Link from 'next/link'

const GROUPS = [
  {
    title: 'Explore',
    links: [
      { href: '/catalog', label: 'Shop All' },
      { href: '/new', label: 'New Arrivals' },
      { href: '/collections', label: 'Collections' },
      { href: '/bestsellers', label: 'Bestsellers' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { href: '/delivery', label: 'Shipping & Delivery' },
      { href: '/returns', label: 'Returns & Exchanges' },
      { href: '/care', label: 'Jewelry Care' },
      { href: '/faq', label: 'FAQs' },
    ],
  },
  {
    title: 'About MONAURI',
    links: [
      { href: '/about', label: 'Our Story' },
      { href: '/craftsmanship', label: 'Craftsmanship' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms & Conditions' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-[clamp(80px,9vw,160px)] border-t border-black/[0.06] bg-white">
      <div className="wrap grid gap-12 pt-[clamp(56px,6vw,96px)] pb-12 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
        <div>
          <Link href="/" className="font-serif text-[26px] tracking-[0.14em] text-ink">
            MONAURI
          </Link>
          <p className="mt-4 max-w-[280px] text-[13px] leading-relaxed text-secondary">
            Fine jewelry with a quiet, sculptural line — made to become part of you.
          </p>
        </div>
        {GROUPS.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <p className="eyebrow mb-5">{g.title}</p>
            <ul className="space-y-3 text-[13.5px] text-foreground">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-quiet hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="wrap flex flex-col gap-2 border-t border-black/[0.06] py-6 text-[11.5px] text-secondary sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} MONAURI. All rights reserved.</p>
        <p>Demonstration storefront — products, prices and specifications are illustrative.</p>
      </div>
    </footer>
  )
}
