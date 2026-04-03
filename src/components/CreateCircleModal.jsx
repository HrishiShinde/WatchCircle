import { useState } from 'react'
import { X, Users } from 'lucide-react'
import styles from './CreateCircleModal.module.css'

export default function CreateCircleModal({ onClose, onCreate }) {
  const [name,        setName]        = useState('')
  const [description, setDescription] = useState('')
  const [openInvites, setOpenInvites] = useState(false)
  const [loading,     setLoading]     = useState(false)

  const handleSubmit = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      await onCreate({ name: name.trim(), description: description.trim(), open_invites: openInvites })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Users size={18} className={styles.headerIcon} />
            <span>Create a Circle</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <div className={styles.field}>
            <label className={styles.label}>Circle Name <span>*</span></label>
            <input
              className={styles.input}
              placeholder="e.g. Movie Nights, Horror Club…"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={40}
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description <span className={styles.optional}>(optional)</span></label>
            <input
              className={styles.input}
              placeholder="What's this circle about?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={120}
            />
          </div>

          {/* Invite toggle */}
          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Open Invites</span>
              <span className={styles.toggleSub}>Any member can invite others, not just you</span>
            </div>
            <button
              className={`${styles.toggle} ${openInvites ? styles.toggleOn : ''}`}
              onClick={() => setOpenInvites(p => !p)}
              aria-label="Toggle open invites"
            >
              <span className={styles.toggleThumb} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            className={styles.createBtn}
            onClick={handleSubmit}
            disabled={!name.trim() || loading}
          >
            {loading ? 'Creating…' : 'Create Circle'}
          </button>
        </div>

      </div>
    </div>
  )
}