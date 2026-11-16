'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useLenis } from './smooth-scroll'

type Panel = 'menu' | 'search' | 'cart' | null

interface UIContextValue {
  panel: Panel
  open: (p: Exclude<Panel, null>) => void
  close: () => void
}

const UIContext = createContext<UIContextValue | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<Panel>(null)
  const pathname = usePathname()
  const lenis = useLenis()

  // Close overlays on navigation (render-phase reset keyed on pathname)
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setPanel(null)
  }

  // Lock scrolling while any overlay is open
  useEffect(() => {
    const root = document.documentElement
    if (panel) {
      lenis?.stop()
      root.style.overflow = 'hidden'
    } else {
      lenis?.start()
      root.style.overflow = ''
    }
  }, [panel, lenis])

  const open = useCallback((p: Exclude<Panel, null>) => setPanel(p), [])
  const close = useCallback(() => setPanel(null), [])
  const value = useMemo(() => ({ panel, open, close }), [panel, open, close])

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used inside UIProvider')
  return ctx
}
