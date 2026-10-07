interface LoadingStateProps {
  message?: string
}

function LoadingState({ message = 'Loading movies…' }: LoadingStateProps) {
  return (
    <div
      aria-live="polite"
      className="flex min-h-60 items-center justify-center text-zinc-400"
      role="status"
    >
      <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-amber-400" />
      {message}
    </div>
  )
}

export default LoadingState

