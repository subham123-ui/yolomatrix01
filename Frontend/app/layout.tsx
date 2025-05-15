import type React from "react"
import "@/app/globals.css"
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import Navbar from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { CallProvider } from "@/components/call"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  generator: 'v0.dev'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <CallProvider>
              <Navbar />
              {children}
              <Toaster />
            </CallProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}