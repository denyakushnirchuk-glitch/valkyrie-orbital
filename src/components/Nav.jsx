import { NavLink, useNavigate } from 'react-router-dom'
import styles from './Nav.module.css'

export default function Nav({ isAdmin, signOut, base = '', agency = 'valkyrie' }) {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className={styles.nav}>
      <NavLink to={base} className={styles.logo} end>
        {agency === 'valkyrie'
          ? <><span>Valkyrie</span> Orbital</>
          : <><span>Brown</span> Aerospace</>
        }
      </NavLink>

      <ul className={styles.links}>
        {[
          { to: `${base}`,          label: 'Home',     end: true },
          { to: `${base}/missions`, label: 'Missions'  },
          { to: `${base}/fleet`,    label: 'Fleet'     },
          { to: `${base}/timeline`, label: 'Timeline'  },
          { to: `${base}/bio`,      label: 'Agency'    },
          { to: `${base}/crew`, label: 'Crew' },
        ].map(({ to, label, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className={styles.right}>
        <button className={styles.ghostBtn} onClick={() => navigate('/')}>
          ← All agencies
        </button>
        {isAdmin ? (
          <>
            <NavLink to={`${base}/admin`} className={styles.adminBtn}>Admin</NavLink>
            <button className={styles.ghostBtn} onClick={handleSignOut}>Sign out</button>
          </>
        ) : (
          <NavLink to={`${base}/admin/login`} className={styles.ghostBtn}>Sign in</NavLink>
        )}
      </div>
    </nav>
  )
}