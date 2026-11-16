import { z } from 'zod'
import { MAX_QTY } from './pricing'

export const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'India', 'Japan', 'Singapore', 'United Arab Emirates'] as const

export const customerSchema = z.object({
  email: z.email('Enter a valid email address'),
  firstName: z.string().trim().min(1, 'Enter your first name').max(60),
  lastName: z.string().trim().min(1, 'Enter your last name').max(60),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[+\d\s()-]*$/, 'Use digits, spaces and + ( ) - only')
    .optional()
    .or(z.literal('')),
  address1: z.string().trim().min(3, 'Enter your street address').max(120),
  address2: z.string().trim().max(120).optional().or(z.literal('')),
  city: z.string().trim().min(2, 'Enter your city').max(80),
  region: z.string().trim().max(80).optional().or(z.literal('')),
  postalCode: z.string().trim().min(3, 'Enter your postal code').max(12),
  country: z.enum(COUNTRIES, { error: 'Select a country' }),
  shippingMethod: z.enum(['standard', 'express']),
})

export const checkoutSchema = customerSchema.extend({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        qty: z.number().int().min(1).max(MAX_QTY),
        size: z.string().max(8).optional(),
        metal: z.string().max(40).optional(),
      }),
    )
    .min(1, 'Your bag is empty')
    .max(30),
})

export type CustomerInput = z.infer<typeof customerSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>

export interface DemoOrder {
  id: string
  mode: 'demo'
  createdAt: string
  email: string
  name: string
  lines: { name: string; qty: number; unitPrice: number; size?: string; metal?: string }[]
  subtotal: number
  shipping: number
  total: number
  currency: string
}
