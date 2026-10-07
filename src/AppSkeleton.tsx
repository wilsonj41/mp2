import { Outlet } from 'react-router'
import AppHeader from './components/AppHeader'
import './css/style.css'

function AppSkeleton() {
  return (
    <div className="min-h-screen bg-canvas text-zinc-100">
      <AppHeader />
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-white/10 py-6 text-center text-xs text-zinc-600">
        Movie data and images provided by TMDB.
      </footer>
    </div>
  )
}

export default AppSkeleton
