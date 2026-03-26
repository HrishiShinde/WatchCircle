import { Search, Plus, Sparkles, Star } from 'lucide-react'
import styles from './Toolbar.module.css'

const WATCH_FILTERS = [
  { key: 'all',       label: 'All'       },
  { key: 'unwatched', label: 'Unwatched' },
  { key: 'watched',   label: 'Watched'   },
]

const RATING_FILTERS = [
  { key: null,  label: 'Any rating' },
  { key: '9',   label: '9+' },
  { key: '7',   label: '7+' },
  { key: '5',   label: '5+' },
]

export default function Toolbar({
  filter, onFilter,
  ratingFilter, onRatingFilter,
  search, onSearch,
  onRandom, onAdd
}) {
  return (
    <div className={styles.wrap}>
      {/* Search */}
      <div className={styles.searchWrap}>
        <Search size={14} className={styles.searchIcon} />
        <input
          className={styles.input}
          placeholder="Search by title or genre…"
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
      </div>

      {/* Watch status filters */}
      <div className={styles.filters}>
        {WATCH_FILTERS.map(f => (
          <button
            key={f.key}
            className={`${styles.fBtn} ${filter === f.key ? styles.active : ''}`}
            onClick={() => onFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Rating filters */}
      <div className={styles.filters}>
        {RATING_FILTERS.map(f => (
          <button
            key={f.key ?? 'any'}
            className={`${styles.fBtn} ${ratingFilter === f.key ? styles.activeRating : ''}`}
            onClick={() => onRatingFilter(f.key)}
          >
            {f.key ? <><Star size={10} className={styles.starIcon} />{f.label}</> : f.label}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.circlePicksBtn} onClick={onRandom} title="CirclePicks">
          <Sparkles size={13} />
          CirclePicks
        </button>
        <button className={styles.addBtn} onClick={onAdd} title="Add movie">
          <Plus size={14} />
          Add movie
        </button>
      </div>
    </div>
  )
}