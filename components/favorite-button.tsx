"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useLibrary } from "@/contexts/library-context"

interface FavoriteButtonProps {
  gameId: string
}

export function FavoriteButton({ gameId }: FavoriteButtonProps) {
  const { library, toggleFavorite } = useLibrary()
  const isFavorite = library[gameId]?.isFavorite || false

  return (
    <Button variant="outline" className="gap-2 bg-transparent" onClick={() => toggleFavorite(gameId)}>
      <Heart className={`h-4 w-4 ${isFavorite ? "fill-primary text-primary" : ""}`} />
      {isFavorite ? "Favoritado" : "Favoritar"}
    </Button>
  )
}
