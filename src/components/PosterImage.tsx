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
        className={`${className} flex items-center justify-center overflow-hidden bg-zinc-800 px-1 text-center text-[10px] leading-tight text-zinc-500`}
        role="img"
      >
        No poster
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
