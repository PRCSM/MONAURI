'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

/** Small outlined cursor ring for fine pointers. Native cursor stays visible. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled || !dot.current) return
    const el = dot.current
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' })
    let visible = false

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      if (!visible) {
        gsap.set(el, { x: e.clientX, y: e.clientY })
        gsap.to(el, { opacity: 1, duration: 0.3 })
        visible = true
      }
      xTo(e.clientX)
      yTo(e.clientY)
      const t = e.target as HTMLElement
      const field = t.closest('input, textarea, select, [contenteditable]')
      const interactive = t.closest('a, button, [role="button"], label, [data-cursor="hover"]')
      gsap.to(el, {
        scale: field ? 0 : interactive ? 1.9 : 1,
        duration: 0.35,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }
    const leave = () => {
      visible = false
      gsap.to(el, { opacity: 0, duration: 0.3 })
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[90] -mt-[9px] -ml-[9px] h-[18px] w-[18px] rounded-full border border-ink/50 opacity-0 mix-blend-multiply"
    />
  )
}
