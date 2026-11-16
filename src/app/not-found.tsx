import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[70svh] flex-col items-center justify-center pt-[var(--header-h)] text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-[clamp(32px,3.6vw,56px)] font-[300] text-ink">This page has slipped away</h1>
      <p className="mt-4 max-w-[400px] text-[14.5px] text-secondary">The page you are looking for doesn’t exist or has moved.</p>
      <div className="mt-10 flex gap-3">
        <Link href="/" className="btn-outline">Home</Link>
        <Link href="/catalog" className="btn-solid">Shop All</Link>
      </div>
    </div>
  )
}
