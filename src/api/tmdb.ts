import axios from 'axios'
import type {
  Genre,
  GenreResponse,
  MovieDetails,
  MoviePageResponse,
} from '../types/tmdb'

const accessToken = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Accept: 'application/json',
  },
})

tmdbApi.interceptors.request.use((config) => {
  if (!accessToken) {
    throw new Error(
      'The TMDB access token is missing. Add VITE_TMDB_READ_ACCESS_TOKEN to your .env file.',
    )
  }

  config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

const commonMovieParams = {
  include_adult: false,
  language: 'en-US',
}

export async function getPopularMovies(
  page = 1,
  signal?: AbortSignal,
): Promise<MoviePageResponse> {
  const response = await tmdbApi.get<MoviePageResponse>('/movie/popular', {
    params: {
      ...commonMovieParams,
      page,
    },
    signal,
  })

  return response.data
}

export async function searchMovies(
  query: string,
  page = 1,
  signal?: AbortSignal,
): Promise<MoviePageResponse> {
  const response = await tmdbApi.get<MoviePageResponse>('/search/movie', {
    params: {
      ...commonMovieParams,
      page,
      query,
    },
    signal,
  })

  return response.data
}

export async function getMovieGenres(signal?: AbortSignal): Promise<Genre[]> {
  const response = await tmdbApi.get<GenreResponse>('/genre/movie/list', {
    params: { language: 'en' },
    signal,
  })

  return response.data.genres
}

export async function discoverMovies(
  genreIds: number[],
  page = 1,
  signal?: AbortSignal,
): Promise<MoviePageResponse> {
  const response = await tmdbApi.get<MoviePageResponse>('/discover/movie', {
    params: {
      ...commonMovieParams,
      include_video: false,
      page,
      sort_by: 'popularity.desc',
      with_genres: genreIds.length > 0 ? genreIds.join(',') : undefined,
    },
    signal,
  })

  return response.data
}

export async function getMovieDetails(
  movieId: number,
  signal?: AbortSignal,
): Promise<MovieDetails> {
  const response = await tmdbApi.get<MovieDetails>(`/movie/${movieId}`, {
    params: { language: 'en-US' },
    signal,
  })

  return response.data
}

export function getImageUrl(
  path: string | null,
  size: 'w342' | 'w500' | 'w780' | 'original' = 'w500',
): string | null {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof Error && !axios.isAxiosError(error)) {
    return error.message
  }

  if (axios.isAxiosError<{ status_message?: string }>(error)) {
    if (error.response?.status === 401) {
      return 'TMDB rejected the access token. Check VITE_TMDB_READ_ACCESS_TOKEN in your .env file.'
    }

    return (
      error.response?.data?.status_message ??
      'TMDB could not complete the request. Please try again.'
    )
  }

  return 'Something went wrong while loading movie data.'
}

export function isCanceledRequest(error: unknown): boolean {
  return axios.isCancel(error)
}
