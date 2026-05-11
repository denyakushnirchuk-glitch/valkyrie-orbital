import { useNavigate } from 'react-router-dom'
import styles from './MissionCard.module.css'

export default function MissionCard({ mission }) {
  const navigate = useNavigate()

  const outcomeColor = {
    success: 'var(--outcome-success)',
    partial: 'var(--outcome-partial)',
    rescue:  'var(--outcome-rescue)',
    failed:  'var(--outcome-failed)',
  }[mission.outcome] || 'var(--white-dim)'

  return (
    <article
      className={styles.card}
      onClick={() => navigate(`/missions/${mission.id}`)}
    >
      <div className={styles.image}>
        {mission.image_url
          ? <img src={mission.image_url} alt={mission.name} />
          : <div className={styles.imagePlaceholder}>No image</div>
        }
      </div>

      <div className={styles.body}>
        <div className={styles.outcome} style={{ color: outcomeColor }}>
          {mission.outcome}
        </div>

        <h3 className={styles.name}>{mission.name}</h3>

        <div className={styles.meta}>
          {mission.programs?.name && (
            <span className={styles.program}>{mission.programs.name}</span>
          )}
          {mission.ingame_date && (
            <span className={styles.date}>{mission.ingame_date}</span>
          )}
        </div>

        {mission.tags?.length > 0 && (
          <div className={styles.tags}>
            {mission.tags.slice(0, 4).map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
            {mission.tags.length > 4 && (
              <span className={styles.tagMore}>+{mission.tags.length - 4}</span>
            )}
          </div>
        )}

        {mission.description && (
          <p className={styles.desc}>
            {mission.description.slice(0, 110)}
            {mission.description.length > 110 ? '…' : ''}
          </p>
        )}
      </div>
    </article>
  )
}