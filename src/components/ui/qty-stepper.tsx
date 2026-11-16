'use client'

import { MinusIcon, PlusIcon } from './icons'
import { MAX_QTY } from '@/lib/pricing'

export function QtyStepper({
  value,
  onChange,
  label,
  small,
  max = MAX_QTY,
}: {
  value: number
  onChange: (v: number) => void
  label: string
  small?: boolean
  max?: number
}) {
  const h = small ? 'h-9' : 'h-12'
  return (
    <div role="group" aria-label={label} className={`inline-flex items-center border border-subtle ${h}`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label="Decrease quantity"
        className={`grid ${small ? 'w-9' : 'w-12'} h-full place-items-center disabled:opacity-30`}
      >
        <MinusIcon />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={max}
        value={value}
        aria-label="Quantity"
        onChange={(e) => {
          const n = Math.floor(Number(e.target.value))
          if (Number.isFinite(n)) onChange(Math.min(max, Math.max(1, n)))
        }}
        className={`${small ? 'w-8 text-[13px]' : 'w-10 text-[14px]'} h-full appearance-none bg-transparent text-center [-moz-appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none`}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={`grid ${small ? 'w-9' : 'w-12'} h-full place-items-center disabled:opacity-30`}
      >
        <PlusIcon />
      </button>
    </div>
  )
}
