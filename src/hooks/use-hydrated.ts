'use client'

import { useSyncExternalStore } from 'react'

const noop = () => () => {}
/** True after hydration — use to avoid rendering client-only persisted state on the server. */
export const useHydrated = () => useSyncExternalStore(noop, () => true, () => false)
