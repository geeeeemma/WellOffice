import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Link } from "react-router-dom"
import { Home, Settings, Menu, X } from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img 
                src="/logo.svg" 
                alt="WellOffice" 
                className="h-8 w-auto"
              />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden lg:inline">Gestione</span>
                </Link>
              </Button>
              <ModeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <ModeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t">
              <div className="flex flex-col gap-2 pt-4">
                <Button variant="ghost" asChild className="justify-start">
                  <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="justify-start">
                  <Link to="/settings" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <Settings className="h-4 w-4" />
                    Gestione
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-73px)]">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
            <p className="text-center sm:text-left">© 2024 WellOffice. Sistema di monitoraggio comfort ambientale.</p>
            <p className="text-center sm:text-right">Versione 1.0.0</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 