"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { GameCard } from "@/components/game-card"
import { Star, Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLibrary } from "@/contexts/library-context"
import { getGameById } from "@/lib/game-data"
import Link from "next/link"
import { useState } from "react"

export default function FavoritesPage() {
  const { getFavorites } = useLibrary()
  const [sortBy, setSortBy] = useState("recent")
  const favoriteGames = getFavorites()

  let gamesWithData = favoriteGames
    .map((userData) => {
      const game = getGameById(userData.gameId)
      return game ? { ...game, userData } : null
    })
    .filter(Boolean)

  // Sort games
  if (sortBy === "rating") {
    gamesWithData = gamesWithData.sort((a, b) => b.rating - a.rating)
  } else if (sortBy === "title") {
    gamesWithData = gamesWithData.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortBy === "year") {
    gamesWithData = gamesWithData.sort((a, b) => b.year - a.year)
  }

  const avgRating =
    gamesWithData.length > 0
      ? (gamesWithData.reduce((acc, game) => acc + game.rating, 0) / gamesWithData.length).toFixed(1)
      : 0

  // Get most common genre
  const genreCounts = gamesWithData.reduce(
    (acc, game) => {
      const mainGenre = game.genre.split("/")[0]
      acc[mainGenre] = (acc[mainGenre] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )
  const favoriteGenre = Object.entries(genreCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"

  // Get most common year
  const yearCounts = gamesWithData.reduce(
    (acc, game) => {
      acc[game.year] = (acc[game.year] || 0) + 1
      return acc
    },
    {} as Record<number, number>,
  )
  const commonYear = Object.entries(yearCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Meus Favoritos</h1>
                    <p className="text-muted-foreground">{gamesWithData.length} jogos salvos</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Mais recentes</SelectItem>
                    <SelectItem value="rating">Melhor avaliados</SelectItem>
                    <SelectItem value="title">Título (A-Z)</SelectItem>
                    <SelectItem value="year">Ano de lançamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {gamesWithData.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {gamesWithData.map((game) => (
                    <GameCard key={game.id} game={game} showUserRating />
                  ))}
                </div>

                <div className="rounded-lg border border-border bg-card p-6">
                  <h2 className="mb-4 text-xl font-semibold">Estatísticas dos Favoritos</h2>
                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total de jogos</p>
                      <p className="text-2xl font-bold">{gamesWithData.length}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Avaliação média</p>
                      <p className="text-2xl font-bold">{avgRating}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Gênero favorito</p>
                      <p className="text-2xl font-bold">{favoriteGenre}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Ano mais comum</p>
                      <p className="text-2xl font-bold">{commonYear}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
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
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
