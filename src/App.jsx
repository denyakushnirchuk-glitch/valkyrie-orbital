import { Routes, Route } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

import Nav from './components/Nav'
import StarField from './components/StarField'
import Home from './pages/Home'
import Missions from './pages/Missions'
import MissionDetail from './pages/MissionDetail'
import Fleet from './pages/Fleet'
import Timeline from './pages/Timeline'
import AdminLogin from './pages/AdminLogin'
import AdminPanel from './pages/AdminPanel'
import Bio from './pages/Bio'

export default function App() {
  const { user, loading, isAdmin, signIn, signOut } = useAuth()

  if (loading) return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'DM Mono, monospace',
      fontSize: '11px',
      letterSpacing: '0.2em',
      color: 'var(--gold)',
      textTransform: 'uppercase',
      background: 'var(--black)',
    }}>
      Initialising systems…
    </div>
  )

  return (
    <>
      <StarField />
      <Nav isAdmin={isAdmin} signOut={signOut} />
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/missions"      element={<Missions />} />
        <Route path="/missions/:id"  element={<MissionDetail />} />
        <Route path="/fleet"         element={<Fleet />} />
        <Route path="/timeline"      element={<Timeline />} />
        <Route path="/admin/login"   element={<AdminLogin signIn={signIn} />} />
        <Route path="/admin"         element={
          isAdmin ? <AdminPanel /> : <AdminLogin signIn={signIn} />
        } />
        <Route path="/bio" element={<Bio />} />
      </Routes>
    </>
  )
}