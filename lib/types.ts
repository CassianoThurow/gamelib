export interface Game {
  id: string
  title: string
  cover: string
  rating: number
  reviews: number
  genre: string
  year: number
  developer?: string
  publisher?: string
  platforms?: string
  description?: string
}

export type GameStatus = "playing" | "completed" | "dropped" | "wishlist"

export interface UserGameData {
  gameId: string
  status: GameStatus
  isFavorite: boolean
  userRating?: number
  progress?: number
  hoursPlayed?: number
  startedAt?: string
  completedAt?: string
  notes?: string
}

export interface UserLibrary {
  games: Record<string, UserGameData>
}
