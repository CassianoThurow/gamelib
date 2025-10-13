import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { GameCard } from "@/components/game-card"
import { Button } from "@/components/ui/button"
import { Star, Trophy, Flame, Calendar, Rocket } from "lucide-react"
import {
  getTopRatedGames,
  getPopularGames,
  getMostPlayedGames,
  getRecentGames,
  getUpcomingGames,
  convertRAWGGameToGame,
} from "@/lib/rawg-api"
import { getTranslations } from "next-intl/server"

export default async function HomePage() {
  const t = await getTranslations("home")

  const [topRatedData, popularData, mostPlayedData, recentData, upcomingData] = await Promise.all([
    getTopRatedGames(1, 6),
    getPopularGames(1, 6),
    getMostPlayedGames(1, 6),
    getRecentGames(1, 6),
    getUpcomingGames(1, 6),
  ])

  const topRatedGames = topRatedData.results.map(convertRAWGGameToGame)
  const popularGames = popularData.results.map(convertRAWGGameToGame)
  const mostPlayedGames = mostPlayedData.results.map(convertRAWGGameToGame)
  const recentGames = recentData.results.map(convertRAWGGameToGame)
  const upcomingGames = upcomingData.results.map(convertRAWGGameToGame)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {/* Hero Section */}
          <section className="relative h-[400px] overflow-hidden bg-gradient-to-b from-primary/20 to-background">
            <div className="absolute inset-0 bg-[url('/gaming-hero-background.jpg')] bg-cover bg-center opacity-20" />
            <div className="container relative flex h-full flex-col justify-center px-4">
              <h1 className="max-w-2xl font-bold text-4xl text-balance leading-tight md:text-5xl">{t("hero.title")}</h1>
              <p className="mt-4 max-w-xl text-lg text-muted-foreground text-pretty">{t("hero.subtitle")}</p>
              <div className="mt-8 flex gap-4">
                <Button size="lg" className="gap-2">
                  <Star className="h-5 w-5" />
                  {t("hero.cta")}
                </Button>
                <Button size="lg" variant="outline">
                  {t("hero.explore")}
                </Button>
              </div>
            </div>
          </section>

          {/* Top Rated Games */}
          <section className="container px-4 py-12">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-primary" />
                <h2 className="font-bold text-2xl">{t("sections.topRated")}</h2>
              </div>
              <Button variant="ghost">{t("sections.viewAll")}</Button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {topRatedGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>

          {/* Popular Games */}
          <section className="container px-4 py-12">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-primary" />
                <h2 className="font-bold text-2xl">{t("sections.popular")}</h2>
              </div>
              <Button variant="ghost">{t("sections.viewAll")}</Button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {popularGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>

          {/* Most Played Games */}
          <section className="container px-4 py-12">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flame className="h-6 w-6 text-primary" />
                <h2 className="font-bold text-2xl">{t("sections.mostPlayed")}</h2>
              </div>
              <Button variant="ghost">{t("sections.viewAll")}</Button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {mostPlayedGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>

          {/* Recent Releases */}
          <section className="container px-4 py-12">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-primary" />
                <h2 className="font-bold text-2xl">{t("sections.recent")}</h2>
              </div>
              <Button variant="ghost">{t("sections.viewAll")}</Button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {recentGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>

          {/* Upcoming Releases */}
          <section className="container px-4 py-12">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Rocket className="h-6 w-6 text-primary" />
                <h2 className="font-bold text-2xl">{t("sections.upcoming")}</h2>
              </div>
              <Button variant="ghost">{t("sections.viewAll")}</Button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {upcomingGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>

          {/* Stats Section */}
          <section className="border-t border-border bg-card/50 py-12">
            <div className="container px-4">
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                <div className="text-center">
                  <div className="font-bold text-3xl text-primary">{topRatedData.count.toLocaleString()}+</div>
                  <div className="mt-2 text-sm text-muted-foreground">{t("stats.games")}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-3xl text-primary">200K+</div>
                  <div className="mt-2 text-sm text-muted-foreground">{t("stats.users")}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-3xl text-primary">1M+</div>
                  <div className="mt-2 text-sm text-muted-foreground">{t("stats.reviews")}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-3xl text-primary">500K+</div>
                  <div className="mt-2 text-sm text-muted-foreground">{t("stats.community")}</div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
