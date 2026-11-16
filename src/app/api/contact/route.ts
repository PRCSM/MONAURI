import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  name: z.string().trim().min(1, 'Enter your name').max(80),
  email: z.email('Enter a valid email address'),
  topic: z.enum(['Order', 'Product question', 'Bespoke & engagement', 'Care & repairs', 'Other']),
  message: z.string().trim().min(10, 'Please write at least a few words').max(4000),
  // Honeypot — must stay empty
  company: z.string().max(0).optional().or(z.literal('')),
})

/** Forwards contact messages to CONTACT_WEBHOOK_URL when configured; otherwise reports that messaging isn't connected. */
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the highlighted fields.', issues: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })) }, { status: 422 })
  }
  const hook = process.env.CONTACT_WEBHOOK_URL
  if (!hook) {
    return NextResponse.json({ configured: false, error: 'Messaging is not connected on this demonstration site yet — your message was not sent.' }, { status: 503 })
  }
  const { company: _honeypot, ...data } = parsed.data
  void _honeypot
  const res = await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source: 'monauri-contact', ...data }) })
  if (!res.ok) return NextResponse.json({ error: 'We could not send your message. Please try again later.' }, { status: 502 })
  return NextResponse.json({ ok: true })
}
