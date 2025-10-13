const BASE_URL = "https://api.rawg.io/api"

export interface RAWGGame {
  id: number
  name: string
  background_image: string
  rating: number
  ratings_count: number
  genres: Array<{ id: number; name: string }>
  released: string
  platforms: Array<{
    platform: { id: number; name: string }
  }>
  metacritic?: number
  playtime?: number
  developers?: Array<{ id: number; name: string }>
  publishers?: Array<{ id: number; name: string }>
  description_raw?: string
  esrb_rating?: { id: number; name: string }
  tags?: Array<{ id: number; name: string }>
}

export interface RAWGGameDetails extends RAWGGame {
  description_raw: string
  developers: Array<{ id: number; name: string }>
  publishers: Array<{ id: number; name: string }>
  website?: string
  reddit_url?: string
}

export interface RAWGResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// Buscar jogos com filtros
export async function searchGames(query: string, page = 1, pageSize = 20): Promise<RAWGResponse<RAWGGame>> {
  const params = new URLSearchParams({
    key: `${process.env.RAWG_API_KEY}`,
    search: query,
    page: page.toString(),
    page_size: pageSize.toString(),
  })

  const response = await fetch(`${BASE_URL}/games?${params}`)
  if (!response.ok) throw new Error("Failed to search games")
  return response.json()
}

// Buscar jogos populares/trending
export async function getTrendingGames(
  period: "day" | "week" | "month" = "week",
  page = 1,
  pageSize = 20,
): Promise<RAWGResponse<RAWGGame>> {
  const dates = getDateRange(period)
  const params = new URLSearchParams({
    key: `${process.env.RAWG_API_KEY}`,
    dates: dates,
    ordering: "-added",
    page: page.toString(),
    page_size: pageSize.toString(),
  })

  const response = await fetch(`${BASE_URL}/games?${params}`)
  if (!response.ok) throw new Error("Failed to fetch trending games")
  return response.json()
}

// Buscar detalhes de um jogo específico
export async function getGameDetails(id: string): Promise<RAWGGameDetails> {
  const params = new URLSearchParams({
    key: `${process.env.RAWG_API_KEY}`,
  })

  const response = await fetch(`${BASE_URL}/games/${id}?${params}`)
  if (!response.ok) throw new Error("Failed to fetch game details")
  return response.json()
}

// Buscar jogos por gênero
export async function getGamesByGenre(genreId: number, page = 1, pageSize = 20): Promise<RAWGResponse<RAWGGame>> {
  const params = new URLSearchParams({
    key: `${process.env.RAWG_API_KEY}`,
    genres: genreId.toString(),
    page: page.toString(),
    page_size: pageSize.toString(),
  })

  const response = await fetch(`${BASE_URL}/games?${params}`)
  if (!response.ok) throw new Error("Failed to fetch games by genre")
  return response.json()
}

// Buscar jogos recentes
export async function getRecentGames(page = 1, pageSize = 20): Promise<RAWGResponse<RAWGGame>> {
  const params = new URLSearchParams({
    key: `${process.env.RAWG_API_KEY}`,
    dates: getDateRange("month"),
    ordering: "-released",
    page: page.toString(),
    page_size: pageSize.toString(),
  })

  const response = await fetch(`${BASE_URL}/games?${params}`)
  if (!response.ok) throw new Error("Failed to fetch recent games")
  return response.json()
}

// Buscar sugestões de autocomplete
export async function getGameSuggestions(query: string): Promise<RAWGGame[]> {
  if (!query || query.length < 2) return []

  const params = new URLSearchParams({
    key: `${process.env.RAWG_API_KEY}`,
    search: query,
    page_size: "5",
  })

  const response = await fetch(`${BASE_URL}/games?${params}`)
  if (!response.ok) return []
  const data: RAWGResponse<RAWGGame> = await response.json()
  return data.results
}

// Buscar screenshots de um jogo
export async function getGameScreenshots(gameId: string) {
  const params = new URLSearchParams({
    key: `${process.env.RAWG_API_KEY}`,
  })

  const response = await fetch(`${BASE_URL}/games/${gameId}/screenshots?${params}`)
  if (!response.ok) throw new Error("Failed to fetch screenshots")
  return response.json()
}

// Buscar jogos mais bem avaliados (por metacritic)
export async function getTopRatedGames(page = 1, pageSize = 20): Promise<RAWGResponse<RAWGGame>> {
  const params = new URLSearchParams({
    key: `${process.env.RAWG_API_KEY}`,
    ordering: "-metacritic",
    metacritic: "80,100", // Apenas jogos com metacritic acima de 80
    page: page.toString(),
    page_size: pageSize.toString(),
  })

  const response = await fetch(`${BASE_URL}/games?${params}`)
  if (!response.ok) throw new Error("Failed to fetch top rated games")
  return response.json()
}

