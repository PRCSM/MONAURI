import type { Metadata } from 'next'
import { ContentPage } from '@/components/layout/content-page'
import { RevealImage } from '@/components/editorial/reveal'
import { IMG } from '@/lib/images'

export const metadata: Metadata = { title: 'Craftsmanship', description: 'How MONAURI pieces are designed and made.', alternates: { canonical: '/craftsmanship' } }

const STEPS = [
  { t: 'Drawing', d: 'Every piece begins as a pencil line — proportions are resolved on paper before anything else.' },
  { t: 'Modelling', d: 'The form is modelled and refined at true scale so weight, comfort and balance can be judged on the hand.' },
  { t: 'Casting & forming', d: 'Precious metal is cast or hand-formed, then shaped and filed to bring back the softness of the original line.' },
  { t: 'Setting', d: 'Stones are set one by one, with claws and bezels kept as low and smooth as the design allows.' },
  { t: 'Finishing', d: 'Each surface is polished or brushed by hand and inspected under magnification before it leaves the bench.' },
]

export default function CraftPage() {
  return (
    <ContentPage
      eyebrow="Craftsmanship"
      title="Crafted with Intention"
      description="Fewer pieces, made more carefully, meant to be worn for decades."
      image={{ src: IMG.benchExamining, alt: 'A jeweler examining a piece at the workbench' }}
    >
      <p>
        Our process is slow on purpose. Between the first sketch and the finished piece there are many small decisions, and each one
        is made by hand and by eye.
      </p>
      <ol className="not-prose my-12 divide-y divide-black/[0.08] border-y border-black/[0.08]">
        {STEPS.map((s, i) => (
          <li key={s.t} className="grid grid-cols-[48px_1fr] gap-4 py-6">
            <span className="text-[12px] text-secondary">0{i + 1}</span>
            <div>
              <h3 className="text-[18px] font-[300] text-ink">{s.t}</h3>
              <p className="mt-2 text-[14.5px] leading-[1.75] text-[#555]">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
      <RevealImage image={{ src: IMG.toolInHand, alt: 'A jeweler’s hand holding a fine tool' }} sizes="60vw" className="my-12 aspect-[16/10]" />
      <h2>Materials</h2>
      <p>
        Material and stone details on each product page describe the piece as designed for this demonstration storefront. Final
        specifications, sourcing information and any certifications should be published here once confirmed.
      </p>
    </ContentPage>
  )
}
