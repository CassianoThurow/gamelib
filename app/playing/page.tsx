"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useLibrary } from "@/contexts/library-context"
import { ProgressDialog } from "@/components/progress-dialog"
import Link from "next/link"

export default function PlayingPage() {
  const { getGamesByStatus, updateGameStatus } = useLibrary()
  const playingGames = getGamesByStatus("playing")

  

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

          </div>
        </main>
      </div>
    </div>
  )
}
