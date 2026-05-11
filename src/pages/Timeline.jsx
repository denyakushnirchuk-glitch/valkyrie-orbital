import { useMissions } from '../hooks/useMissions'
import { CAREER_PHASES, OUTCOMES } from '../lib/constants'
import PageHeader from '../components/PageHeader'
import styles from './Timeline.module.css'

export default function Timeline() {
  const { missions, loading } = useMissions()

  const grouped = CAREER_PHASES.reduce((acc, phase) => {
    const phaseMissions = missions.filter(m => m.phase === phase.value)
    if (phaseMissions.length) acc.push({ phase, missions: phaseMissions })
    return acc
  }, [])

  const outcomeColor = (o) =>
    OUTCOMES.find(x => x.value === o)?.color || 'var(--white-dim)'

  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <PageHeader eyebrow="Valkyrie Orbital" title="Campaign timeline" />

      {loading ? (
        <div className={styles.empty}>Loading timeline…</div>
      ) : missions.length === 0 ? (
        <div className={styles.empty}>The timeline will build as missions are logged.</div>
      ) : (
        <div className={styles.timeline}>
          {grouped.map(({ phase, missions: phaseMissions }) => (
            <div key={phase.value} className={styles.phaseBlock}>
              <div className={styles.phaseHeader}>
                <div className={styles.phaseName}>{phase.value}</div>
                <div className={styles.phaseDesc}>{phase.desc}</div>
                <div className={styles.phaseCount}>{phaseMissions.length} missions</div>
              </div>

              <div className={styles.entries}>
                {phaseMissions.map(m => (
                  <div key={m.id} className={styles.entry}>
                    <div className={styles.entryLeft}>
                      <div className={styles.entryDate}>{m.ingame_date || '—'}</div>
                      <div
                        className={styles.entryOutcome}
                        style={{ color: outcomeColor(m.outcome) }}
                      >
                        {m.outcome}
                      </div>
                    </div>
                    <div className={styles.entryRight}>
                      <div className={styles.entryDot} />
                      <div className={styles.entryContent}>
                        <div className={styles.entryName}>{m.name}</div>
                        {m.programs?.name && (
                          <div className={styles.entryProgram}>{m.programs.name}</div>
                        )}
                        {m.tags?.length > 0 && (
                          <div className={styles.entryTags}>
                            {m.tags.map(t => (
                              <span key={t} className={styles.tag}>{t}</span>
                            ))}
                          </div>
                        )}
                        {m.description && (
                          <p className={styles.entryDesc}>
                            {m.description.slice(0, 160)}{m.description.length > 160 ? '…' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}