import { Link } from 'react-router'
import { getImageUrl } from '../api/tmdb'
import type { MovieSummary } from '../types/tmdb'
import PosterImage from './PosterImage'

interface MovieListItemProps {
  movie: MovieSummary
}

function formatReleaseYear(releaseDate: string): string {
  return releaseDate ? releaseDate.slice(0, 4) : 'Release date unknown'
}

function MovieListItem({ movie }: MovieListItemProps) {
  return (
    <Link
      className="movie-row-grid group grid items-center gap-5 border-b border-white/10 px-4 py-4 transition-colors hover:bg-white/4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
      to={`/movies/${movie.id}`}
    >
      <PosterImage
        alt={`${movie.title} poster`}
        className="h-24 w-16 rounded-md object-cover"
        src={getImageUrl(movie.poster_path, 'w342')}
      />

      <div className="min-w-0">
        <h2 className="truncate text-base font-semibold text-white transition-colors group-hover:text-amber-300">
          {movie.title}
        </h2>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-400">
          {movie.overview || 'No overview is available for this movie.'}
        </p>
      </div>

      <span className="text-sm text-zinc-300">
        {formatReleaseYear(movie.release_date)}
      </span>

      <span className="text-sm font-semibold text-amber-300">
        ★ {movie.vote_average.toFixed(1)}
      </span>
    </Link>
  )
}

export default MovieListItem
