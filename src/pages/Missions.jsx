import { useState } from 'react'
import { useMissions } from '../hooks/useMissions'
import { CAREER_PHASES, OUTCOMES, MISSION_TAGS } from '../lib/constants'
import MissionCard from '../components/MissionCard'
import PageHeader from '../components/PageHeader'
import styles from './Missions.module.css'

export default function Missions() {
  const [phase,   setPhase]   = useState('')
  const [outcome, setOutcome] = useState('')
  const [tag,     setTag]     = useState('')

  const { missions, loading } = useMissions({ phase, outcome, tag })

  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <PageHeader eyebrow="Mission archive" title="All missions" />

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Phase</span>
          <button
            className={!phase ? `${styles.chip} ${styles.active}` : styles.chip}
            onClick={() => setPhase('')}
          >All</button>
          {CAREER_PHASES.map(p => (
            <button
              key={p.value}
              className={phase === p.value ? `${styles.chip} ${styles.active}` : styles.chip}
              onClick={() => setPhase(phase === p.value ? '' : p.value)}
            >{p.label}</button>
          ))}
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Outcome</span>
          <button
            className={!outcome ? `${styles.chip} ${styles.active}` : styles.chip}
            onClick={() => setOutcome('')}
          >All</button>
          {OUTCOMES.map(o => (
            <button
              key={o.value}
              className={outcome === o.value ? `${styles.chip} ${styles.active}` : styles.chip}
              onClick={() => setOutcome(outcome === o.value ? '' : o.value)}
            >{o.label}</button>
          ))}
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Tag</span>
          <button
            className={!tag ? `${styles.chip} ${styles.active}` : styles.chip}
            onClick={() => setTag('')}
          >All</button>
          {MISSION_TAGS.map(t => (
            <button
              key={t}
              className={tag === t ? `${styles.chip} ${styles.active}` : styles.chip}
              onClick={() => setTag(tag === t ? '' : t)}
            >{t}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading archive…</div>
      ) : missions.length === 0 ? (
        <div className={styles.empty}>No missions match this filter</div>
      ) : (
        <div className={styles.grid}>
          {missions.map(m => <MissionCard key={m.id} mission={m} />)}
        </div>
      )}
    </main>
  )
}