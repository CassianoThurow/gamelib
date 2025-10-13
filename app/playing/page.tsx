"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useLibrary } from "@/contexts/library-context"
import { getGameById } from "@/lib/game-data"
import { ProgressDialog } from "@/components/progress-dialog"
import Link from "next/link"

export default function PlayingPage() {
  const { getGamesByStatus, updateGameStatus } = useLibrary()
  const playingGames = getGamesByStatus("playing")

  const gamesWithData = playingGames
    .map((userData) => {
      const game = getGameById(userData.gameId)
      return game ? { ...game, userData } : null
    })
    .filter(Boolean)

  const totalHours = playingGames.reduce((acc, game) => acc + (game.hoursPlayed || 0), 0)
  const avgProgress =
    playingGames.length > 0
      ? Math.round(playingGames.reduce((acc, game) => acc + (game.progress || 0), 0) / playingGames.length)
      : 0

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Jogando Agora</h1>
                    <p className="text-muted-foreground">Acompanhe seu progresso nos jogos atuais</p>
                  </div>
                </div>
              </div>
            </div>

            {gamesWithData.length > 0 ? (
              <div className="space-y-6">
                {gamesWithData.map((game) => (
                  <div key={game.id} className="rounded-lg border border-border bg-card p-6">
                    <div className="flex flex-col gap-6 md:flex-row">
                      <Link
                        href={`/game/${game.id}`}
                        className="relative h-48 w-32 flex-shrink-0 overflow-hidden rounded-lg md:h-56 md:w-40"
                      >
                        <img
                          src={game.cover || "/placeholder.svg"}
                          alt={game.title}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col gap-4">
                        <div>
                          <Link href={`/game/${game.id}`}>
                            <h3 className="text-2xl font-bold hover:text-primary">{game.title}</h3>
                          </Link>
                          <p className="text-muted-foreground">
                            {game.genre} • {game.year}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className="font-semibold">{game.userData.progress || 0}%</span>
                          </div>
                          <Progress value={game.userData.progress || 0} className="h-2" />
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <span className="text-muted-foreground">Horas jogadas:</span>{" "}
                            <span className="font-semibold">{game.userData.hoursPlayed || 0}h</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Avaliação:</span>{" "}
                            <span className="font-semibold">{game.rating}/5</span>
                          </div>
                        </div>

                        <div className="mt-auto flex gap-2">
                          <ProgressDialog
                            gameId={game.id}
                            currentProgress={game.userData.progress}
                            currentHours={game.userData.hoursPlayed}
                            trigger={
                              <Button variant="outline" size="sm">
                                Atualizar Progresso
                              </Button>
                            }
                          />
                          <Button variant="outline" size="sm" onClick={() => updateGameStatus(game.id, "completed")}>
                            Marcar como Concluído
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
                <Clock className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-semibold">Nenhum jogo em andamento</h3>
                <p className="mb-6 text-muted-foreground">
                  Adicione jogos que você está jogando atualmente para acompanhar seu progresso
                </p>
                <Link href="/">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Explorar Jogos
                  </Button>
                </Link>
              </div>
            )}

            {gamesWithData.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">Estatísticas</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total de jogos</p>
                    <p className="text-2xl font-bold">{gamesWithData.length}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Horas totais</p>
                    <p className="text-2xl font-bold">{totalHours}h</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Progresso médio</p>
                    <p className="text-2xl font-bold">{avgProgress}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
