"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { UserGameData, GameStatus } from "@/lib/types"

interface LibraryContextType {
  library: Record<string, UserGameData>
  addGame: (gameId: string, status: GameStatus) => void
  removeGame: (gameId: string) => void
  updateGameStatus: (gameId: string, status: GameStatus) => void
  updateProgress: (gameId: string, progress: number, hoursPlayed?: number) => void
  toggleFavorite: (gameId: string) => void
  rateGame: (gameId: string, rating: number) => void
  getGameData: (gameId: string) => UserGameData | undefined
  getGamesByStatus: (status: GameStatus) => UserGameData[]
  getFavorites: () => UserGameData[]
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined)

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [library, setLibrary] = useState<Record<string, UserGameData>>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("gamelib-library")
    if (stored) {
      try {
        setLibrary(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to load library:", e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever library changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("gamelib-library", JSON.stringify(library))
    }
  }, [library, isLoaded])

  const addGame = (gameId: string, status: GameStatus) => {
    setLibrary((prev) => ({
      ...prev,
      [gameId]: {
        gameId,
        status,
        isFavorite: false,
        startedAt: new Date().toISOString(),
        progress: status === "playing" ? 0 : undefined,
        hoursPlayed: status === "playing" ? 0 : undefined,
      },
    }))
  }

  const removeGame = (gameId: string) => {
    setLibrary((prev) => {
      const newLibrary = { ...prev }
      delete newLibrary[gameId]
      return newLibrary
    })
  }

  const updateGameStatus = (gameId: string, status: GameStatus) => {
    setLibrary((prev) => {
      const game = prev[gameId]
      if (!game) return prev

      const updates: Partial<UserGameData> = { status }

      if (status === "completed" && !game.completedAt) {
        updates.completedAt = new Date().toISOString()
        updates.progress = 100
      } else if (status === "playing" && !game.startedAt) {
        updates.startedAt = new Date().toISOString()
      }

      return {
        ...prev,
        [gameId]: { ...game, ...updates },
      }
    })
  }

  const updateProgress = (gameId: string, progress: number, hoursPlayed?: number) => {
    setLibrary((prev) => {
      const game = prev[gameId]
      if (!game) return prev

      return {
        ...prev,
        [gameId]: {
          ...game,
          progress,
          hoursPlayed: hoursPlayed ?? game.hoursPlayed,
        },
      }
    })
  }

  const toggleFavorite = (gameId: string) => {
    setLibrary((prev) => {
      const game = prev[gameId]
      if (!game) {
        // If game not in library, add it to wishlist and favorite it
        return {
          ...prev,
          [gameId]: {
            gameId,
            status: "wishlist",
            isFavorite: true,
            startedAt: new Date().toISOString(),
          },
        }
      }

      return {
        ...prev,
        [gameId]: { ...game, isFavorite: !game.isFavorite },
      }
    })
  }

  const rateGame = (gameId: string, rating: number) => {
    setLibrary((prev) => {
      const game = prev[gameId]
      if (!game) return prev

      return {
        ...prev,
        [gameId]: { ...game, userRating: rating },
      }
    })
  }

  const getGameData = (gameId: string) => library[gameId]

  const getGamesByStatus = (status: GameStatus) => {
    return Object.values(library).filter((game) => game.status === status)
  }

  const getFavorites = () => {
    return Object.values(library).filter((game) => game.isFavorite)
  }

  return (
    <LibraryContext.Provider
      value={{
        library,
        addGame,
        removeGame,
        updateGameStatus,
        updateProgress,
        toggleFavorite,
        rateGame,
        getGameData,
        getGamesByStatus,
        getFavorites,
      }}
    >
      {children}
    </LibraryContext.Provider>
  )
}

export function useLibrary() {
  const context = useContext(LibraryContext)
  if (context === undefined) {
    throw new Error("useLibrary must be used within a LibraryProvider")
  }
  return context
}
