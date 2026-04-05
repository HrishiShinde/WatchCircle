import styles from './MovieCardSkeleton.module.css'

export default function MovieCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.poster} />
      <div className={styles.info}>
        <div className={styles.title} />
        <div className={styles.meta}>
          <div className={styles.genre} />
          <div className={styles.rating} />
        </div>
      </div>
    </div>
  )
}