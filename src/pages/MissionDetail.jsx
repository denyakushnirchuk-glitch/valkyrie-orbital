import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { OUTCOMES } from '../lib/constants'
import styles from './MissionDetail.module.css'

export default function MissionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [mission, setMission] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('missions')
      .select('*, programs(name), vehicles(name, type)')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setMission(data)
        setLoading(false)
      })
  }, [id])

  if (loading) return <div className={styles.loading}>Loading mission data…</div>
  if (!mission) return <div className={styles.loading}>Mission not found.</div>

  const outcomeColor = OUTCOMES.find(o => o.value === mission.outcome)?.color || 'var(--white-dim)'

  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <div className={styles.back} onClick={() => navigate(-1)}>← Back</div>

      <div className={styles.hero}>
        {mission.image_url && (
          <img src={mission.image_url} alt={mission.name} className={styles.heroImg} />
        )}
        <div className={styles.heroOverlay}>
          <p className={styles.program}>{mission.programs?.name}</p>
          <h1 className={styles.title}>{mission.name}</h1>
          <p className={styles.outcome} style={{ color: outcomeColor }}>
            {mission.outcome}
          </p>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.meta}>
          {[
            { label: 'In-game date',   value: mission.ingame_date },
            { label: 'Career phase',   value: mission.phase },
            { label: 'Vehicle',        value: mission.vehicles?.name },
            { label: 'Vehicle type',   value: mission.vehicles?.type },
          ].filter(r => r.value).map(({ label, value }) => (
            <div key={label} className={styles.metaRow}>
              <span className={styles.metaLabel}>{label}</span>
              <span className={styles.metaValue}>{value}</span>
            </div>
          ))}

          {mission.crew?.length > 0 && (
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Crew</span>
              <span className={styles.metaValue}>{mission.crew.join(', ')}</span>
            </div>
          )}
        </div>

        {mission.tags?.length > 0 && (
          <div className={styles.tags}>
            {mission.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}

        {mission.description && (
          <div className={styles.description}>
            <p className={styles.descLabel}>Mission report</p>
            <p className={styles.descText}>{mission.description}</p>
          </div>
        )}
      </div>
    </main>
  )
}