import { Link, NavLink } from 'react-router'

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  [
    'border-b-2 px-1 py-5 text-sm font-semibold tracking-wide transition-colors',
    isActive
      ? 'border-amber-400 text-white'
      : 'border-transparent text-zinc-400 hover:text-white',
  ].join(' ')

function AppHeader() {
  return (
    <header className="border-b border-white/10 bg-header">
      <div className="mx-auto flex w-280 items-center justify-between">
        <Link className="flex items-center gap-3 text-white" to="/">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-lg font-black text-zinc-950">
            M
          </span>
          <span className="text-lg font-bold tracking-tight">Movie Archive</span>
        </Link>

        <nav aria-label="Primary navigation" className="flex items-center gap-8">
          <NavLink className={navLinkClasses} end to="/">
            Movie List
          </NavLink>
          <NavLink className={navLinkClasses} to="/gallery">
            Poster Gallery
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default AppHeader
