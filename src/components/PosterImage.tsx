import { useState } from 'react'

interface PosterImageProps {
  alt: string
  className: string
  src: string | null
}

function PosterImage({ alt, className, src }: PosterImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null)
  const imageFailed = src !== null && failedSource === src

  if (!src || imageFailed) {
    return (
      <div
        aria-label={`${alt} poster unavailable`}
        className={`${className} flex items-center justify-center bg-zinc-800 px-5 text-center text-sm text-zinc-500`}
        role="img"
      >
        Poster unavailable
      </div>
    )
  }

  return (
    <img
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailedSource(src)}
      src={src}
    />
  )
}

export default PosterImage
