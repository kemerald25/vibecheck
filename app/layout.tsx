import type { Metadata } from 'next'
import './globals.css'
import { ErrorBoundary } from '@/components/error/ErrorBoundary'
import { Navigation } from '@/components/nav/Navigation'

export const metadata: Metadata = {
  title: 'Vibe Check - Find Your Farcaster Match',
  description: 'Connect builders and creators on Farcaster. Swipe to find your perfect match.',
  other: {
    'fc:miniapp': JSON.stringify({
      version: '1',
      imageUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vibecheck.vercel.app'}/og.png`,
      button: {
        title: 'Find Your Match',
        action: {
          type: 'launch_frame',
          name: 'Vibe Check',
          url: process.env.NEXT_PUBLIC_APP_URL || 'https://vibecheck.vercel.app',
          splashImageUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vibecheck.vercel.app'}/icon.png`,
          splashBackgroundColor: '#0052FF',
        },
      },
    }),
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          {children}
          <Navigation />
        </ErrorBoundary>
      </body>
    </html>
  )
}
