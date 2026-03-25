import { useState, useEffect, useRef } from 'react'
import { X, Search, Loader } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { searchTMDB, TMDB_IMG } from '../lib/supabase'
import GenreSelect    from './GenreSelect'
import PlatformSelect from './PlatformSelect'
import styles from './AddMovieModal.module.css'

export default function EditMovieModal({ movie, onClose, onSave }) {
  const posterMode   = movie._posterMode || false
  const [title,      setTitle]      = useState(movie.title || '')
  const [genres,     setGenres]     = useState([])
  const [platform,   setPlatform]   = useState(null)
  const [watchLink,  setWatchLink]  = useState(movie.watch_link || '')
  const [posterPath, setPosterPath] = useState(movie.poster_path || '')
  const [posterSearch, setPosterSearch] = useState('')
  const [posterResults, setPosterResults] = useState([])
  const [searchingPosters, setSearchingPosters] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [dbGenres,   setDbGenres]   = useState([])
  const debounceRef  = useRef(null)
  const posterRef    = useRef(null)

  useEffect(() => {
    const load = async () => {
      const [{ data: gData }, { data: pData }] = await Promise.all([
        supabase.from('genres').select('*').order('name'),
        supabase.from('platforms').select('*').order('id'),
      ])
      if (gData) {
        setDbGenres(gData)
        if (movie.genres?.length) {
          const ids = movie.genres
            .map(name => gData.find(g => g.name === name)?.id)
            .filter(Boolean)
          setGenres(ids)
        }
      }
      if (pData) {
        const pName = movie.platform || movie.where_to_watch
        if (pName) {
          const match = pData.find(p => p.name === pName)
          if (match) setPlatform(match.id)
        }
      }
    }
    load()
  }, [movie])

  // Scroll to poster section if opened via "Change poster"
  useEffect(() => {
    if (posterMode && posterRef.current) {
      setTimeout(() => posterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
    }
  }, [posterMode])

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // Debounced poster TMDB search
  useEffect(() => {
    if (!posterSearch.trim()) { setPosterResults([]); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearchingPosters(true)
      const res = await searchTMDB(posterSearch)
      setPosterResults(res.filter(r => r.poster_path))
      setSearchingPosters(false)
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [posterSearch])

  const handleSave = async () => {
    if (!title.trim()) return
    setSubmitting(true)
    try {
      await onSave(movie.id, {
        title:        title.trim(),
        poster_path:  posterPath || null,
        release_year: movie.release_year || null,
        duration:     movie.duration || null,
        genre_ids:    genres,
        platform_id:  platform,
        watch_link:   watchLink.trim() || null,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.backdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}><X size={16} /></button>

        <h3 className={styles.title}>Edit <span>movie</span></h3>

        {!posterMode && (
          <input
            className={styles.input}
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
        )}

        {/* ── Poster section ── */}
        <div ref={posterRef} className={styles.fieldGap}>
          <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>Movie poster</p>

          {/* Current poster preview */}
          {posterPath && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <img
                src={`https://image.tmdb.org/t/p/w92${posterPath}`}
                alt="Current poster"
                style={{ width: 46, height: 69, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }}
                onError={e => { e.target.style.display = 'none' }}
              />
              <div>
                <p style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>Current poster</p>
                <button
                  style={{ fontSize: 11, color: 'var(--accent2)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() => setPosterPath('')}
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* TMDB poster search */}
          <div className={styles.searchWrap}>
            <Search size={13} className={styles.searchIcon} />
            <input
              className={styles.input}
              placeholder="Search for a new poster on TMDB…"
              value={posterSearch}
              onChange={e => setPosterSearch(e.target.value)}
              autoFocus={posterMode}
            />
            {searchingPosters && <Loader size={13} className={styles.spinner} />}
          </div>

          {posterResults.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              {posterResults.map(r => (
                <div
                  key={r.id}
                  onClick={() => { setPosterPath(r.poster_path); setPosterResults([]); setPosterSearch('') }}
                  style={{
                    cursor: 'pointer',
                    border: posterPath === r.poster_path ? '2px solid var(--accent)' : '2px solid transparent',
                    borderRadius: 6, overflow: 'hidden', transition: 'border-color 0.2s',
                  }}
                  title={r.title}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w92${r.poster_path}`}
                    alt={r.title}
                    style={{ width: 52, height: 78, objectFit: 'cover', display: 'block' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {!posterMode && (
          <>
            <div className={styles.fieldGap}>
              <GenreSelect selected={genres} onChange={setGenres} max={3} dbGenres={dbGenres} useIds={true} />
            </div>

            <div className={`${styles.fieldGap} ${styles.platformRow}`}>
              <div className={styles.platformCol}>
                <PlatformSelect selected={platform} onChange={setPlatform} useIds={true} />
              </div>
              <div className={styles.linkCol}>
                <input
                  className={styles.input}
                  placeholder="Watch link (optional)"
                  value={watchLink}
                  onChange={e => setWatchLink(e.target.value)}
                  type="url"
                  style={{ paddingLeft: '12px' }}
                />
              </div>
            </div>
          </>
        )}

        <button
          className={styles.submitBtn}
          onClick={handleSave}
          disabled={(!title.trim() && !posterMode) || submitting}
        >
          {submitting ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}