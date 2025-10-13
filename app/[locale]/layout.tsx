import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "../globals.css"
import { Suspense } from "react"
import { LibraryProvider } from "@/contexts/library-context"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "GameLib - Sua Biblioteca de Jogos",
  description: "Descubra, avalie e compartilhe seus jogos favoritos",
  generator: "v0.app",
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <LibraryProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </LibraryProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
