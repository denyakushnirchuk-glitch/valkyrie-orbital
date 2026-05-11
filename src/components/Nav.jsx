import { NavLink, useNavigate } from 'react-router-dom'
import styles from './Nav.module.css'

export default function Nav({ isAdmin, signOut }) {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={styles.logo}>
        <span>Valkyrie</span> Orbital
      </NavLink>

      <ul className={styles.links}>
        {[
          { to: '/',         label: 'Home'     },
          { to: '/missions', label: 'Missions' },
          { to: '/fleet',    label: 'Fleet'    },
          { to: '/timeline', label: 'Timeline' },
          { to: '/bio', label: 'Agency' },
        ].map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
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
        {isAdmin ? (
          <>
            <NavLink to="/admin" className={styles.adminBtn}>
              Admin
            </NavLink>
            <button className={styles.ghostBtn} onClick={handleSignOut}>
              Sign out
            </button>
          </>
        ) : (
          <NavLink to="/admin/login" className={styles.ghostBtn}>
            Sign in
          </NavLink>
        )}
      </div>
    </nav>
  )
}