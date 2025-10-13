"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Check } from "lucide-react"
import { useLibrary } from "@/contexts/library-context"
import type { GameStatus } from "@/lib/types"

interface AddToLibraryButtonProps {
  gameId: string
}

const statusLabels: Record<GameStatus, string> = {
  playing: "Jogando",
  completed: "Completado",
  dropped: "Abandonado",
  wishlist: "Lista de Desejos",
}

export function AddToLibraryButton({ gameId }: AddToLibraryButtonProps) {
  const { library, addGame, updateGameStatus, removeGame } = useLibrary()
  const gameData = library[gameId]
  const [open, setOpen] = useState(false)

  const handleStatusChange = (status: GameStatus) => {
    if (gameData) {
      updateGameStatus(gameId, status)
    } else {
      addGame(gameId, status)
    }
    setOpen(false)
  }

  const handleRemove = () => {
    removeGame(gameId)
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2">
          {gameData ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {gameData ? statusLabels[gameData.status] : "Adicionar à Biblioteca"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {(Object.keys(statusLabels) as GameStatus[]).map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusChange(status)}
            className="flex items-center justify-between"
          >
            {statusLabels[status]}
            {gameData?.status === status && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
        {gameData && (
          <>
            <DropdownMenuItem className="border-t" onClick={handleRemove}>
              Remover da Biblioteca
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
