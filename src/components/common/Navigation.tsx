import { Link, useLocation } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Wallet, ShoppingCart, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Navigation() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const navItems = [
    { path: "/", label: "Expenses", icon: Home },
    { path: "/List", label: "Lists", icon: ShoppingCart },
    { path: "/Budget", label: "Budget", icon: Wallet },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-stretch bg-background pb-safe shadow-sm md:static md:h-auto md:w-auto md:border-none md:bg-transparent md:pb-0 md:shadow-none">
      {/* Mobile Nav */}
      <div className="flex w-full justify-around items-stretch md:hidden pb-2">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = isActive(path)
          return (
            <Link
              key={path}
              to={path}
              className="flex-1 group relative flex flex-col items-center justify-center pt-2"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="relative flex items-center justify-center">
                  <span
                    className={cn(
                      "absolute inset-0 rounded-full bg-primary/25 blur-md transition-opacity",
                      active ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <Icon className={cn("relative h-6 w-6 transition-colors", active ? "text-primary" : "text-muted-foreground")} />
                </span>
                <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center justify-center gap-8">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = isActive(path)
          return (
            <Link key={path} to={path}>
              <Button variant={active ? "default" : "ghost"} size="default" className="gap-2">
                <span className="relative flex items-center justify-center">
                  <span
                    className={cn(
                      "absolute inset-0 rounded-full bg-primary/25 blur-md transition-opacity",
                      active ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <Icon className="relative h-4 w-4" />
                </span>
                <span className="hidden sm:inline">{label}</span>
              </Button>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
