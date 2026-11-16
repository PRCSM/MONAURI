'use client'

import { useEffect, useRef, useState } from 'react'
import { useLenis } from '@/providers/smooth-scroll'

/**
 * Minimal scrollbar synced to the real document scroll position.
 * Fine-pointer devices only; the native bar is hidden visually while this is
 * mounted, but scrolling, keyboard and assistive tech still use native scroll.
 */
export function CustomScrollbar() {
  const lenis = useLenis()
  const track = useRef<HTMLDivElement>(null)
  const thumb = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const metrics = useRef({ thumbH: 0, maxScroll: 1, trackH: 1 })
  const dragging = useRef<{ startY: number; startScroll: number } | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (min-width: 1024px)')
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    root.classList.add('has-custom-scrollbar')

    let raf = 0
    const measure = () => {
      const vh = window.innerHeight
      const docH = root.scrollHeight
      const trackH = track.current?.clientHeight ?? vh
      const ratio = vh / docH
      const thumbH = Math.max(48, trackH * ratio)
      metrics.current = { thumbH, maxScroll: Math.max(1, docH - vh), trackH }
      if (thumb.current) {
        thumb.current.style.height = `${thumbH}px`
        track.current?.toggleAttribute('data-hidden', ratio >= 1)
      }
      position()
    }
    const position = () => {
      const { thumbH, maxScroll, trackH } = metrics.current
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll))
      if (thumb.current) thumb.current.style.transform = `translate3d(0, ${progress * (trackH - thumbH)}px, 0)`
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(position)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    // Height changes from images, route changes, filters, etc.
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)

    return () => {
      root.classList.remove('has-custom-scrollbar')
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      ro.disconnect()
    }
  }, [enabled])

  const scrollTo = (y: number) => {
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
    else window.scrollTo(0, y)
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    const { thumbH, maxScroll, trackH } = metrics.current
    if (e.target !== thumb.current) {
      // Click on the track: jump so the thumb centres on the pointer
      const rect = track.current!.getBoundingClientRect()
      const p = (e.clientY - rect.top - thumbH / 2) / (trackH - thumbH)
      const y = Math.min(1, Math.max(0, p)) * maxScroll
      if (lenis) lenis.scrollTo(y, { force: true })
      else window.scrollTo({ top: y, behavior: 'smooth' })
      return
    }
    dragging.current = { startY: e.clientY, startScroll: window.scrollY }
    thumb.current?.setPointerCapture(e.pointerId)
    track.current?.setAttribute('data-dragging', '')
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    const { thumbH, maxScroll, trackH } = metrics.current
    const delta = ((e.clientY - dragging.current.startY) / (trackH - thumbH)) * maxScroll
    scrollTo(Math.min(maxScroll, Math.max(0, dragging.current.startScroll + delta)))
  }
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = null
    thumb.current?.releasePointerCapture?.(e.pointerId)
    track.current?.removeAttribute('data-dragging')
  }

  if (!enabled) return null

  return (
    <div
      ref={track}
      aria-hidden
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="group fixed top-[6px] right-0 bottom-[6px] z-[80] w-[12px] data-[hidden]:hidden"
    >
      <div className="absolute inset-y-0 right-[3px] w-[2px] bg-black/[0.04] transition-[width] duration-300 group-hover:w-[4px] group-data-[dragging]:w-[4px]" />
      <div
        ref={thumb}
        className="absolute top-0 right-[3px] w-[2px] rounded-full bg-black/30 transition-[width,background-color] duration-300 will-change-transform group-hover:w-[4px] group-hover:bg-black/45 group-data-[dragging]:w-[4px] group-data-[dragging]:bg-black/55"
      />
    </div>
  )
}
