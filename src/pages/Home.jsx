import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import MissionCard from '../components/MissionCard'
import styles from './Home.module.css'

export default function Home() {
  const [stats, setStats]     = useState({ total: 0, success: 0, crew: 0, vehicles: 0 })
  const [recent, setRecent]   = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const [{ data: missions }, { data: vehicles }] = await Promise.all([
        supabase.from('missions').select('outcome, crew'),
        supabase.from('vehicles').select('id'),
      ])

      const total    = missions?.length || 0
      const successes = missions?.filter(m => m.outcome === 'success').length || 0
      const crew     = missions?.reduce((s, m) => s + (m.crew?.length || 0), 0) || 0

      setStats({
        total,
        success: total ? Math.round(successes / total * 100) + '%' : '—',
        crew,
        vehicles: vehicles?.length || 0,
      })

      const { data: latest } = await supabase
        .from('missions')
        .select('*, programs(name), vehicles(name)')
        .order('created_at', { ascending: false })
        .limit(4)

      setRecent(latest || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <main className={styles.main} style={{ position: 'relative', zIndex: 1 }}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Kerbin Aerospace — Active Campaign</p>
        <h1 className={styles.title}>
          Valkyrie
          <span>Orbital</span>
        </h1>
        <p className={styles.doctrine}>"Precision over spectacle."</p>
        <p className={styles.desc}>
          An elite aerospace organization built on elegant, efficient, reusable systems.
          Every mission logged here is part of a living chronicle — the real history
          of a spacefaring civilization in the making.
        </p>

        <div className={styles.stats}>
          {[
            { num: stats.total,    label: 'Missions logged' },
            { num: stats.success,  label: 'Success rate'    },
            { num: stats.crew,     label: 'Crew returned'   },
            { num: stats.vehicles, label: 'Vehicles'        },
          ].map(({ num, label }) => (
            <div key={label} className={styles.stat}>
              <div className={styles.statNum}>{loading ? '—' : num}</div>
              <div className={styles.statLabel}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {recent.length > 0 && (
        <section className={styles.recent}>
          <div className={styles.sectionTag}>Recent missions</div>
          <div className={styles.grid}>
            {recent.map(m => <MissionCard key={m.id} mission={m} />)}
          </div>
          <button className={styles.allBtn} onClick={() => navigate('/missions')}>
            View full archive →
          </button>
        </section>
      )}
    </main>
  )
}