import Navigation from "./Navigation"
import Logo from "/2.png"
import { useTheme } from "../../hooks/useTheme"
import { Sun, Moon } from "lucide-react"
import { Button } from "../ui/button"

export default function Header() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <>
      <header className="bg-background/80 backdrop-blur-md border-b border-border shadow-sm mb-4 sticky top-0 z-50 transition-colors">
        <div className="mx-auto flex items-center justify-between h-16 max-w-5xl px-4 sm:px-6">
          {/* Logo */}
          <div className="flex items-center min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight truncate">
              <img src={Logo} alt="Spendify logo" className="h-14 object-contain" />
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center">
            <Navigation />
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-end gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              className="rounded-full text-foreground hover:bg-secondary/50"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation (renders as a fixed footer via Tailwind classes in Navigation.tsx) */}
      <div className="block md:hidden">
        <Navigation />
      </div>
    </>
  )
}
