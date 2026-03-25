import { getGenreColor } from '../lib/models'
import styles from './PosterFallback.module.css'

/**
 * Reusable poster fallback.
 * Props:
 *   title  : string
 *   genre  : string | null       — single genre (legacy)
 *   genres : string[]            — multiple genres (preferred)
 *   size   : 'sm' | 'md' | 'lg'
 */
export default function PosterFallback({ title, genre, genres, size = 'md' }) {
  // Normalise to array
  const genreList = genres?.length
    ? genres
    : genre ? [genre] : []

  const colors = genreList.length
    ? genreList.map(g => getGenreColor(g))
    : ['#888888']

  // Build gradient: single color → solid, multiple → diagonal multi-stop
  const gradient = colors.length === 1
    ? `linear-gradient(145deg, color-mix(in srgb, ${colors[0]} 30%, var(--bg3)), var(--bg4))`
    : `linear-gradient(145deg, ${colors.map((c, i) => {
        const pct = Math.round((i / (colors.length - 1)) * 100)
        return `color-mix(in srgb, ${c} 35%, var(--bg3)) ${pct}%`
      }).join(', ')})`

  const initials = title
    ? title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : '?'

  // Text color from first genre
  const textColor = `color-mix(in srgb, ${colors[0]} 80%, white)`
  const subColor  = `color-mix(in srgb, ${colors[0]} 60%, white)`

  return (
    <div className={`${styles.wrap} ${styles[size]}`}>
      <div className={styles.bg} style={{ background: gradient }} />
      <div className={styles.initials} style={{ color: textColor }}>{initials}</div>
      {genreList.length > 0 && (
        <div className={styles.genre} style={{ color: subColor }}>
          {genreList[0]}
        </div>
      )}
    </div>
  )
}