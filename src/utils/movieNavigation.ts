const STORAGE_KEY = 'movie-catalog-navigation'

export interface MovieNavigationSequence {
  movieIds: number[]
  sourcePath: string
  sourceLabel: string
}

export function saveMovieNavigation(
  movieIds: number[],
  sourcePath: string,
  sourceLabel: string,
): void {
  const sequence: MovieNavigationSequence = {
    movieIds,
    sourcePath,
    sourceLabel,
  }

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sequence))
}

export function getMovieNavigation(): MovieNavigationSequence | null {
  const storedSequence = sessionStorage.getItem(STORAGE_KEY)

  if (!storedSequence) {
    return null
  }

  try {
    const sequence = JSON.parse(storedSequence) as MovieNavigationSequence

    if (
      !Array.isArray(sequence.movieIds) ||
      typeof sequence.sourcePath !== 'string' ||
      typeof sequence.sourceLabel !== 'string'
    ) {
      return null
    }

    return sequence
  } catch {
    return null
  }
}

