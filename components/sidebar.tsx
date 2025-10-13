import Link from "next/link"
import { Home, TrendingUp, Star, Clock, Users, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col gap-4 border-r border-border bg-card p-4">
      <nav className="flex flex-col gap-1">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Home className="h-5 w-5" />
            Início
          </Button>
        </Link>
        <Link href="/trending">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <TrendingUp className="h-5 w-5" />
            Em Alta
          </Button>
        </Link>
        <Link href="/favorites">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Star className="h-5 w-5" />
            Favoritos
          </Button>
        </Link>
        <Link href="/playing">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Clock className="h-5 w-5" />
            Jogando
          </Button>
        </Link>
      </nav>

      <div className="my-4 h-px bg-border" />

      <div className="flex flex-col gap-2">
        <h3 className="px-3 text-sm font-semibold text-muted-foreground">Comunidade</h3>
        <Link href="/friends">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Users className="h-5 w-5" />
            Amigos
          </Button>
        </Link>
      </div>

      <div className="mt-auto">
        <Link href="/settings">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Settings className="h-5 w-5" />
            Configurações
          </Button>
        </Link>
      </div>
    </aside>
  )
}
