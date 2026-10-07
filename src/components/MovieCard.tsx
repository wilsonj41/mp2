import { Link } from 'react-router'
import { getImageUrl } from '../api/tmdb'
import type { MovieSummary } from '../types/tmdb'
import PosterImage from './PosterImage'

interface MovieCardProps {
  movie: MovieSummary
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link
      className="group overflow-hidden rounded-lg border border-white/10 bg-[#151820] shadow-lg shadow-black/20 transition-colors hover:border-amber-400/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
      to={`/movies/${movie.id}`}
    >
      <PosterImage
        alt={`${movie.title} poster`}
        className="h-[330px] w-full object-cover"
        src={getImageUrl(movie.poster_path, 'w500')}
      />
      <div className="p-4">
        <h2 className="truncate font-semibold text-white transition-colors group-hover:text-amber-300">
          {movie.title}
        </h2>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-zinc-400">
            {movie.release_date?.slice(0, 4) || 'Unknown'}
          </span>
          <span className="font-semibold text-amber-300">
            ★ {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard

