import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/manrope'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/500.css'
import './globals.css'
import { SmoothScroll } from '@/providers/smooth-scroll'
import { UIProvider } from '@/providers/ui-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { MenuOverlay } from '@/components/navigation/menu-overlay'
import { SearchOverlay } from '@/components/navigation/search-overlay'
import { CartDrawer } from '@/components/commerce/cart-drawer'
import { CustomScrollbar } from '@/components/scrolling/custom-scrollbar'
import { Cursor } from '@/components/ui/cursor'
import { SITE } from '@/lib/config'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: 'MONAURI — Fine Jewelry', template: '%s — MONAURI' },
  description: SITE.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: 'MONAURI — Jewelry that feels like you',
    description: SITE.description,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'A white calla lily with a champagne pear-cut ring on its stem' }],
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-[13px]"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <UIProvider>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <MenuOverlay />
            <SearchOverlay />
            <CartDrawer />
            <CustomScrollbar />
            <Cursor />
          </UIProvider>
        </SmoothScroll>
      </body>
    </html>
  )
}
