import type { ReactNode } from 'react'
import { PageIntro } from './page-intro'
import { RevealImage } from '@/components/editorial/reveal'
import type { ImageAsset } from '@/types'

export function ContentPage({
  title,
  eyebrow,
  description,
  image,
  note,
  children,
}: {
  title: string
  eyebrow?: string
  description?: string
  image?: ImageAsset
  note?: string
  children: ReactNode
}) {
  return (
    <>
      <PageIntro title={title} eyebrow={eyebrow} description={description} />
      {image && (
        <div className="wrap mb-[clamp(48px,5vw,96px)]">
          <RevealImage image={image} sizes="100vw" className="aspect-[16/9] lg:aspect-[21/9]" parallax={4} />
        </div>
      )}
      <div className="wrap grid lg:grid-cols-12">
        <article className="prose-lux text-[15px] lg:col-span-7 lg:col-start-4">
          {note && (
            <p className="!mb-10 border-l border-gold pl-4 text-[13px] !text-secondary">{note}</p>
          )}
          {children}
        </article>
      </div>
    </>
  )
}
