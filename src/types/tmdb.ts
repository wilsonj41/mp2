export interface MovieSummary {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids: number[]
  original_language: string
}

export interface MoviePageResponse {
  page: number
  results: MovieSummary[]
  total_pages: number
  total_results: number
}

export interface Genre {
  id: number
  name: string
}

export interface GenreResponse {
  genres: Genre[]
}

export interface ProductionCompany {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

export interface MovieDetails extends Omit<MovieSummary, 'genre_ids'> {
  genres: Genre[]
  runtime: number | null
  status: string
  tagline: string
  homepage: string
  budget: number
  revenue: number
  production_companies: ProductionCompany[]
}

