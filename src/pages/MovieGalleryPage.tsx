import { useEffect, useRef, useState } from 'react'
import {
  discoverMovies,
  getApiErrorMessage,
  getMovieGenres,
  isCanceledRequest,
} from '../api/tmdb'
import ErrorMessage from '../components/ErrorMessage'
import LoadingState from '../components/LoadingState'
import MovieCard from '../components/MovieCard'
import type { Genre, MovieSummary } from '../types/tmdb'
import { appendUniqueMovies } from '../utils/movies'
import { saveMovieNavigation } from '../utils/movieNavigation'

function MovieGalleryPage() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([])
  const [movies, setMovies] = useState<MovieSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const loadMoreController = useRef<AbortController | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadGenres() {
      try {
        const genreResults = await getMovieGenres(controller.signal)
        setGenres(genreResults)
      } catch (requestError) {
        if (!isCanceledRequest(requestError)) {
          setError(getApiErrorMessage(requestError))
        }
      }
    }

    void loadGenres()

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadMovies() {
      loadMoreController.current?.abort()
      setIsLoadingMore(false)
      setIsLoading(true)
      setError('')

      try {
        const response = await discoverMovies(
          selectedGenreIds,
          1,
          controller.signal,
        )
        setMovies(response.results)
        setCurrentPage(response.page)
        setTotalPages(response.total_pages)
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
      loadMoreController.current?.abort()
    }
  }, [selectedGenreIds])

  async function loadMoreMovies() {
    if (isLoadingMore || currentPage >= totalPages) {
      return
    }

    const controller = new AbortController()
    loadMoreController.current = controller
    const nextPage = currentPage + 1

    setIsLoadingMore(true)
    setError('')

    try {
      const response = await discoverMovies(
        selectedGenreIds,
        nextPage,
        controller.signal,
      )

      if (controller.signal.aborted) {
        return
      }

      setMovies((currentMovies) =>
        appendUniqueMovies(currentMovies, response.results),
      )
      setCurrentPage(response.page)
      setTotalPages(response.total_pages)
    } catch (requestError) {
      if (!isCanceledRequest(requestError)) {
        setError(getApiErrorMessage(requestError))
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoadingMore(false)
      }
    }
  }

  useEffect(() => {
    if (movies.length > 0) {
      saveMovieNavigation(
        movies.map((movie) => movie.id),
        '/gallery',
        'Poster Gallery',
      )
    }
  }, [movies])

  function toggleGenre(genreId: number) {
    setSelectedGenreIds((currentIds) =>
      currentIds.includes(genreId)
        ? currentIds.filter((id) => id !== genreId)
        : [...currentIds, genreId],
    )
  }

  return (
    <section className="mx-auto w-280 py-10">
      <div className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-section text-amber-400">
          Explore by poster
        </p>
        <h1 className="text-4xl font-black tracking-tight text-white">
          Movie gallery
        </h1>
        <p className="mt-3 text-zinc-400">
          Choose one or more genres to narrow the gallery.
        </p>
      </div>

      <div className="mb-8 rounded-xl border border-white/10 bg-panel p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
            Filter by genre
          </h2>
          {selectedGenreIds.length > 0 && (
            <button
              className="text-sm font-semibold text-amber-300 hover:text-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
              onClick={() => setSelectedGenreIds([])}
              type="button"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => {
            const isSelected = selectedGenreIds.includes(genre.id)

            return (
              <button
                aria-pressed={isSelected}
                className={[
                  'rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400',
                  isSelected
                    ? 'border-amber-400 bg-amber-400 text-zinc-950'
                    : 'border-white/10 bg-field text-zinc-300 hover:border-zinc-500 hover:text-white',
                ].join(' ')}
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                type="button"
              >
                {genre.name}
              </button>
            )
          })}
        </div>
      </div>

      {error && <ErrorMessage message={error} />}
      {isLoading && <LoadingState message="Loading the poster gallery…" />}

      {!isLoading && !error && movies.length === 0 && (
        <div className="rounded-xl border border-dashed border-white/15 py-20 text-center">
          <h2 className="text-lg font-semibold text-white">
            No matching movies found
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Remove a genre to broaden the gallery.
          </p>
        </div>
      )}

      {!isLoading && movies.length > 0 && (
        <>
          <div className="grid grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {currentPage < totalPages && (
            <div className="mt-8 flex justify-center">
              <button
                className="min-w-40 rounded-md bg-amber-400 px-6 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-300 disabled:cursor-wait disabled:bg-amber-400/60"
                disabled={isLoadingMore}
                onClick={() => void loadMoreMovies()}
                type="button"
              >
                {isLoadingMore ? 'Loading more…' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default MovieGalleryPage
