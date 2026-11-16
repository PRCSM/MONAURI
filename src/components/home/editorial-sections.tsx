import Link from 'next/link'
import type { Product } from '@/types'
import { IMG, LOCAL } from '@/lib/images'
import { RevealImage, RevealText } from '@/components/editorial/reveal'
import { ProductCard } from '@/components/products/product-card'

/** Section 5 — continues the split photographic composition at the bottom of the reference. */
export function Philosophy() {
  return (
    <section aria-labelledby="philosophy-title" className="mt-[clamp(28px,3.4vw,56px)] grid bg-white lg:grid-cols-2">
      <RevealImage
        image={{ src: LOCAL.philosophy, alt: 'Calla lilies in a glass vase casting long shadows on a sunlit wall, a ring hanging on one stem', position: '32% 50%' }}
        sizes="(min-width:1024px) 50vw, 100vw"
        className="aspect-[4/5] lg:aspect-[0.92/1]"
        parallax={4}
      />
      <RevealText className="wrap flex flex-col justify-center py-[clamp(56px,7vw,120px)] lg:px-[clamp(48px,7vw,140px)]">
        <p data-rt className="eyebrow mb-6">
          Our philosophy
        </p>
        <h2 id="philosophy-title" data-rt className="max-w-[14ch] text-[clamp(28px,2.9vw,46px)] leading-[1.1] font-[300] text-ink">
          Beauty in Every Detail
        </h2>
        <p data-rt className="mt-7 max-w-[440px] text-[clamp(14px,1.05vw,16px)] leading-[1.75] text-[#5b5b5b]">
          We believe jewelry should not announce itself — it should feel like it was always yours. Each MONAURI piece begins
          with a single, quiet idea: a curve borrowed from a petal, a stone set to catch the morning light.
        </p>
        <p data-rt className="mt-4 max-w-[440px] text-[clamp(14px,1.05vw,16px)] leading-[1.75] text-[#5b5b5b]">
          What remains is only what matters, so the piece can become part of the person who wears it.
        </p>
        <Link data-rt href="/about" className="link-underline mt-9 self-start text-[13px] text-ink">
          Discover Our Story
        </Link>
      </RevealText>
    </section>
  )
}

