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
import { notFound } from "next/navigation"

const reviews = [
  {
    id: 1,
    user: "João Silva",
    avatar: "/diverse-user-avatars.png",
    rating: 5,
    date: "15 de Jan, 2024",
    content:
      "Simplesmente incrível! A narrativa é envolvente do início ao fim, os gráficos são de tirar o fôlego e a jogabilidade é perfeita. Um dos melhores jogos que já joguei.",
    likes: 42,
    comments: 8,
  },
  {
    id: 2,
    user: "Maria Santos",
    avatar: "/diverse-woman-avatar.png",
    rating: 4,
    date: "12 de Jan, 2024",
    content:
      "Jogo excelente com uma história emocionante. Alguns momentos são um pouco lentos, mas no geral é uma experiência fantástica. Recomendo muito!",
    likes: 28,
    comments: 5,
  },
  {
    id: 3,
    user: "Pedro Costa",
    avatar: "/man-avatar.png",
    rating: 5,
    date: "10 de Jan, 2024",
    content:
      "Obra-prima absoluta. A atenção aos detalhes é impressionante, cada personagem é bem desenvolvido e a trilha sonora é perfeita. Não consigo parar de jogar!",
    likes: 56,
    comments: 12,
  },
]

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let game
  try {
    game = await getGameDetails(id)
  } catch (error) {
    notFound()
  }

  const releaseDate = game.released ? new Date(game.released).toLocaleDateString("pt-BR") : "N/A"

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
                      {game.description_raw || "Descrição não disponível."}
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
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarImage src={review.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{review.user[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold">{review.user}</h4>
                                  <div className="mt-1 flex items-center gap-2">
                                    <div className="flex gap-0.5">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-3 w-3 ${
                                            i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground">{review.date}</span>
                                  </div>
                                </div>
                              </div>
                              <p className="mt-3 text-sm text-muted-foreground leading-relaxed text-pretty">
                                {review.content}
                              </p>
                              <div className="mt-4 flex items-center gap-4">
                                <Button variant="ghost" size="sm" className="gap-2">
                                  <ThumbsUp className="h-4 w-4" />
                                  {review.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-2">
                                  <MessageCircle className="h-4 w-4" />
                                  {review.comments}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
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
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-3">
                          <div className="flex w-12 items-center gap-1">
                            <span className="text-sm">{stars}</span>
                            <Star className="h-3 w-3 fill-primary text-primary" />
                          </div>
                          <Progress value={stars === 5 ? 75 : stars === 4 ? 20 : 5} className="flex-1" />
                          <span className="w-12 text-right text-sm text-muted-foreground">
                            {stars === 5 ? "1.8k" : stars === 4 ? "480" : "120"}
                          </span>
                        </div>
                      ))}
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
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Jogando</dt>
                        <dd className="font-medium text-primary">1.2k usuários</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Completaram</dt>
                        <dd className="font-medium">8.5k usuários</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Abandonaram</dt>
                        <dd className="font-medium">420 usuários</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Na Lista</dt>
                        <dd className="font-medium">3.2k usuários</dd>
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
