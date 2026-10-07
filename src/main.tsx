import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router'
import AppSkeleton from './AppSkeleton'
import MovieDetailsPage from './pages/MovieDetailsPage'
import MovieGalleryPage from './pages/MovieGalleryPage'
import MovieListPage from './pages/MovieListPage'
import NotFoundPage from './pages/NotFoundPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path='/' element={<AppSkeleton />}>
          <Route index element={<MovieListPage />} />
          <Route path='gallery' element={<MovieGalleryPage />} />
          <Route path='movies/:movieId' element={<MovieDetailsPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>
)