/** Section 6 — featured collection: large editorial frame + curated products. */
export function CollectionFeature({ items }: { items: Product[] }) {
  return (
    <section aria-labelledby="auri-title" className="wrap mt-[clamp(80px,9vw,160px)]">
      <div className="grid gap-[var(--tile-gap)] lg:grid-cols-[1.05fr_1fr] lg:gap-[clamp(24px,3vw,56px)]">
        <RevealImage
          image={{ src: IMG.necklaceVNeck, alt: 'Woman in a white top wearing an Auri gold necklace', position: '50% 30%' }}
          sizes="(min-width:1024px) 52vw, 100vw"
          className="aspect-[4/5] lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:aspect-[0.82/1] lg:self-start"
          from="left"
        />
        <div className="flex flex-col">
          <RevealText className="pt-8 pb-10 lg:pt-[clamp(24px,4vw,72px)] lg:pb-[clamp(40px,4vw,72px)]">
            <p data-rt className="eyebrow mb-5">
              The collection
            </p>
            <h2 id="auri-title" data-rt className="text-[clamp(28px,2.9vw,46px)] leading-[1.1] font-[300] text-ink">
              The Auri Collection
            </h2>
            <p data-rt className="mt-6 max-w-[440px] text-[clamp(14px,1.05vw,16px)] leading-[1.75] text-[#5b5b5b]">
              Polished gold, softened edges and a single point of light. Auri distils our language into pieces made to be worn
              every day — alone, or layered into something entirely your own.
            </p>
            <Link data-rt href="/collections/auri" className="link-underline mt-7 inline-block text-[13px] text-ink">
              Shop the Collection
            </Link>
          </RevealText>
          <div className="grid grid-cols-2 gap-x-[var(--tile-gap)] gap-y-10 lg:gap-x-[clamp(12px,1.4vw,24px)]">
            {items.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} sizes="(min-width:1024px) 22vw, 50vw" aspect="aspect-[4/5]" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Section 7 — craftsmanship */
export function Craft() {
  return (
    <section aria-labelledby="craft-title" className="mt-[clamp(80px,9vw,160px)] bg-ivory py-[clamp(64px,8vw,140px)]">
      <div className="wrap grid items-center gap-12 lg:grid-cols-12">
        <RevealText className="lg:col-span-4 lg:col-start-2">
          <p data-rt className="eyebrow mb-6">
            Craftsmanship
          </p>
          <h2 id="craft-title" data-rt className="text-[clamp(28px,2.9vw,46px)] leading-[1.1] font-[300] text-ink">
            Crafted with Intention
          </h2>
          <p data-rt className="mt-7 max-w-[420px] text-[clamp(14px,1.05vw,16px)] leading-[1.75] text-[#5b5b5b]">
            Every piece passes slowly through skilled hands — shaped, set, polished and inspected until the line is exactly
            right. We design for comfort as much as beauty: rounded interiors, balanced weight, settings that sit close.
          </p>
          <p data-rt className="mt-4 max-w-[420px] text-[clamp(14px,1.05vw,16px)] leading-[1.75] text-[#5b5b5b]">
            Fewer pieces, made more carefully, meant to be worn for decades.
          </p>
          <Link data-rt href="/craftsmanship" className="link-underline mt-9 inline-block text-[13px] text-ink">
            How We Make It
          </Link>
        </RevealText>
        <div className="relative lg:col-span-6 lg:col-start-7">
          <RevealImage
            image={{ src: IMG.benchWorking, alt: 'A jeweler working on a piece at a workbench' }}
            sizes="(min-width:1024px) 45vw, 100vw"
            className="aspect-[4/5] w-full lg:w-[78%]"
            parallax={5}
          />
          <RevealImage
            image={{ src: IMG.toolInHand, alt: 'Close-up of a jeweler’s hand holding a fine metal tool' }}
            sizes="(min-width:1024px) 20vw, 50vw"
            className="absolute -bottom-[10%] right-0 hidden aspect-[3/4] w-[38%] border-[6px] border-ivory lg:block"
            from="right"
          />
        </div>
      </div>
    </section>
  )
}

/** Section 8 — personal moments */
export function Moments() {
  const moments = [
    { title: 'Everyday', text: 'Pieces light enough to forget you are wearing — until someone notices.', href: '/catalog?sort=featured' },
    { title: 'Gifting', text: 'Something chosen carefully, for someone who will keep it close.', href: '/bestsellers' },
    { title: 'Promises', text: 'Solitaires and bands for the moments that begin everything after.', href: '/catalog/engagement-rings' },
  ]
  return (
    <section aria-labelledby="moments-title" className="wrap mt-[clamp(80px,9vw,160px)]">
      <RevealText className="mb-[clamp(28px,3vw,56px)] flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <h2 id="moments-title" data-rt className="max-w-[16ch] text-[clamp(28px,2.9vw,46px)] leading-[1.1] font-[300] text-ink">
          Made for Your Moments
        </h2>
        <p data-rt className="max-w-[380px] text-[clamp(14px,1.05vw,16px)] leading-[1.75] text-[#5b5b5b]">
          Worn on ordinary Tuesdays and extraordinary evenings alike — jewelry that collects meaning as you wear it.
        </p>
      </RevealText>
      <div className="grid gap-[var(--tile-gap)] md:grid-cols-[1.6fr_1fr]">
        <RevealImage
          image={{ src: IMG.ringsAndNecklace, alt: 'Close-up of a person wearing gold rings and a fine necklace' }}
          sizes="(min-width:768px) 60vw, 100vw"
          className="aspect-[4/3] md:aspect-auto md:min-h-[560px]"
        />
        <div className="grid gap-[var(--tile-gap)]">
          <RevealImage
            image={{ src: IMG.windowLight, alt: 'A woman looking out of a window in soft natural light' }}
            sizes="(min-width:768px) 38vw, 100vw"
            className="aspect-[4/3]"
            from="right"
          />
          <ul className="grid content-start gap-7 bg-ivory p-[clamp(24px,2.6vw,44px)]">
            {moments.map((m) => (
              <li key={m.title}>
                <Link href={m.href} className="group block">
                  <p className="text-[clamp(17px,1.4vw,21px)] font-[300] text-ink">
                    <span className="link-quiet">{m.title}</span>
                  </p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-secondary">{m.text}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/** Section 9 — final CTA */
export function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="wrap mt-[clamp(96px,11vw,200px)] text-center">
      <RevealText className="mx-auto max-w-[720px]">
        <span data-rt className="mx-auto mb-10 block h-[clamp(48px,5vw,80px)] w-px bg-black/20" aria-hidden />
        <h2 id="final-title" data-rt className="text-[clamp(30px,3.3vw,52px)] leading-[1.08] font-[300] text-ink">
          Find Something Uniquely Yours
        </h2>
        <p data-rt className="mx-auto mt-6 max-w-[420px] text-[clamp(14px,1.05vw,16px)] leading-[1.75] text-[#5b5b5b]">
          Rings, earrings, necklaces and bracelets — each designed to feel like it was always meant for you.
        </p>
        <div data-rt className="mt-10">
          <Link href="/catalog" className="btn-outline">
            Explore All Jewelry
          </Link>
        </div>
      </RevealText>
    </section>
  )
}
