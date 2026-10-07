import type { MovieSummary } from '../types/tmdb'

export function appendUniqueMovies(
  currentMovies: MovieSummary[],
  newMovies: MovieSummary[],
): MovieSummary[] {
  const currentIds = new Set(currentMovies.map((movie) => movie.id))
  return [
    ...currentMovies,
    ...newMovies.filter((movie) => !currentIds.has(movie.id)),
  ]
}
