import type { Metadata } from 'next'
import { ContentPage } from '@/components/layout/content-page'

export const metadata: Metadata = { title: 'Jewelry Care', description: 'How to care for your MONAURI jewelry.', alternates: { canonical: '/care' } }

export default function CarePage() {
  return (
    <ContentPage eyebrow="Customer care" title="Jewelry Care" description="A little care keeps fine jewelry looking as it did on the first day.">
      <h2>Everyday wear</h2>
      <ul>
        <li>Put jewelry on last — after perfume, lotion and hairspray — and take it off first.</li>
        <li>Remove pieces before swimming, bathing, exercising, gardening or cleaning.</li>
        <li>Avoid contact with chlorine and household chemicals, which can dull metals and some stones.</li>
      </ul>
      <h2>Cleaning</h2>
      <ul>
        <li>Wipe gold and white gold with a soft, lint-free cloth after wearing.</li>
        <li>For a deeper clean, soak briefly in warm water with a drop of mild soap, brush gently with a soft brush, rinse and dry.</li>
        <li>Softer or treated stones such as emerald should not be soaked or cleaned ultrasonically — wipe only.</li>
      </ul>
      <h2>Storage</h2>
      <ul>
        <li>Store each piece separately in its pouch or a lined box so stones do not scratch metal.</li>
        <li>Fasten fine chains before storing to prevent tangling.</li>
      </ul>
      <h2>Check-ups</h2>
      <p>Have settings and clasps checked periodically, especially on rings worn every day.</p>
    </ContentPage>
  )
}
