'use client'

import { useState } from 'react'

const TOPICS = ['Order', 'Product question', 'Bespoke & engagement', 'Care & repairs', 'Other']

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<{ kind: 'idle' | 'sending' | 'sent' | 'error'; message?: string }>({ kind: 'idle' })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    const next: Record<string, string> = {}
    if (!data.name?.trim()) next.name = 'Enter your name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? '')) next.email = 'Enter a valid email address'
    if ((data.message ?? '').trim().length < 10) next.message = 'Please write at least a few words'
    setErrors(next)
    if (Object.keys(next).length) {
      document.getElementsByName(Object.keys(next)[0])[0]?.focus()
      return
    }
    setStatus({ kind: 'sending' })
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      const json = (await res.json()) as { ok?: boolean; error?: string; issues?: { path: string; message: string }[] }
      if (res.ok && json.ok) {
        setStatus({ kind: 'sent' })
        form.reset()
      } else {
        if (json.issues) setErrors(Object.fromEntries(json.issues.map((i) => [i.path, i.message])))
        setStatus({ kind: 'error', message: json.error ?? 'Something went wrong.' })
      }
    } catch {
      setStatus({ kind: 'error', message: 'We could not reach the server. Please try again.' })
    }
  }

  if (status.kind === 'sent')
    return (
      <div role="status" className="py-10">
        <p className="text-[22px] font-[300] text-ink">Thank you — your message has been sent.</p>
        <p className="mt-3 text-[14px] text-secondary">We will reply to the email address you provided.</p>
      </div>
    )

  const err = (n: string) =>
    errors[n] ? (
      <p id={`ct-${n}-err`} className="mt-1.5 text-[12px] text-[#9b3b3b]">
        {errors[n]}
      </p>
    ) : null

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-7 sm:grid-cols-2">
      <div>
        <label htmlFor="ct-name" className="block text-[11px] tracking-[0.12em] text-secondary uppercase">Name</label>
        <input id="ct-name" name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'ct-name-err' : undefined} className="field" />
        {err('name')}
      </div>
      <div>
        <label htmlFor="ct-email" className="block text-[11px] tracking-[0.12em] text-secondary uppercase">Email</label>
        <input id="ct-email" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'ct-email-err' : undefined} className="field" />
        {err('email')}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="ct-topic" className="block text-[11px] tracking-[0.12em] text-secondary uppercase">Topic</label>
        <select id="ct-topic" name="topic" defaultValue="Product question" className="field cursor-pointer">
          {TOPICS.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="ct-message" className="block text-[11px] tracking-[0.12em] text-secondary uppercase">Message</label>
        <textarea id="ct-message" name="message" rows={5} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'ct-message-err' : undefined} className="field h-auto resize-y py-3" />
        {err('message')}
      </div>
      <div aria-hidden className="absolute left-[-9999px]">
        <label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="sm:col-span-2">
        {status.kind === 'error' && <p role="alert" className="mb-5 text-[13px] text-[#9b3b3b]">{status.message}</p>}
        <button type="submit" disabled={status.kind === 'sending'} className="btn-solid min-w-[220px]">
          {status.kind === 'sending' ? 'Sending…' : 'Send Message'}
        </button>
      </div>
    </form>
  )
}
