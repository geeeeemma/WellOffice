import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import { Building2, Home, Settings } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WellOffice - Monitoraggio Comfort Ambientale",
  description: "Sistema intelligente per il monitoraggio continuo dei parametri ambientali nei luoghi di lavoro",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <Building2 className="h-6 w-6" />
                    WellOffice
                  </Link>
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" asChild>
                      <Link href="/" className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link href="/settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Gestione
                      </Link>
                    </Button>
                    <ModeToggle />
                  </div>
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <main className="min-h-[calc(100vh-73px)]">{children}</main>

            {/* Footer */}
            <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <p>© 2024 WellOffice. Sistema di monitoraggio comfort ambientale.</p>
                  <p>Versione 1.0.0</p>
                </div>
              </div>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
