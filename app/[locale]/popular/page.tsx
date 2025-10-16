import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { GameCard } from "@/components/game-card"
import { Star } from "lucide-react"
import { getPopularGames, convertRAWGGameToGame } from "@/lib/rawg-api"
import { getTranslations } from "next-intl/server"
import { Pagination } from "@/components/pagination"

interface PopularGamesPageProps {
  params: { locale: string }
  searchParams: { page?: string }
}

export default async function PopularGamesPage({ params: { locale }, searchParams }: PopularGamesPageProps) {
  const t = await getTranslations("home")
  const currentPage = Number(searchParams.page) || 1
  const pageSize = 24

  const popularData = await getPopularGames(currentPage, pageSize)
  const games = popularData.results.map(convertRAWGGameToGame)
  const totalPages = Math.ceil(popularData.count / pageSize)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="container">
            <div className="mb-8 flex items-center gap-3">
              <Star className="h-8 w-8 text-primary" />
              <h1 className="font-bold text-3xl">{t("sections.popular")}</h1>
            </div>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </div>
        </main>
      </div>
    </div>
  )
}