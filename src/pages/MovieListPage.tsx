import { useEffect, useMemo, useRef, useState } from 'react'
import {
  getApiErrorMessage,
  getPopularMovies,
  isCanceledRequest,
  searchMovies,
} from '../api/tmdb'
import ErrorMessage from '../components/ErrorMessage'
import MovieListItem from '../components/MovieListItem'
import type { MovieSummary } from '../types/tmdb'
import { saveMovieNavigation } from '../utils/movieNavigation'

type SortField = 'title' | 'release_date' | 'vote_average' | 'popularity'
type SortDirection = 'asc' | 'desc'

function SelectChevron() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-300"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        d="m6 8 4 4 4-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

function compareMovies(
  firstMovie: MovieSummary,
  secondMovie: MovieSummary,
  sortField: SortField,
): number {
  if (sortField === 'title') {
    return firstMovie.title.localeCompare(secondMovie.title)
  }

  if (sortField === 'release_date') {
    return firstMovie.release_date.localeCompare(secondMovie.release_date)
  }

  return firstMovie[sortField] - secondMovie[sortField]
}

function MovieListPage() {
  const [movies, setMovies] = useState<MovieSummary[]>([])
  const [query, setQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('popularity')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const movieCache = useRef(new Map<string, MovieSummary[]>())

  useEffect(() => {
    const controller = new AbortController()
    const trimmedQuery = query.trim()
    const cacheKey = trimmedQuery.toLocaleLowerCase()

    async function loadMovies() {
      setError('')

      const cachedMovies = movieCache.current.get(cacheKey)
      if (cachedMovies) {
        setMovies(cachedMovies)
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      try {
        const results = trimmedQuery
          ? await searchMovies(trimmedQuery, controller.signal)
          : await getPopularMovies(controller.signal)

        movieCache.current.set(cacheKey, results)
        setMovies(results)
      } catch (requestError) {
        if (!isCanceledRequest(requestError)) {
          setError(getApiErrorMessage(requestError))
          setMovies([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadMovies()

    return () => {
      controller.abort()
    }
  }, [query])

  const sortedMovies = useMemo(() => {
    const directionMultiplier = sortDirection === 'asc' ? 1 : -1

    return [...movies].sort(
      (firstMovie, secondMovie) =>
        compareMovies(firstMovie, secondMovie, sortField) *
        directionMultiplier,
    )
  }, [movies, sortDirection, sortField])

  useEffect(() => {
    if (sortedMovies.length > 0) {
      saveMovieNavigation(
        sortedMovies.map((movie) => movie.id),
        '/',
        'Movie List',
      )
    }
  }, [sortedMovies])

  return (
    <section className="mx-auto w-[1120px] py-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-400">
            Browse the catalog
          </p>
          <h1 className="text-4xl font-black tracking-tight text-white">
            Find your next movie
          </h1>
          <p className="mt-3 text-zinc-400">
            Search TMDB and sort the results your way.
          </p>
        </div>
        {!isLoading && !error && (
          <p className="text-sm text-zinc-500">
            {sortedMovies.length}{' '}
            {sortedMovies.length === 1 ? 'movie' : 'movies'}
          </p>
        )}
      </div>

      <div className="mb-6 grid grid-cols-[1fr_220px_180px] gap-4 rounded-xl border border-white/10 bg-[#151820] p-5">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Search by title
          </span>
          <div className="relative">
            <input
              className="h-11 w-full rounded-md border border-white/10 bg-[#0d0f14] px-4 pr-12 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-amber-400"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try The Godfather…"
              type="search"
              value={query}
            />
            {isLoading && (
              <span
                aria-label="Updating movie results"
                className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-zinc-600 border-t-amber-400"
                role="status"
              />
            )}
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Sort by
          </span>
          <div className="relative">
            <select
              className="h-11 w-full appearance-none rounded-md border border-white/10 bg-[#0d0f14] px-3 pr-10 text-sm text-white outline-none focus:border-amber-400"
              onChange={(event) =>
                setSortField(event.target.value as SortField)
              }
              value={sortField}
            >
              <option value="title">Title</option>
              <option value="release_date">Release date</option>
              <option value="vote_average">Rating</option>
              <option value="popularity">Popularity</option>
            </select>
            <SelectChevron />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Order
          </span>
          <div className="relative">
            <select
              className="h-11 w-full appearance-none rounded-md border border-white/10 bg-[#0d0f14] px-3 pr-10 text-sm text-white outline-none focus:border-amber-400"
              onChange={(event) =>
                setSortDirection(event.target.value as SortDirection)
              }
              value={sortDirection}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <SelectChevron />
          </div>
        </label>
      </div>

      {error && <ErrorMessage message={error} />}

      {!isLoading && !error && sortedMovies.length === 0 && (
        <div className="rounded-xl border border-dashed border-white/15 py-20 text-center">
          <h2 className="text-lg font-semibold text-white">No movies found</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Try a different title in the search field.
          </p>
        </div>
      )}

      {!error && sortedMovies.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#12151b]">
          <div className="grid grid-cols-[72px_1fr_120px_110px] gap-5 border-b border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
            <span>Poster</span>
            <span>Movie</span>
            <span>Released</span>
            <span>Rating</span>
          </div>
          {sortedMovies.map((movie) => (
            <MovieListItem key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  )
}

export default MovieListPage
