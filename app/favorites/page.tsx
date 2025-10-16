"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { GameCard } from "@/components/game-card"
import { Star, Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLibrary } from "@/contexts/library-context"
import Link from "next/link"
import { useState } from "react"

export default function FavoritesPage() {
  const { getFavorites } = useLibrary()
  const [sortBy, setSortBy] = useState("recent")
  const favoriteGames = getFavorites()


  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
                <Star className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-semibold">Nenhum favorito ainda</h3>
                <p className="mb-6 text-muted-foreground">
                  Comece a adicionar seus jogos favoritos para criar sua coleção pessoal
                </p>
                <Link href="/">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Explorar Jogos
                  </Button>
                </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
