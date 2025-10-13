import Link from "next/link"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface GameCardProps {
  game: {
    id: string
    title: string
    cover: string
    rating: number
    genre: string
    year: number
    userRating?: number
  }
  showUserRating?: boolean
}

export function GameCard({ game, showUserRating }: GameCardProps) {
  return (
    <Link href={`/game/${game.id}`}>
      <Card className="group overflow-hidden transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/20">
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          <img
            src={game.cover || "/placeholder.svg"}
            alt={game.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 backdrop-blur">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-sm font-semibold">{game.rating.toFixed(1)}</span>
          </div>
          {showUserRating && game.userRating && (
            <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-primary px-2 py-1">
              <Star className="h-3 w-3 fill-primary-foreground text-primary-foreground" />
              <span className="text-sm font-semibold text-primary-foreground">{game.userRating}</span>
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-sm line-clamp-1 text-balance">{game.title}</h3>
          <div className="mt-2 flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {game.genre}
            </Badge>
            <span className="text-xs text-muted-foreground">{game.year}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
