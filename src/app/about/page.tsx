import type { Metadata } from 'next'
import Link from 'next/link'
import { ContentPage } from '@/components/layout/content-page'
import { RevealImage } from '@/components/editorial/reveal'
import { IMG, LOCAL } from '@/lib/images'

export const metadata: Metadata = { title: 'Our Story', description: 'The idea behind MONAURI fine jewelry.', alternates: { canonical: '/about' } }

export default function AboutPage() {
  return (
    <ContentPage
      eyebrow="Our story"
      title="Jewelry that becomes you"
      description="MONAURI began with a single flower and a simple belief: the most beautiful jewelry is the kind that feels like it was always yours."
      image={{ src: LOCAL.callaLilyRing, alt: 'A white calla lily with a pear-cut ring on its stem', position: '82% 45%' }}
    >
      <p>
        The calla lily is a study in restraint — one continuous curve, nothing added that does not need to be there. It became the
        starting point for our first ring, and it still shapes how we design: a single idea, refined until only the essential remains.
      </p>
      <h2>Quiet by design</h2>
      <p>
        We make fine jewelry for everyday life and for the moments that change it. Pieces that sit close, wear comfortably and carry
        meaning without needing to announce it.
      </p>
      <div className="not-prose my-12 grid grid-cols-2 gap-[var(--tile-gap)]">
        <RevealImage image={{ src: IMG.necklaceShadow, alt: 'The shadow of a fine necklace on a table' }} sizes="35vw" className="aspect-[4/5]" />
        <RevealImage image={{ src: IMG.ringInPlant, alt: 'A hand holding a ring in front of green leaves' }} sizes="35vw" className="aspect-[4/5]" from="right" />
      </div>
      <h2>Made to be kept</h2>
      <p>
        We would rather make fewer pieces, more carefully. Each design is drawn, modelled, cast, set and finished with attention to
        the details you feel rather than see — balanced weight, rounded edges, settings that do not catch.
      </p>
      <p>
        <Link href="/craftsmanship" className="link-underline text-ink">Read about our craftsmanship</Link>
      </p>
    </ContentPage>
  )
}
