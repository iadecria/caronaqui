import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, DM_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/contexts/auth-context'
import { FavoritesProvider } from '@/contexts/favorites-context'
import { FavoriteDriversProvider } from '@/contexts/favorite-drivers-context'
import { NotificationsProvider } from '@/contexts/notifications-context'
import { BookingProvider } from '@/contexts/booking-context'
import { MessagesProvider } from '@/contexts/messages-context'
import { OfflineIndicator } from '@/components/pwa/offline-indicator'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CaronAqui - Caronas Via Dutra',
  description: 'Encontre e ofereca caronas na Via Dutra entre Rio de Janeiro e Sao Paulo. Viaje com economia e seguranca.',
  generator: 'v0.app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CaronAqui',
  },
  formatDetection: {
    telephone: true,
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.jpg', sizes: '192x192', type: 'image/jpeg' },
      { url: '/icons/icon-512x512.jpg', sizes: '512x512', type: 'image/jpeg' },
    ],
    apple: '/apple-touch-icon.jpg',
  },
  keywords: ['carona', 'via dutra', 'rio de janeiro', 'sao paulo', 'transporte compartilhado', 'pwa'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#50C878',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="bg-zinc-950">
      <body className={`${plusJakartaSans.variable} ${dmMono.variable} font-sans antialiased bg-zinc-950`}>
        <AuthProvider>
          <FavoritesProvider>
            <FavoriteDriversProvider>
              <NotificationsProvider>
                <BookingProvider>
                  <MessagesProvider>
                    <OfflineIndicator />
                    {children}
                  </MessagesProvider>
                </BookingProvider>
              </NotificationsProvider>
            </FavoriteDriversProvider>
          </FavoritesProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
