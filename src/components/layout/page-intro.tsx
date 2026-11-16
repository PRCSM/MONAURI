import Link from 'next/link'

export function PageIntro({
  title,
  description,
  eyebrow,
  crumbs,
}: {
  title: string
  description?: string
  eyebrow?: string
  crumbs?: { href: string; label: string }[]
}) {
  return (
    <div className="wrap pt-[calc(var(--header-h)+clamp(40px,5vw,88px))] pb-[clamp(28px,3vw,48px)]">
      {crumbs && (
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap gap-2 text-[11.5px] text-secondary">
            {crumbs.map((c, i) => (
              <li key={c.href} className="flex gap-2">
                {i > 0 && <span aria-hidden>/</span>}
                <Link href={c.href} className="hover:text-ink">
                  {c.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      )}
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h1 className="text-[clamp(32px,3.6vw,56px)] leading-[1.05] font-[300] tracking-[-0.01em] text-ink">{title}</h1>
      {description && <p className="mt-5 max-w-[560px] text-[clamp(14px,1.05vw,16px)] leading-[1.7] text-[#5b5b5b]">{description}</p>}
    </div>
  )
}
