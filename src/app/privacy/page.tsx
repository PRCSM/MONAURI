import type { Metadata } from 'next'
import { ContentPage } from '@/components/layout/content-page'

export const metadata: Metadata = { title: 'Privacy Policy', alternates: { canonical: '/privacy' } }

export default function PrivacyPage() {
  return (
    <ContentPage title="Privacy Policy" note="Template text for a demonstration site. Have your privacy policy drafted or reviewed for your jurisdiction before launch.">
      <h2>What this site stores</h2>
      <p>Your bag and wishlist are stored in your browser’s local storage on this device. They are not sent to a server until you check out.</p>
      <h2>Checkout</h2>
      <p>Contact and shipping details you enter at checkout are sent to our server to calculate your order. When a payment provider is connected, payment is completed on the provider’s hosted page; card details are never entered on or stored by this site.</p>
      <h2>Contact form</h2>
      <p>Messages you send through the contact form are used only to respond to you.</p>
      <h2>Your choices</h2>
      <p>You can clear your bag and wishlist at any time by clearing this site’s data in your browser.</p>
    </ContentPage>
  )
}
