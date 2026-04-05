import { useState, useEffect, useRef, useCallback } from 'react'

const INITIAL_COUNT = 20
const BATCH_SIZE    = 10

/**
 * Client-side infinite scroll.
 * @param {Array}  items     — the full filtered array to paginate
 * @param {number} initial   — cards to show on first render
 * @param {number} batch     — cards to append each time sentinel is hit
 * @returns {{ visible, sentinelRef, reset }}
 */
export function useInfiniteScroll(items, initial = INITIAL_COUNT, batch = BATCH_SIZE) {
  const [count,       setCount]       = useState(initial)
  const sentinelRef                   = useRef(null)
  const observerRef                   = useRef(null)

  // When the source list changes (filter/search) reset the window
  useEffect(() => {
    setCount(initial)
  }, [items, initial])

  const loadMore = useCallback(() => {
    setCount(prev => Math.min(prev + batch, items.length))
  }, [batch, items.length])

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore() },
      { rootMargin: '200px' }   // start loading 200px before sentinel enters view
    )

    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current)

    return () => observerRef.current?.disconnect()
  }, [loadMore])

  const visible = items.slice(0, count)
  const hasMore = count < items.length

  return { visible, sentinelRef, hasMore }
}