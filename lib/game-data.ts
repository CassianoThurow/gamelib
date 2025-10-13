import type { Game } from "./types"

// Mock game database - in a real app, this would come from an API
export const gamesDatabase: Record<string, Game> = {
  "1": {
    id: "1",
    title: "The Last of Us Part II",
    cover: "/the-last-of-us-game-cover.jpg",
    rating: 4.8,
    reviews: 15420,
    genre: "Ação/Aventura",
    year: 2020,
    developer: "Naughty Dog",
    publisher: "Sony Interactive",
    platforms: "PS4, PS5, PC",
    description:
      "Cinco anos após sua perigosa jornada pelos Estados Unidos pós-pandêmicos, Ellie e Joel se estabeleceram em Jackson, Wyoming. Viver entre uma próspera comunidade de sobreviventes lhes trouxe paz e estabilidade, apesar da ameaça constante dos infectados e de outros sobreviventes mais desesperados.",
  },
  "2": {
    id: "2",
    title: "God of War Ragnarök",
    cover: "/god-of-war-ragnarok-cover.jpg",
    rating: 4.9,
    reviews: 12350,
    genre: "Ação/Aventura",
    year: 2022,
    developer: "Santa Monica Studio",
    publisher: "Sony Interactive",
    platforms: "PS4, PS5",
    description:
      "Kratos e Atreus embarcam em uma jornada épica através dos Nove Reinos em busca de respostas enquanto as forças asgardianas se preparam para uma batalha profetizada que acabará com o mundo.",
  },
  "3": {
    id: "3",
    title: "Elden Ring",
    cover: "/elden-ring-cover.jpg",
    rating: 4.7,
    reviews: 18900,
    genre: "RPG/Ação",
    year: 2022,
    developer: "FromSoftware",
    publisher: "Bandai Namco",
    platforms: "PC, PS4, PS5, Xbox",
    description:
      "O Anel Prístino foi destruído. Levante-se, Maculado, e seja guiado pela graça para portar o poder do Anel Prístino e se tornar um Lorde Prístino nas Terras Intermédias.",
  },
  "4": {
    id: "4",
    title: "Baldur's Gate 3",
    cover: "/baldurs-gate-3-cover.jpg",
    rating: 4.9,
    reviews: 22100,
    genre: "RPG",
    year: 2023,
    developer: "Larian Studios",
    publisher: "Larian Studios",
    platforms: "PC, PS5, Xbox",
    description:
      "Reúna seu grupo e retorne às Terras Esquecidas em um conto de companheirismo e traição, sacrifício e sobrevivência, e a atração do poder absoluto.",
  },
  "5": {
    id: "5",
    title: "Cyberpunk 2077",
    cover: "/cyberpunk-2077-cover.jpg",
    rating: 4.3,
    reviews: 9800,
    genre: "RPG/Ação",
    year: 2020,
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    platforms: "PC, PS4, PS5, Xbox",
    description:
      "Cyberpunk 2077 é um RPG de ação e aventura em mundo aberto que se passa em Night City, uma megalópole obcecada por poder, glamour e modificações corporais.",
  },
  "6": {
    id: "6",
    title: "Red Dead Redemption 2",
    cover: "/red-dead-redemption-2-cover.jpg",
    rating: 4.8,
    reviews: 25600,
    genre: "Ação/Aventura",
    year: 2018,
    developer: "Rockstar Games",
    publisher: "Rockstar Games",
    platforms: "PC, PS4, Xbox One",
    description:
      "América, 1899. O fim da era do velho oeste começou. Depois de um roubo que deu errado na cidade de Blackwater, Arthur Morgan e a gangue Van der Linde são forçados a fugir.",
  },
  "7": {
    id: "7",
    title: "Hogwarts Legacy",
    cover: "/hogwarts-legacy-cover.jpg",
    rating: 4.5,
    reviews: 14200,
    genre: "RPG/Ação",
    year: 2023,
    developer: "Avalanche Software",
    publisher: "Warner Bros",
    platforms: "PC, PS4, PS5, Xbox, Switch",
    description:
      "Hogwarts Legacy é um RPG de ação imersivo e de mundo aberto ambientado no mundo introduzido pela primeira vez nos livros de Harry Potter.",
  },
  "8": {
    id: "8",
    title: "Spider-Man 2",
    cover: "/spider-man-2-cover.jpg",
    rating: 4.7,
    reviews: 11500,
    genre: "Ação/Aventura",
    year: 2023,
    developer: "Insomniac Games",
    publisher: "Sony Interactive",
    platforms: "PS5",
    description:
      "Os Spider-Men Peter Parker e Miles Morales enfrentam o teste definitivo de força, tanto dentro quanto fora da máscara, enquanto lutam para salvar a cidade, uns aos outros e aqueles que amam.",
  },
}

export function getGameById(id: string): Game | undefined {
  return gamesDatabase[id]
}

export function getAllGames(): Game[] {
  return Object.values(gamesDatabase)
}

export function searchGames(query: string): Game[] {
  const lowerQuery = query.toLowerCase()
  return Object.values(gamesDatabase).filter(
    (game) =>
      game.title.toLowerCase().includes(lowerQuery) ||
      game.genre.toLowerCase().includes(lowerQuery) ||
      game.developer?.toLowerCase().includes(lowerQuery),
  )
}
