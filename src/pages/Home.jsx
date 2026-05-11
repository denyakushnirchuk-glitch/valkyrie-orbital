import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { AGENCIES } from '../lib/constants'
import MissionCard from '../components/MissionCard'
import styles from './Home.module.css'

const AGENCY_CONTENT = {
  valkyrie: {
    eyebrow:  'Kerbin Aerospace — Active Campaign',
    title:    'Valkyrie',
    subtitle: 'Orbital',
    doctrine: '"Precision over spectacle."',
    desc:     'An elite aerospace organization built on elegant, efficient, reusable systems. Every mission logged here is part of a living chronicle — the real history of a spacefaring civilization in the making.',
  },
  bai: {
    eyebrow:  'Kerbin Aerospace — Active Campaign',
    title:    'Brown Aerospace',
    subtitle: 'Initiative',
    doctrine: '"Technological Infrastructure, Crewed Execution."',
    desc:     'An up-and-coming program aimed at expanding Kerbals into the stars through meticulous planning, scientific permanence, and infrastructure-first thinking. The chronicle of a civilization built to last.',
  },
}

export default function Home({ agency = 'valkyrie' }) {
  const [stats,   setStats]   = useState({ total: 0, success: '—', crew: 0, vehicles: 0 })
  const [recent,  setRecent]  = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const base = agency === 'valkyrie' ? '/valkyrie' : '/brown-aerospace'
  const content = AGENCY_CONTENT[agency]

  useEffect(() => {
    async function load() {
      const [{ data: missions }, { data: vehicles }] = await Promise.all([
        supabase.from('missions').select('outcome, crew').eq('agency', agency),
        supabase.from('vehicles').select('id').eq('agency', agency),
      ])

      const total     = missions?.length || 0
      const successes = missions?.filter(m => m.outcome === 'success').length || 0
      const crew      = missions?.reduce((s, m) => s + (m.crew?.length || 0), 0) || 0

      setStats({
        total,
        success:  total ? Math.round(successes / total * 100) + '%' : '—',
        crew,
        vehicles: vehicles?.length || 0,
      })

      const { data: latest } = await supabase
        .from('missions')
        .select('*, programs(name), vehicles(name)')
        .eq('agency', agency)
        .order('created_at', { ascending: false })
        .limit(4)

      setRecent(latest || [])
      setLoading(false)
    }
    load()
  }, [agency])

  return (
    <main className={styles.main} style={{ position: 'relative', zIndex: 1 }}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h1 className={styles.title}>
          {content.title}
          <span>{content.subtitle}</span>
        </h1>
        <p className={styles.doctrine}>{content.doctrine}</p>
        <p className={styles.desc}>{content.desc}</p>

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
            {recent.map(m => <MissionCard key={m.id} mission={m} base={base} />)}
          </div>
          <button className={styles.allBtn} onClick={() => navigate(`${base}/missions`)}>
            View full archive →
          </button>
        </section>
      )}

      {recent.length === 0 && !loading && (
        <section className={styles.recent}>
          <div className={styles.sectionTag}>Chronicle</div>
          <div className={styles.empty}>
            No missions logged yet — the chronicle begins with the first launch.
          </div>
        </section>
      )}
    </main>
  )
}