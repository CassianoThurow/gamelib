import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, Flame, Award } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoadingTrending() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Jogos em Alta</h1>
                  <p className="text-muted-foreground">Os jogos mais populares e comentados da comunidade</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="week" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="today">
                  <Flame className="mr-2 h-4 w-4" />
                  Hoje
                </TabsTrigger>
                <TabsTrigger value="week">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Semana
                </TabsTrigger>
                <TabsTrigger value="month">
                  <Award className="mr-2 h-4 w-4" />
                  Mês
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array(12).fill(0).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-[200px] w-full rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}