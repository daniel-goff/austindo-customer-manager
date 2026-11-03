//import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import { AppSidebar } from '@/components/crm/app-sidebar'
import { MobileNav } from '@/components/crm/mobile-nav'
import "@/components/crm/globals.css"

const plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-plex-sans' })
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex-mono' })

export const metadata: Metadata = {
  title: 'ACS Electronics CRM',
  description:
    'Service records, equipment history, PDF invoice extraction and repair analytics for the Austindo Consulting Services electronics division.',
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f6f3' },
    { media: '(prefers-color-scheme: dark)', color: '#16191d' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-AU" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body>
        <div className="flex min-h-dvh">
          <AppSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <MobileNav />
            <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}