// Buscar jogos mais populares (por rating e número de avaliações)
export async function getPopularGames(page = 1, pageSize = 20): Promise<RAWGResponse<RAWGGame>> {
  const params = new URLSearchParams({
    key: `${process.env.RAWG_API_KEY}`,
    ordering: "-rating,-ratings_count",
    page: page.toString(),
    page_size: pageSize.toString(),
  })

  const response = await fetch(`${BASE_URL}/games?${params}`)
  if (!response.ok) throw new Error("Failed to fetch popular games")
  return response.json()
}

// Buscar jogos mais jogados (por playtime)
export async function getMostPlayedGames(page = 1, pageSize = 20): Promise<RAWGResponse<RAWGGame>> {
  const lastYear = new Date()
  lastYear.setFullYear(lastYear.getFullYear() - 1)
  
  const params = new URLSearchParams({
    key: `${process.env.RAWG_API_KEY}`,
    ordering: "-added", // Jogos mais adicionados às bibliotecas
    dates: `${formatDate(lastYear)},${formatDate(new Date())}`,
    page: page.toString(),
    page_size: pageSize.toString(),
  })

  const response = await fetch(`${BASE_URL}/games?${params}`)
  if (!response.ok) throw new Error("Failed to fetch most played games")
  return response.json()
}

// Buscar próximos lançamentos
export async function getUpcomingGames(page = 1, pageSize = 20): Promise<RAWGResponse<RAWGGame>> {
  const today = new Date()
  const future = new Date()
  future.setMonth(today.getMonth() + 6) // Próximos 6 meses
  
  const params = new URLSearchParams({
    key: `${process.env.RAWG_API_KEY}`,
    dates: `${formatDate(today)},${formatDate(future)}`,
    ordering: "released",
    page: page.toString(),
    page_size: pageSize.toString(),
  })

  const response = await fetch(`${BASE_URL}/games?${params}`)
  if (!response.ok) throw new Error("Failed to fetch upcoming games")
  return response.json()
}

// Buscar jogos por plataforma
export async function getGamesByPlatform(
  platformId: number,
  page = 1,
  pageSize = 20,
): Promise<RAWGResponse<RAWGGame>> {
  const params = new URLSearchParams({
    key: `${process.env.RAWG_API_KEY}`,
    platforms: platformId.toString(),
    ordering: "-rating",
    page: page.toString(),
    page_size: pageSize.toString(),
  })

  const response = await fetch(`${BASE_URL}/games?${params}`)
  if (!response.ok) throw new Error("Failed to fetch games by platform")
  return response.json()
}

// Helper para gerar range de datas
function getDateRange(period: "day" | "week" | "month"): string {
  const today = new Date()
  const past = new Date()

  switch (period) {
    case "day":
      past.setDate(today.getDate() - 1)
      break
    case "week":
      past.setDate(today.getDate() - 7)
      break
    case "month":
      past.setMonth(today.getMonth() - 1)
      break
  }

  return `${formatDate(past)},${formatDate(today)}`
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

// Converter RAWGGame para o formato Game do app
export function convertRAWGGameToGame(rawgGame: RAWGGame) {
  return {
    id: rawgGame.id.toString(),
    title: rawgGame.name,
    cover: rawgGame.background_image || "/placeholder.svg?height=400&width=300",
    rating: rawgGame.rating,
    reviews: rawgGame.ratings_count,
    genre: rawgGame.genres.map((g) => g.name).join(", ") || "N/A",
    year: rawgGame.released ? new Date(rawgGame.released).getFullYear() : 0,
    platforms: rawgGame.platforms?.map((p) => p.platform.name).join(", "),
  }
}

export function convertRAWGGameDetailsToGame(rawgGame: RAWGGameDetails) {
  return {
    id: rawgGame.id.toString(),
    title: rawgGame.name,
    cover: rawgGame.background_image || "/placeholder.svg?height=400&width=300",
    rating: rawgGame.rating,
    reviews: rawgGame.ratings_count,
    genre: rawgGame.genres.map((g) => g.name).join(", ") || "N/A",
    year: rawgGame.released ? new Date(rawgGame.released).getFullYear() : 0,
    developer: rawgGame.developers?.map((d) => d.name).join(", "),
    publisher: rawgGame.publishers?.map((p) => p.name).join(", "),
    platforms: rawgGame.platforms?.map((p) => p.platform.name).join(", "),
    description: rawgGame.description_raw,
  }
}
