import type { Metadata } from 'next'
import { PageIntro } from '@/components/layout/page-intro'
import { ContactForm } from '@/components/commerce/contact-form'

export const metadata: Metadata = { title: 'Contact', description: 'Get in touch with MONAURI.', alternates: { canonical: '/contact' } }

export default function ContactPage() {
  return (
    <>
      <PageIntro eyebrow="Contact" title="We’d love to hear from you" description="Questions about a piece, an order or a bespoke engagement ring — send us a note." />
      <div className="wrap grid lg:grid-cols-12">
        <div className="lg:col-span-7 lg:col-start-4">
          <ContactForm />
        </div>
      </div>
    </>
  )
}
