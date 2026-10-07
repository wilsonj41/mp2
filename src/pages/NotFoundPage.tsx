import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[600px] w-[1120px] flex-col items-center justify-center text-center">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-400">
        404
      </p>
      <h1 className="mt-3 text-5xl font-black tracking-tight text-white">
        This page is off screen
      </h1>
      <p className="mt-4 text-zinc-400">
        The page you requested does not exist in this catalog.
      </p>
      <Link
        className="mt-8 rounded-md bg-amber-400 px-5 py-3 text-sm font-bold text-zinc-950 hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
        to="/"
      >
        Browse movies
      </Link>
    </section>
  )
}

export default NotFoundPage

