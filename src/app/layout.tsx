import React from "react"
import type { Metadata } from 'next'
// import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

import { LanguageProvider } from '@/i18n/LanguageProvider'
import { AuthProvider } from '@/contexts/auth-context'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://jobchaja.com'),
  title: 'JobChaja - Global Talent Platform',
  description: 'Global talent matching platform for employers and job seekers',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const paidFeaturesEnabled = process.env.PAID_FEATURES_ENABLED === 'true';

  return (
    <html lang="en">
      <head>
        {/* Pretendard — 한글 최적화 가변 폰트 / Korean-optimized variable font */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        {paidFeaturesEnabled && (
          <Script
            src="https://cdn.iamport.kr/v1/iamport.js"
            strategy="beforeInteractive"
          />
        )}
      </head>

      <body className="font-sans antialiased">
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>

        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: {
              minWidth: '400px',
              maxWidth: '500px',
            },
          }}
        />
        {/* <Analytics /> */}
      </body>
    </html>
  )
}
