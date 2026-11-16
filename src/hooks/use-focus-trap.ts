'use client'

import { useEffect, useRef, type RefObject } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Traps focus inside `ref` while active, closes on Escape, restores focus on deactivate. */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean, onClose: () => void, initialFocus?: RefObject<HTMLElement | null>) {
  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!active) return
    const node = ref.current
    if (!node) return
    const previous = document.activeElement as HTMLElement | null

    const focusFirst = () => {
      const target = initialFocus?.current ?? node.querySelector<HTMLElement>(FOCUSABLE)
      target?.focus({ preventScroll: true })
    }
    const raf = requestAnimationFrame(focusFirst)
    // Retry once in case the overlay was still becoming visible on the first frame
    const retry = window.setTimeout(() => {
      if (!node.contains(document.activeElement)) focusFirst()
    }, 80)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(retry)
      document.removeEventListener('keydown', onKey)
      previous?.focus?.({ preventScroll: true })
    }
  }, [active, ref, initialFocus])
}
