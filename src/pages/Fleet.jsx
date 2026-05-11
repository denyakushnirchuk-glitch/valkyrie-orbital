import { useVehicles } from '../hooks/useVehicles'
import { useMissions } from '../hooks/useMissions'
import { VEHICLE_STATUSES } from '../lib/constants'
import PageHeader from '../components/PageHeader'
import styles from './Fleet.module.css'

export default function Fleet({ agency = 'valkyrie' }) {
  const { vehicles, loading } = useVehicles(agency)
  const { missions } = useMissions()

  const missionCount = (name) =>
    missions.filter(m => m.vehicles?.name === name).length

  const statusColor = (s) =>
    VEHICLE_STATUSES.find(v => v.value === s)?.color || 'var(--white-dim)'

  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <PageHeader eyebrow="Valkyrie Orbital" title="Fleet registry" />

      {loading ? (
        <div className={styles.empty}>Loading fleet…</div>
      ) : vehicles.length === 0 ? (
        <div className={styles.empty}>No vehicles registered yet.</div>
      ) : (
        <div className={styles.grid}>
          {vehicles.map(v => (
            <article key={v.id} className={styles.card}>
              <div className={styles.image}>
                {v.image_url
                  ? <img src={v.image_url} alt={v.name} />
                  : <div className={styles.placeholder}>{v.type}</div>
                }
              </div>
              <div className={styles.body}>
                <div className={styles.type}>{v.type}</div>
                <div className={styles.name}>{v.name}</div>
                <div
                  className={styles.status}
                  style={{ color: statusColor(v.status), borderColor: statusColor(v.status) + '55' }}
                >
                  {v.status}
                </div>
                <div className={styles.missions}>
                  {missionCount(v.name)} mission{missionCount(v.name) !== 1 ? 's' : ''}
                </div>
                {v.description && (
                  <p className={styles.desc}>
                    {v.description.slice(0, 120)}{v.description.length > 120 ? '…' : ''}
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