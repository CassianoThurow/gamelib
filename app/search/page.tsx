import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { GameCard } from "@/components/game-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"
import { searchGames, convertRAWGGameToGame } from "@/lib/rawg-api"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string }
}) {
  const query = searchParams.q || ""
  const page = Number.parseInt(searchParams.page || "1")

  const searchData = query ? await searchGames(query, page, 20) : { results: [], count: 0 }
  const searchResults = searchData.results.map(convertRAWGGameToGame)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container px-4 py-8">
            {/* Search Header */}
            <div className="mb-8">
              <h1 className="font-bold text-3xl">Resultados da Busca</h1>
              <p className="mt-2 text-muted-foreground">
                {query ? (
                  <>
                    Encontramos <span className="font-semibold text-foreground">{searchData.count} jogos</span> para "
                    {query}"
                  </>
                ) : (
                  "Digite algo para buscar jogos"
                )}
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8 flex flex-wrap items-center gap-4">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevância</SelectItem>
                  <SelectItem value="rating">Melhor Avaliação</SelectItem>
                  <SelectItem value="recent">Mais Recentes</SelectItem>
                  <SelectItem value="title">Título A-Z</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Gêneros</SelectItem>
                  <SelectItem value="action">Ação</SelectItem>
                  <SelectItem value="adventure">Aventura</SelectItem>
                  <SelectItem value="rpg">RPG</SelectItem>
                  <SelectItem value="strategy">Estratégia</SelectItem>
                  <SelectItem value="sports">Esportes</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Plataforma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Plataformas</SelectItem>
                  <SelectItem value="ps5">PlayStation 5</SelectItem>
                  <SelectItem value="xbox">Xbox Series X/S</SelectItem>
                  <SelectItem value="pc">PC</SelectItem>
                  <SelectItem value="switch">Nintendo Switch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Grid */}
            {searchResults.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {searchResults.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-12 flex justify-center gap-2">
                  <Button variant="outline" disabled={page === 1}>
                    Anterior
                  </Button>
                  <Button variant={page === 1 ? "default" : "outline"}>1</Button>
                  <Button variant={page === 2 ? "default" : "outline"}>2</Button>
                  <Button variant={page === 3 ? "default" : "outline"}>3</Button>
                  <Button variant="outline">Próximo</Button>
                </div>
              </>
            ) : query ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-muted-foreground">Nenhum resultado encontrado para "{query}"</p>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  )
}
