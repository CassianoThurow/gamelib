import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Bookmark, Share2, ThumbsUp, MessageCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { AddToLibraryButton } from "@/components/add-to-library-button"
import { FavoriteButton } from "@/components/favorite-button"
import { getGameDetails } from "@/lib/rawg-api"
import { translateText } from "@/lib/translate"
import { notFound } from "next/navigation"
import { getLocale } from "next-intl/server"

interface Review {
  id: number
  user: string
  avatar: string
  rating: number
  date: string
  content: string
  likes: number
  comments: number
}

const reviews: Review[] = []

export default async function GamePage({ params }: { params: { id: string } }) {
  const { id } = params
  const locale = await getLocale() || "pt"
  let game
  try {
    game = await getGameDetails(id)
  } catch (error) {
    notFound()
  }

  const releaseDate = game.released ? new Date(game.released).toLocaleDateString(locale === "pt" ? "pt-BR" : locale) : "N/A"

  // Traduzir descrição se necessário
  let description = game.description_raw || "Descrição não disponível."
  console.log("[DEBUG] Locale:", locale)
  console.log("[DEBUG] Original description:", game.description_raw)
  if (locale !== "en" && game.description_raw) {
    description = await translateText(game.description_raw, locale)
    console.log("[DEBUG] Translated description:", description)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {/* Hero Section */}
          <div className="relative h-[400px] overflow-hidden bg-gradient-to-b from-primary/10 to-background">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: `url(${game.background_image || "/placeholder.svg?height=400&width=1200"})` }}
            />
            <div className="container relative flex h-full items-end px-4 pb-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-8">
                <img
                  src={game.background_image || "/placeholder.svg?height=300&width=225"}
                  alt={game.name}
                  className="h-[300px] w-[225px] rounded-lg border-2 border-border object-cover shadow-2xl"
                />
                <div className="flex-1">
                  <h1 className="font-bold text-4xl text-balance leading-tight">{game.name}</h1>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {game.genres?.slice(0, 3).map((genre) => (
                      <Badge key={genre.id} variant="secondary">
                        {genre.name}
                      </Badge>
                    ))}
                    {game.platforms?.slice(0, 2).map((platform) => (
                      <Badge key={platform.platform.id} variant="secondary">
                        {platform.platform.name}
                      </Badge>
                    ))}
                    <span className="text-muted-foreground">
                      {game.released ? new Date(game.released).getFullYear() : "N/A"}
                    </span>
                    {game.developers?.[0] && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{game.developers[0].name}</span>
                      </>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <span className="font-bold text-2xl">{game.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-muted-foreground">({game.ratings_count.toLocaleString()} avaliações)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container px-4 py-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Action Buttons */}
                <div className="mb-8 flex flex-wrap gap-3">
                  <AddToLibraryButton gameId={id} />
                  <FavoriteButton gameId={id} />
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Bookmark className="h-4 w-4" />
                    Adicionar à Lista
                  </Button>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Share2 className="h-4 w-4" />
                    Compartilhar
                  </Button>
                </div>

                {/* Description */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Sobre o Jogo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed text-pretty">
                      {description}
                    </p>
                  </CardContent>
                </Card>

                {/* Write Review */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Escrever Resenha</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex items-center gap-2">
                      <span className="text-sm font-medium">Sua avaliação:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} className="transition-colors hover:text-primary">
                            <Star className="h-5 w-5" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <Textarea
                      placeholder="Compartilhe sua experiência com este jogo..."
                      className="min-h-[120px] resize-none"
                    />
                    <div className="mt-4 flex justify-end">
                      <Button>Publicar Resenha</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews */}
                <Card>
                  <CardHeader>
                    <CardTitle>Resenhas da Comunidade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                      Não há resenhas ainda. Seja o primeiro a avaliar!
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Rating Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição de Notas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                      Distribuição de notas não disponível.
                    </div>
                  </CardContent>
                </Card>

                {/* Game Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-3 text-sm">
                      {game.developers?.[0] && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Desenvolvedora</dt>
                          <dd className="font-medium">{game.developers[0].name}</dd>
                        </div>
                      )}
                      {game.publishers?.[0] && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Publicadora</dt>
                          <dd className="font-medium">{game.publishers[0].name}</dd>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Lançamento</dt>
                        <dd className="font-medium">{releaseDate}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Plataformas</dt>
                        <dd className="font-medium">
                          {game.platforms
                            ?.slice(0, 3)
                            .map((p) => p.platform.name)
                            .join(", ") || "N/A"}
                        </dd>
                      </div>
                      {game.esrb_rating && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Classificação</dt>
                          <dd className="font-medium">{game.esrb_rating.name}</dd>
                        </div>
                      )}
                    </dl>
                  </CardContent>
                </Card>

                {/* Community Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-3 text-sm">
                      <div className="text-center text-muted-foreground py-8">
                        Estatísticas não disponíveis no momento.
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
