import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AdminLogin.module.css'

export default function AdminLogin({ signIn }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) { setError(error.message); setLoading(false) }
    else navigate('/admin')
  }

  return (
    <main style={{ position: 'relative', zIndex: 1 }} className={styles.main}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <p className={styles.eyebrow}>Valkyrie Orbital</p>
        <h1 className={styles.title}>Admin access</h1>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.field}>
          <label>Email</label>
          <input
            type="email" value={email} autoComplete="email"
            onChange={e => setEmail(e.target.value)} required
          />
        </div>

        <div className={styles.field}>
          <label>Password</label>
          <input
            type="password" value={password} autoComplete="current-password"
            onChange={e => setPassword(e.target.value)} required
          />
        </div>

        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? 'Authenticating…' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}