'use client'

import { useSyncExternalStore } from 'react'
import type { CartLine } from '@/types'
import { MAX_QTY } from './pricing'

/** Tiny localStorage-backed store compatible with useSyncExternalStore (SSR-safe). */
function createPersistentStore<T>(key: string, initial: T) {
  let state = initial
  let loaded = false
  const listeners = new Set<() => void>()

  const load = () => {
    if (loaded || typeof window === 'undefined') return
    loaded = true
    try {
      const raw = window.localStorage.getItem(key)
      if (raw) state = JSON.parse(raw) as T
    } catch {
      /* storage unavailable or corrupt — keep defaults */
    }
  }

  const emit = () => listeners.forEach((l) => l())

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key !== key) return
      try {
        state = e.newValue ? (JSON.parse(e.newValue) as T) : initial
      } catch {
        state = initial
      }
      emit()
    })
  }

  return {
    get: () => {
      load()
      return state
    },
    getServer: () => initial,
    set: (updater: (s: T) => T) => {
      load()
      state = updater(state)
      try {
        window.localStorage.setItem(key, JSON.stringify(state))
      } catch {
        /* ignore quota / private mode */
      }
      emit()
    },
    subscribe: (l: () => void) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
  }
}

const EMPTY_CART: CartLine[] = []
const EMPTY_WISH: string[] = []

const cartStore = createPersistentStore<CartLine[]>('monauri:cart', EMPTY_CART)
const wishStore = createPersistentStore<string[]>('monauri:wishlist', EMPTY_WISH)

const sameLine = (a: CartLine, b: Omit<CartLine, 'qty'>) =>
  a.productId === b.productId && (a.size ?? '') === (b.size ?? '') && (a.metal ?? '') === (b.metal ?? '')

export function useCart() {
  const lines = useSyncExternalStore(cartStore.subscribe, cartStore.get, cartStore.getServer)
  return {
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    add: (line: CartLine) =>
      cartStore.set((s) => {
        const existing = s.find((l) => sameLine(l, line))
        if (existing)
          return s.map((l) => (l === existing ? { ...l, qty: Math.min(MAX_QTY, l.qty + line.qty) } : l))
        return [...s, { ...line, qty: Math.min(MAX_QTY, Math.max(1, line.qty)) }]
      }),
    setQty: (line: CartLine, qty: number) =>
      cartStore.set((s) =>
        s.map((l) => (sameLine(l, line) ? { ...l, qty: Math.min(MAX_QTY, Math.max(1, Math.floor(qty) || 1)) } : l)),
      ),
    remove: (line: CartLine) => cartStore.set((s) => s.filter((l) => !sameLine(l, line))),
    clear: () => cartStore.set(() => []),
  }
}

export function useWishlist() {
  const ids = useSyncExternalStore(wishStore.subscribe, wishStore.get, wishStore.getServer)
  return {
    ids,
    has: (id: string) => ids.includes(id),
    toggle: (id: string) => wishStore.set((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
  }
}

export const lineKey = (l: CartLine) => `${l.productId}|${l.size ?? ''}|${l.metal ?? ''}`
