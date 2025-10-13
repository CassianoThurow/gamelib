"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { useLibrary } from "@/contexts/library-context"

interface ProgressDialogProps {
  gameId: string
  currentProgress?: number
  currentHours?: number
  trigger?: React.ReactNode
}

export function ProgressDialog({ gameId, currentProgress = 0, currentHours = 0, trigger }: ProgressDialogProps) {
  const { updateProgress } = useLibrary()
  const [progress, setProgress] = useState(currentProgress)
  const [hours, setHours] = useState(currentHours)
  const [open, setOpen] = useState(false)

  const handleSave = () => {
    updateProgress(gameId, progress, hours)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button variant="outline">Atualizar Progresso</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Atualizar Progresso</DialogTitle>
          <DialogDescription>Atualize seu progresso e horas jogadas neste jogo.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="progress">Progresso</Label>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Slider
              id="progress"
              min={0}
              max={100}
              step={5}
              value={[progress]}
              onValueChange={([v]) => setProgress(v)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hours">Horas Jogadas</Label>
            <Input
              id="hours"
              type="number"
              min={0}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              placeholder="0"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
