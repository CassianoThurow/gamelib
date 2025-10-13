"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getGameSuggestions } from "@/lib/rawg-api"

export function SearchAutocomplete() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem("recentSearches")
    if (stored) {
      setRecentSearches(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length > 1) {
        setIsLoading(true)
        try {
          const results = await getGameSuggestions(query)
          setSuggestions(results)
          setIsOpen(true)
        } catch (error) {
          console.error("Error fetching suggestions:", error)
          setSuggestions([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setSuggestions([])
        setIsOpen(query.trim().length === 0 && recentSearches.length > 0)
      }
    }

    const timeoutId = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timeoutId)
  }, [query, recentSearches.length])

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem("recentSearches", JSON.stringify(updated))
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsOpen(false)
      setQuery("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-lg">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar jogos, desenvolvedoras..."
            className="w-full pl-10 bg-secondary border-border"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (query.trim().length > 0 || recentSearches.length > 0) {
                setIsOpen(true)
              }
            }}
          />
        </div>
      </form>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full rounded-lg border border-border bg-card shadow-lg z-50">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Buscando...</div>
          ) : suggestions.length > 0 ? (
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground">Sugestões</p>
              {suggestions.map((game) => (
                <Link
                  key={game.id}
                  href={`/game/${game.id}`}
                  onClick={() => {
                    setIsOpen(false)
                    setQuery("")
                  }}
                  className="flex items-center gap-3 rounded-md p-2 hover:bg-accent transition-colors"
                >
                  <div className="relative h-12 w-9 flex-shrink-0 overflow-hidden rounded">
                    <Image
                      src={game.background_image || "/placeholder.svg?height=48&width=36"}
                      alt={game.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{game.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {game.genres?.map((g: any) => g.name).join(", ") || "N/A"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : query.trim().length > 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Nenhum resultado encontrado</div>
          ) : recentSearches.length > 0 ? (
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground">Buscas recentes</p>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="flex w-full items-center gap-3 rounded-md p-2 hover:bg-accent transition-colors text-left"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{search}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
