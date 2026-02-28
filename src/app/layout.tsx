import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

import { LanguageProvider } from '@/i18n/LanguageProvider'
import { AuthProvider } from '@/contexts/auth-context'
import { Toaster } from 'sonner'

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'JobChaja - Global Talent Platform',
  description: 'Global talent matching platform for employers and job seekers',
  generator: 'v0.app',
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
        {/* PortOne Script */}
        <Script
          src="https://cdn.iamport.kr/v1/iamport.js"
          strategy="beforeInteractive"
        />
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
