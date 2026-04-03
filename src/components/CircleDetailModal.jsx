import { useState, useEffect } from 'react'
import {
  X, Settings, Users, Link, Copy, Check,
  Crown, UserMinus, LogOut, Trash2, RefreshCw, ChevronRight
} from 'lucide-react'
import styles from './CircleDetailModal.module.css'

const TABS = ['Members', 'Invite', 'Settings']

export default function CircleDetailModal({
  circle,
  currentUserId,
  onClose,
  onUpdate,
  onDelete,
  onLeave,
  onPromote,
  onRemoveMember,
  onGenerateCode,
  onFetchCodes,
  getMembers,
}) {
  const [tab,          setTab]          = useState('Members')
  const [members,      setMembers]      = useState([])
  const [codes,        setCodes]        = useState([])
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [loadingCodes,   setLoadingCodes]   = useState(false)
  const [copied,       setCopied]       = useState(null)   // code that was just copied
  const [generating,   setGenerating]   = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Edit settings state
  const [editName,        setEditName]        = useState(circle.name)
  const [editDescription, setEditDescription] = useState(circle.description || '')
  const [editOpenInvites, setEditOpenInvites] = useState(circle.open_invites)
  const [saving,          setSaving]          = useState(false)

  const isMod = circle.role === 'moderator'
  const baseUrl = window.location.origin

  // ── Load members on mount ──────────────────────────────────────────────────
  useEffect(() => {
    setLoadingMembers(true)
    getMembers(circle.id)
      .then(setMembers)
      .finally(() => setLoadingMembers(false))
  }, [circle.id])

  // ── Load codes when Invite tab opens ──────────────────────────────────────
  useEffect(() => {
    if (tab !== 'Invite') return
    setLoadingCodes(true)
    onFetchCodes(circle.id)
      .then(setCodes)
      .finally(() => setLoadingCodes(false))
  }, [tab, circle.id])

  // ── Copy to clipboard ──────────────────────────────────────────────────────
  const copyToClipboard = async (text, key) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  // ── Generate new code ──────────────────────────────────────────────────────
  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const code = await onGenerateCode(circle.id)
      setCodes(prev => [{ id: Date.now(), code, created_at: new Date().toISOString(), used_by: null }, ...prev])
    } finally {
      setGenerating(false)
    }
  }

  // ── Save settings ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!editName.trim()) return
    setSaving(true)
    try {
      await onUpdate(circle.id, {
        name: editName,
        description: editDescription,
        open_invites: editOpenInvites,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  // ── Member action handlers ─────────────────────────────────────────────────
  const handlePromote = async (userId) => {
    await onPromote(circle.id, userId)
    setMembers(prev => prev.map(m => m.user_id === userId ? { ...m, role: 'moderator' } : m))
  }

  const handleRemove = async (userId) => {
    await onRemoveMember(circle.id, userId)
    setMembers(prev => prev.filter(m => m.user_id !== userId))
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.circleIcon}>
              {circle.name.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className={styles.circleName}>{circle.name}</div>
              <div className={styles.circleMeta}>
                {members.length > 0 && `${members.length} member${members.length !== 1 ? 's' : ''}`}
                {circle.open_invites && <span className={styles.openBadge}>Open Invites</span>}
              </div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className={styles.tabs}>
          {TABS.map(t => (
            // Hide Settings tab for non-mods
            (t === 'Settings' && !isMod) ? null : (
              <button
                key={t}
                className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
                onClick={() => setTab(t)}
              >
                {t === 'Members'  && <Users    size={13} />}
                {t === 'Invite'   && <Link     size={13} />}
                {t === 'Settings' && <Settings size={13} />}
                {t}
              </button>
            )
          ))}
        </div>

        {/* ── Tab Content ── */}
        <div className={styles.body}>

          {/* Members tab */}
          {tab === 'Members' && (
            <div className={styles.membersList}>
              {loadingMembers ? (
                <div className={styles.tabLoading}>Loading members…</div>
              ) : members.length === 0 ? (
                <div className={styles.tabEmpty}>No members yet.</div>
              ) : (
                members.map(member => (
                  <div key={member.user_id} className={styles.memberRow}>
                    <div className={styles.memberAvatar}>{member.initials}</div>
                    <div className={styles.memberInfo}>
                      <span className={styles.memberName}>
                        {member.display_name}
                        {member.user_id === currentUserId && <span className={styles.youBadge}>you</span>}
                      </span>
                      {member.role === 'moderator' && (
                        <span className={styles.modBadge}><Crown size={10} /> MOD</span>
                      )}
                    </div>
                    {/* Mod actions — can't act on yourself */}
                    {isMod && member.user_id !== currentUserId && (
                      <div className={styles.memberActions}>
                        {member.role !== 'moderator' && (
                          <button
                            className={styles.memberActionBtn}
                            onClick={() => handlePromote(member.user_id)}
                            title="Promote to moderator"
                          >
                            <Crown size={13} />
                          </button>
                        )}
                        <button
                          className={`${styles.memberActionBtn} ${styles.memberActionDanger}`}
                          onClick={() => handleRemove(member.user_id)}
                          title="Remove from circle"
                        >
                          <UserMinus size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Invite tab */}
          {tab === 'Invite' && (
            <div className={styles.inviteTab}>
              <p className={styles.inviteHint}>
                Share an invite link with friends. Each code can only be used once.
              </p>

              {/* Generate button — mod always, member only if open_invites */}
              {(isMod || circle.open_invites) && (
                <button
                  className={styles.generateBtn}
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  <RefreshCw size={14} className={generating ? styles.spinning : ''} />
                  {generating ? 'Generating…' : 'Generate New Code'}
                </button>
              )}

              {/* Codes list */}
              {loadingCodes ? (
                <div className={styles.tabLoading}>Loading codes…</div>
              ) : codes.length === 0 ? (
                <div className={styles.tabEmpty}>No invite codes yet.</div>
              ) : (
                <div className={styles.codesList}>
                  {codes.map(invite => {
                    const link = `${baseUrl}/join?code=${invite.code}`
                    return (
                      <div key={invite.id} className={styles.codeRow}>
                        <div className={styles.codeInfo}>
                          <span className={styles.codeValue}>{invite.code}</span>
                          <span className={styles.codeDate}>
                            {new Date(invite.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className={styles.codeActions}>
                          {/* Copy code */}
                          <button
                            className={styles.copyBtn}
                            onClick={() => copyToClipboard(invite.code, `code-${invite.id}`)}
                            title="Copy code"
                          >
                            {copied === `code-${invite.id}` ? <Check size={13} /> : <Copy size={13} />}
                            {copied === `code-${invite.id}` ? 'Copied!' : 'Code'}
                          </button>
                          {/* Copy link */}
                          <button
                            className={styles.copyBtn}
                            onClick={() => copyToClipboard(link, `link-${invite.id}`)}
                            title="Copy invite link"
                          >
                            {copied === `link-${invite.id}` ? <Check size={13} /> : <Link size={13} />}
                            {copied === `link-${invite.id}` ? 'Copied!' : 'Link'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Settings tab (mod only) */}
          {tab === 'Settings' && isMod && (
            <div className={styles.settingsTab}>
              <div className={styles.field}>
                <label className={styles.label}>Circle Name <span>*</span></label>
                <input
                  className={styles.input}
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  maxLength={40}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Description <span className={styles.optional}>(optional)</span>
                </label>
                <input
                  className={styles.input}
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  maxLength={120}
                  placeholder="What's this circle about?"
                />
              </div>

              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>Open Invites</span>
                  <span className={styles.toggleSub}>Any member can generate invite codes</span>
                </div>
                <button
                  className={`${styles.toggle} ${editOpenInvites ? styles.toggleOn : ''}`}
                  onClick={() => setEditOpenInvites(p => !p)}
                >
                  <span className={styles.toggleThumb} />
                </button>
              </div>

              <button
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={!editName.trim() || saving}
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>

              {/* Danger zone */}
              <div className={styles.dangerZone}>
                <div className={styles.dangerTitle}>Danger Zone</div>
                {!confirmDelete ? (
                  <button
                    className={styles.dangerBtn}
                    onClick={() => setConfirmDelete(true)}
                  >
                    <Trash2 size={14} />
                    Delete Circle
                  </button>
                ) : (
                  <div className={styles.confirmDelete}>
                    <p>This will permanently delete <strong>{circle.name}</strong> and remove all members. Are you sure?</p>
                    <div className={styles.confirmActions}>
                      <button className={styles.cancelConfirm} onClick={() => setConfirmDelete(false)}>
                        Cancel
                      </button>
                      <button
                        className={styles.confirmDeleteBtn}
                        onClick={() => { onDelete(circle.id); onClose() }}
                      >
                        Yes, Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* ── Footer — Leave circle (non-mod members only) ── */}
        {!isMod && (
          <div className={styles.footer}>
            <button className={styles.leaveBtn} onClick={() => { onLeave(circle.id); onClose() }}>
              <LogOut size={14} />
              Leave Circle
            </button>
          </div>
        )}

      </div>
    </div>
  )
}