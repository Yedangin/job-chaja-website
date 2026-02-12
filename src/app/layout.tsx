import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

// ✅ 추가
import { LanguageProvider } from '@/i18n/LanguageProvider'
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
        {/* PortOne Script */}
        <Script
          src="https://cdn.iamport.kr/v1/iamport.js"
          strategy="beforeInteractive"
        />
      </head>

      <body className="font-sans antialiased">
        {/* ✅ 여기서 전체 앱을 감쌈 */}
        <LanguageProvider>
          {children}
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
