interface ErrorMessageProps {
  message: string
}

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      className="rounded-lg border border-red-400/30 bg-red-400/10 px-5 py-4 text-red-200"
      role="alert"
    >
      {message}
    </div>
  )
}

export default ErrorMessage

