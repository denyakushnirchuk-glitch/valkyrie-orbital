import { useCrew } from '../hooks/useCrew'
import { useMissions } from '../hooks/useMissions'
import PageHeader from '../components/PageHeader'
import styles from './Crew.module.css'

const ROLE_COLORS = {
  Pilot:     '#7a9ec9',
  Engineer:  '#c9a84c',
  Scientist: '#3a9e6a',
  Tourist:   '#9e7ac9',
}

const STATUS_COLORS = {
  active:  '#3a9e6a',
  retired: '#8a8a9a',
  lost:    '#9e3a3a',
}

function StarRating({ rating = 0 }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className={i <= rating ? styles.starFilled : styles.starEmpty}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function Crew({ agency = 'valkyrie' }) {
  const { crew, loading } = useCrew(agency)
  const { missions } = useMissions({ agency })

  const missionCount = (name) =>
    missions.filter(m => m.crew?.includes(name)).length

  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <PageHeader eyebrow="Valkyrie Orbital" title="Crew roster" />

      {loading ? (
        <div className={styles.empty}>Loading crew roster…</div>
      ) : crew.length === 0 ? (
        <div className={styles.empty}>No crew members registered yet.</div>
      ) : (
        <div className={styles.grid}>
          {crew.map(member => (
            <article key={member.id} className={styles.card}>
              <div className={styles.imageWrap}>
                {member.image_url
                  ? <img src={member.image_url} alt={member.name} className={styles.image} />
                  : (
                    <div className={styles.imagePlaceholder}>
                      <span>{member.name.charAt(0)}</span>
                    </div>
                  )
                }
                <div
                  className={styles.statusDot}
                  style={{ background: STATUS_COLORS[member.status] || '#8a8a9a' }}
                  title={member.status}
                />
              </div>

              <div className={styles.body}>
                <div
                  className={styles.role}
                  style={{ color: ROLE_COLORS[member.role] || 'var(--white-dim)' }}
                >
                  {member.role}
                </div>
                <div className={styles.name}>{member.name}</div>

                <StarRating rating={member.rating} />

                <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <div className={styles.statNum}>{missionCount(member.name)}</div>
                    <div className={styles.statLabel}>Missions</div>
                  </div>
                  <div className={styles.statItem}>
                    <div
                      className={styles.statNum}
                      style={{ color: STATUS_COLORS[member.status] }}
                    >
                      {member.status}
                    </div>
                    <div className={styles.statLabel}>Status</div>
                  </div>
                </div>

                {member.bio && (
                  <p className={styles.bio}>
                    {member.bio.slice(0, 120)}{member.bio.length > 120 ? '…' : ''}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}