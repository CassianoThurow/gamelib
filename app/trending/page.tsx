import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { GameCard } from "@/components/game-card"
import { TrendingUp, Flame, Award } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTrendingGames, convertRAWGGameToGame } from "@/lib/rawg-api"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function TrendingPage() {
  const [todayData, weekData, monthData] = await Promise.all([
    getTrendingGames("day", 1, 12),
    getTrendingGames("week", 1, 12),
    getTrendingGames("month", 1, 12),
  ])

  const todayGames = todayData.results.map(convertRAWGGameToGame)
  const weekGames = weekData.results.map(convertRAWGGameToGame)
  const monthGames = monthData.results.map(convertRAWGGameToGame)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Jogos em Alta</h1>
                  <p className="text-muted-foreground">Os jogos mais populares e comentados da comunidade</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="week" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="today">
                  <Flame className="mr-2 h-4 w-4" />
                  Hoje
                </TabsTrigger>
                <TabsTrigger value="week">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Semana
                </TabsTrigger>
                <TabsTrigger value="month">
                  <Award className="mr-2 h-4 w-4" />
                  Mês
                </TabsTrigger>
              </TabsList>

              <TabsContent value="today" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {todayGames.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="week" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {weekGames.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="month" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {monthGames.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Sobre os Jogos em Alta</h2>
              <p className="text-muted-foreground leading-relaxed">
                Veja os jogos que estão fazendo sucesso e gerando mais interesse na comunidade de jogadores.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
