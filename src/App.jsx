import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from './hooks/useAuth'

import Nav           from './components/Nav'
import StarField     from './components/StarField'
import Landing       from './pages/Landing'
import Home          from './pages/Home'
import Missions      from './pages/Missions'
import MissionDetail from './pages/MissionDetail'
import Fleet         from './pages/Fleet'
import Timeline      from './pages/Timeline'
import Bio           from './pages/Bio'
import AdminLogin    from './pages/AdminLogin'
import AdminPanel    from './pages/AdminPanel'
import Crew from './pages/Crew'

function AgencyWrapper({ agency, children }) {
  useEffect(() => {
    document.body.setAttribute('data-agency', agency)
    return () => document.body.removeAttribute('data-agency')
  }, [agency])
  return children
}

export default function App() {
  const { loading, isAdmin, adminAgency, signIn, signOut } = useAuth()

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', fontFamily: 'DM Mono, monospace', fontSize: '11px',
      letterSpacing: '0.2em', color: '#c9a84c', textTransform: 'uppercase',
      background: '#0a0a0c',
    }}>
      Initialising systems…
    </div>
  )

  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={<Landing />} />

      {/* Valkyrie */}
      <Route path="/valkyrie" element={
        <AgencyWrapper agency="valkyrie">
          <StarField />
          <Nav isAdmin={isAdmin} signOut={signOut} base="/valkyrie" agency="valkyrie" />
          <Home agency="valkyrie" />
        </AgencyWrapper>
      } />
      <Route path="/valkyrie/missions" element={
        <AgencyWrapper agency="valkyrie">
          <StarField />
          <Nav isAdmin={isAdmin} signOut={signOut} base="/valkyrie" agency="valkyrie" />
          <Missions agency="valkyrie" />
        </AgencyWrapper>
      } />
      <Route path="/valkyrie/missions/:id" element={
        <AgencyWrapper agency="valkyrie">
          <StarField />
          <Nav isAdmin={isAdmin} signOut={signOut} base="/valkyrie" agency="valkyrie" />
          <MissionDetail />
        </AgencyWrapper>
      } />
      <Route path="/valkyrie/fleet" element={
        <AgencyWrapper agency="valkyrie">
          <StarField />
          <Nav isAdmin={isAdmin} signOut={signOut} base="/valkyrie" agency="valkyrie" />
          <Fleet agency="valkyrie" />
        </AgencyWrapper>
      } />
      <Route path="/valkyrie/timeline" element={
        <AgencyWrapper agency="valkyrie">
          <StarField />
          <Nav isAdmin={isAdmin} signOut={signOut} base="/valkyrie" agency="valkyrie" />
          <Timeline agency="valkyrie" />
        </AgencyWrapper>
      } />
      <Route path="/valkyrie/bio" element={
        <AgencyWrapper agency="valkyrie">
          <StarField />
          <Nav isAdmin={isAdmin} signOut={signOut} base="/valkyrie" agency="valkyrie" />
          <Bio agency="valkyrie" />
        </AgencyWrapper>
      } />
      <Route path="/valkyrie/admin/login" element={
        <AgencyWrapper agency="valkyrie">
          <StarField />
          <Nav isAdmin={isAdmin} signOut={signOut} base="/valkyrie" agency="valkyrie" />
          <AdminLogin signIn={signIn} />
        </AgencyWrapper>
      } />
      <Route path="/valkyrie/admin" element={
        <AgencyWrapper agency="valkyrie">
          <StarField />
          <Nav isAdmin={isAdmin && adminAgency === 'valkyrie'} signOut={signOut} base="/valkyrie" agency="valkyrie" />
          {isAdmin && adminAgency === 'valkyrie'
            ? <AdminPanel agency="valkyrie" />
            : <AdminLogin signIn={signIn} />
          }
        </AgencyWrapper>
      } />
      <Route path="/valkyrie/crew" element={
        <AgencyWrapper agency="valkyrie">
          <StarField />
          <Nav isAdmin={isAdmin && adminAgency === 'valkyrie'} signOut={signOut} base="/valkyrie" agency="valkyrie" />
          <Crew agency="valkyrie" />
        </AgencyWrapper>
      } />

      {/* Brown Aerospace */}
      <Route path="/brown-aerospace" element={
        <AgencyWrapper agency="bai">
          <StarField />
          <Nav isAdmin={isAdmin} signOut={signOut} base="/brown-aerospace" agency="bai" />
          <Home agency="bai" />
        </AgencyWrapper>
      } />
      <Route path="/brown-aerospace/missions" element={
        <AgencyWrapper agency="bai">
          <StarField />
          <Nav isAdmin={isAdmin} signOut={signOut} base="/brown-aerospace" agency="bai" />
          <Missions agency="bai" />
        </AgencyWrapper>
      } />
      <Route path="/brown-aerospace/missions/:id" element={
        <AgencyWrapper agency="bai">
          <StarField />
          <Nav isAdmin={isAdmin} signOut={signOut} base="/brown-aerospace" agency="bai" />
          <MissionDetail />
        </AgencyWrapper>
      } />
      <Route path="/brown-aerospace/fleet" element={
        <AgencyWrapper agency="bai">
          <StarField />
          <Nav isAdmin={isAdmin} signOut={signOut} base="/brown-aerospace" agency="bai" />
          <Fleet agency="bai" />
        </AgencyWrapper>
      } />
      <Route path="/brown-aerospace/timeline" element={
        <AgencyWrapper agency="bai">
          <StarField />
          <Nav isAdmin={isAdmin} signOut={signOut} base="/brown-aerospace" agency="bai" />
          <Timeline agency="bai" />
        </AgencyWrapper>
      } />
      <Route path="/brown-aerospace/bio" element={
        <AgencyWrapper agency="bai">
          <StarField />
          <Nav isAdmin={isAdmin} signOut={signOut} base="/brown-aerospace" agency="bai" />
          <Bio agency="bai" />
        </AgencyWrapper>
      } />
      <Route path="/brown-aerospace/admin/login" element={
        <AgencyWrapper agency="bai">
          <StarField />
          <Nav isAdmin={isAdmin} signOut={signOut} base="/brown-aerospace" agency="bai" />
          <AdminLogin signIn={signIn} />
        </AgencyWrapper>
      } />
      <Route path="/brown-aerospace/admin" element={
        <AgencyWrapper agency="bai">
          <StarField />
          <Nav isAdmin={isAdmin && adminAgency === 'bai'} signOut={signOut} base="/brown-aerospace" agency="bai" />
          {isAdmin && adminAgency === 'bai'
            ? <AdminPanel agency="bai" />
            : <AdminLogin signIn={signIn} />
          }
        </AgencyWrapper>
      } />
      <Route path="/brown-aerospace/crew" element={
        <AgencyWrapper agency="bai">
          <StarField />
          <Nav isAdmin={isAdmin && adminAgency === 'bai'} signOut={signOut} base="/brown-aerospace" agency="bai" />
          <Crew agency="bai" />
        </AgencyWrapper>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}