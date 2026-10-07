import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  getApiErrorMessage,
  getImageUrl,
  getMovieDetails,
  isCanceledRequest,
} from '../api/tmdb'
import ErrorMessage from '../components/ErrorMessage'
import LoadingState from '../components/LoadingState'
import PosterImage from '../components/PosterImage'
import type { MovieDetails } from '../types/tmdb'
import { getMovieNavigation } from '../utils/movieNavigation'

function formatDate(releaseDate: string): string {
  if (!releaseDate) {
    return 'Unknown'
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
  }).format(new Date(`${releaseDate}T00:00:00`))
}

function formatRuntime(runtime: number | null): string {
  if (!runtime) {
    return 'Unknown'
  }

  const hours = Math.floor(runtime / 60)
  const minutes = runtime % 60
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
}

function MovieDetailsPage() {
  const { movieId } = useParams()
  const numericMovieId = Number(movieId)
  const isValidMovieId =
    Number.isInteger(numericMovieId) && numericMovieId > 0
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isValidMovieId) {
      return
    }

    const controller = new AbortController()

    async function loadMovie() {
      setIsLoading(true)
      setError('')

      try {
        const movieResult = await getMovieDetails(
          numericMovieId,
          controller.signal,
        )
        setMovie(movieResult)
      } catch (requestError) {
        if (!isCanceledRequest(requestError)) {
          setError(getApiErrorMessage(requestError))
          setMovie(null)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadMovie()

    return () => controller.abort()
  }, [isValidMovieId, numericMovieId])

  const movieNavigation = getMovieNavigation()
  const currentIndex =
    movieNavigation?.movieIds.indexOf(numericMovieId) ?? -1
  const hasSequence =
    movieNavigation !== null &&
    currentIndex >= 0 &&
    movieNavigation.movieIds.length > 1
  const previousId = hasSequence
    ? movieNavigation.movieIds[
        (currentIndex - 1 + movieNavigation.movieIds.length) %
          movieNavigation.movieIds.length
      ]
    : null
  const nextId = hasSequence
    ? movieNavigation.movieIds[
        (currentIndex + 1) % movieNavigation.movieIds.length
      ]
    : null

  if (!isValidMovieId) {
    return (
      <section className="mx-auto w-[1120px] py-16">
        <ErrorMessage message="This movie URL is not valid." />
        <Link
          className="mt-6 inline-block text-sm font-semibold text-amber-300 hover:text-amber-200"
          to="/"
        >
          ← Return to the movie list
        </Link>
      </section>
    )
  }

  if (isLoading) {
    return <LoadingState message="Loading movie details…" />
  }

  if (error || !movie) {
    return (
      <section className="mx-auto w-[1120px] py-16">
        <ErrorMessage message={error || 'Movie details are unavailable.'} />
        <Link
          className="mt-6 inline-block text-sm font-semibold text-amber-300 hover:text-amber-200"
          to="/"
        >
          ← Return to the movie list
        </Link>
      </section>
    )
  }

  const backdropUrl = getImageUrl(movie.backdrop_path, 'original')

  return (
    <article>
      <div className="relative h-[360px] overflow-hidden border-b border-white/10 bg-zinc-900">
        {backdropUrl && (
          <img
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-35"
            src={backdropUrl}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d12] via-[#0b0d12]/40 to-transparent" />
      </div>

      <div className="relative mx-auto -mt-52 grid w-[1120px] grid-cols-[260px_1fr] gap-10 pb-14">
        <PosterImage
          alt={`${movie.title} poster`}
          className="h-[390px] w-[260px] rounded-xl object-cover shadow-2xl shadow-black/60"
          src={getImageUrl(movie.poster_path, 'w500')}
        />

        <div className="pt-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-400">
            {movie.status}
          </p>
          <h1 className="text-5xl font-black tracking-tight text-white">
            {movie.title}
          </h1>
          {movie.tagline && (
            <p className="mt-3 text-lg italic text-zinc-400">“{movie.tagline}”</p>
          )}

          <div className="mt-6 flex items-center gap-5 text-sm text-zinc-300">
            <span>{formatDate(movie.release_date)}</span>
            <span aria-hidden="true" className="text-zinc-700">
              •
            </span>
            <span>{formatRuntime(movie.runtime)}</span>
            <span aria-hidden="true" className="text-zinc-700">
              •
            </span>
            <span className="font-semibold text-amber-300">
              ★ {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-zinc-500">
              ({movie.vote_count.toLocaleString()} votes)
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-300"
                key={genre.id}
              >
                {genre.name}
              </span>
            ))}
          </div>

          <section className="mt-9">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
              Overview
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-300">
              {movie.overview || 'No overview is available for this movie.'}
            </p>
          </section>

          <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Original language
              </dt>
              <dd className="mt-2 uppercase text-zinc-200">
                {movie.original_language}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Production
              </dt>
              <dd className="mt-2 text-zinc-200">
                {movie.production_companies[0]?.name || 'Unknown'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Popularity
              </dt>
              <dd className="mt-2 text-zinc-200">
                {movie.popularity.toFixed(1)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <nav
        aria-label="Movie detail navigation"
        className="border-t border-white/10 bg-[#101218]"
      >
        <div className="mx-auto flex w-[1120px] items-center justify-between py-6">
          <div className="w-48">
            {previousId && (
              <Link
                className="inline-flex rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-amber-400 hover:text-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                to={`/movies/${previousId}`}
              >
                ← Previous movie
              </Link>
            )}
          </div>

          <Link
            className="text-sm font-semibold text-zinc-400 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            to={movieNavigation?.sourcePath || '/'}
          >
            Back to {movieNavigation?.sourceLabel || 'Movie List'}
          </Link>

          <div className="flex w-48 justify-end">
            {nextId && (
              <Link
                className="inline-flex rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-amber-400 hover:text-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                to={`/movies/${nextId}`}
              >
                Next movie →
              </Link>
            )}
          </div>
        </div>
      </nav>
    </article>
  )
}

export default MovieDetailsPage
