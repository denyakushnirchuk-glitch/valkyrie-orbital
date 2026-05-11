import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { CAREER_PHASES, OUTCOMES, VEHICLE_TYPES, VEHICLE_STATUSES } from '../lib/constants'
import TagPicker from '../components/TagPicker'
import PageHeader from '../components/PageHeader'
import styles from './AdminPanel.module.css'

const EMPTY_MISSION = {
  name: '', program_id: '', vehicle_id: '', phase: 'Proving Grounds',
  outcome: 'success', ingame_date: '', crew: '', description: '',
  tags: [], highlight: false,
}

const EMPTY_VEHICLE = {
  name: '', type: 'Launch Vehicle', status: 'active', description: '',
}

export default function AdminPanel({ agency = 'valkyrie' }) {
  const [tab,          setTab]         = useState('missions')
  const [mission,      setMission]     = useState(EMPTY_MISSION)
  const [vehicle,      setVehicle]     = useState(EMPTY_VEHICLE)
  const [programs,     setPrograms]    = useState([])
  const [vehicles,     setVehicles]    = useState([])
  const [missions,     setMissions]    = useState([])
  const [imgFile,      setImgFile]     = useState(null)
  const [imgPreview,   setImgPreview]  = useState(null)
  const [vImgFile,     setVImgFile]    = useState(null)
  const [vImgPreview,  setVImgPreview] = useState(null)
  const [saving,       setSaving]      = useState(false)
  const [msg,          setMsg]         = useState('')
  const [editingMission,  setEditingMission]  = useState(null)
  const [editingVehicle,  setEditingVehicle]  = useState(null)
  const [bioContent,   setBioContent]  = useState('')
  const [bioSaving,    setBioSaving]   = useState(false)

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    const [{ data: p }, { data: v }, { data: m }, { data: b }] = await Promise.all([
      supabase.from('programs').select('*'),
      supabase.from('vehicles').select('*'),
      supabase.from('missions').select('*, programs(name)').order('created_at', { ascending: false }),
      supabase.from('bio').select('content').eq('agency', agency).single(),
    ])
    setPrograms(p || [])
    setVehicles(v || [])
    setMissions(m || [])
    setBioContent(b?.content || '')
  }

  const handleImgChange = (e, setFile, setPreview) => {
    const file = e.target.files[0]
    if (!file) return
    setFile(file)
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const uploadImage = async (file, folder) => {
    const ext  = file.name.split('.').pop()
    const path = `${folder}/${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('mission-media')
      .upload(path, file, { upsert: true })
    if (error) throw error
    const { data } = supabase.storage.from('mission-media').getPublicUrl(path)
    return data.publicUrl
  }

  // ── MISSIONS ──────────────────────────────────────────

  const startEditMission = (m) => {
    setEditingMission(m.id)
    setMission({
      name:        m.name,
      program_id:  m.program_id  || '',
      vehicle_id:  m.vehicle_id  || '',
      phase:       m.phase,
      outcome:     m.outcome,
      ingame_date: m.ingame_date || '',
      crew:        m.crew?.join(', ') || '',
      description: m.description || '',
      tags:        m.tags || [],
      highlight:   m.highlight || false,
    })
    setImgPreview(m.image_url || null)
    setImgFile(null)
    setTab('missions')
    setMsg('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEditMission = () => {
    setEditingMission(null)
    setMission(EMPTY_MISSION)
    setImgFile(null)
    setImgPreview(null)
    setMsg('')
  }

  const saveMission = async (e) => {
    e.preventDefault()
    if (!mission.name.trim()) return
    setSaving(true)
    setMsg('')
    try {
      let image_url = editingMission
        ? (imgFile ? await uploadImage(imgFile, 'missions') : imgPreview)
        : (imgFile ? await uploadImage(imgFile, 'missions') : null)

      const crew = mission.crew
        ? mission.crew.split(',').map(s => s.trim()).filter(Boolean)
        : []

      const payload = {
        name:        mission.name.trim(),
        program_id:  mission.program_id  || null,
        vehicle_id:  mission.vehicle_id  || null,
        phase:       mission.phase,
        outcome:     mission.outcome,
        ingame_date: mission.ingame_date || null,
        crew,
        description: mission.description || null,
        tags:        mission.tags,
        highlight:   mission.highlight,
        image_url,
        program_notes: mission.program_id === 'other' ? (mission.program_other || null) : null,
        agency,
      }

      if (editingMission) {
        const { error } = await supabase.from('missions').update(payload).eq('id', editingMission)
        if (error) throw error
        setMsg('Mission updated.')
        setEditingMission(null)
      } else {
        const { error } = await supabase.from('missions').insert(payload)
        if (error) throw error
        setMsg('Mission logged.')
      }

      setMission(EMPTY_MISSION)
      setImgFile(null)
      setImgPreview(null)
      await loadAll()
    } catch (err) {
      setMsg('Error: ' + err.message)
    }
    setSaving(false)
  }

  const deleteMission = async (id) => {
    if (!confirm('Delete this mission? This cannot be undone.')) return
    await supabase.from('missions').delete().eq('id', id)
    setMissions(prev => prev.filter(m => m.id !== id))
    setMsg('Mission deleted.')
  }

  // ── VEHICLES ──────────────────────────────────────────

  const startEditVehicle = (v) => {
    setEditingVehicle(v.id)
    setVehicle({
      name:        v.name,
      type:        v.type,
      status:      v.status,
      description: v.description || '',
    })
    setVImgPreview(v.image_url || null)
    setVImgFile(null)
    setTab('vehicles')
    setMsg('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEditVehicle = () => {
    setEditingVehicle(null)
    setVehicle(EMPTY_VEHICLE)
    setVImgFile(null)
    setVImgPreview(null)
    setMsg('')
  }

  const saveVehicle = async (e) => {
    e.preventDefault()
    if (!vehicle.name.trim()) return
    setSaving(true)
    setMsg('')
    try {
      let image_url = editingVehicle
        ? (vImgFile ? await uploadImage(vImgFile, 'vehicles') : vImgPreview)
        : (vImgFile ? await uploadImage(vImgFile, 'vehicles') : null)

      const payload = {
        name:        vehicle.name.trim(),
        type:        vehicle.type,
        status:      vehicle.status,
        description: vehicle.description || null,
        image_url,
        agency, 
      }

      if (editingVehicle) {
        const { error } = await supabase.from('vehicles').update(payload).eq('id', editingVehicle)
        if (error) throw error
        setMsg('Vehicle updated.')
        setEditingVehicle(null)
      } else {
        const { error } = await supabase.from('vehicles').insert(payload)
        if (error) throw error
        setMsg('Vehicle registered.')
      }

      setVehicle(EMPTY_VEHICLE)
      setVImgFile(null)
      setVImgPreview(null)
      await loadAll()
    } catch (err) {
      setMsg('Error: ' + err.message)
    }
    setSaving(false)
  }

  const deleteVehicle = async (id) => {
    if (!confirm('Delete this vehicle? This cannot be undone.')) return
    await supabase.from('vehicles').delete().eq('id', id)
    setVehicles(prev => prev.filter(v => v.id !== id))
    setMsg('Vehicle deleted.')
  }

  // ── BIO ───────────────────────────────────────────────

  const saveBio = async (e) => {
    e.preventDefault()
    setBioSaving(true)
    setMsg('')
    const { error } = await supabase
      .from('bio')
      .update({ content: bioContent, updated_at: new Date().toISOString() })
      .eq('agency', agency)
    if (error) setMsg('Error: ' + error.message)
    else setMsg('Agency profile saved.')
    setBioSaving(false)
  }

  // ── RENDER ────────────────────────────────────────────

  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <PageHeader eyebrow="Restricted access" title="Admin panel" />

      <div className={styles.tabs}>
        {['missions', 'vehicles', 'archive', 'bio'].map(t => (
          <button
            key={t}
            className={tab === t ? `${styles.tab} ${styles.activeTab}` : styles.tab}
            onClick={() => { setTab(t); setMsg('') }}
          >
            {t === 'bio' ? 'Agency bio' : t}
          </button>
        ))}
      </div>

      {msg && (
        <div className={styles.msg} style={{
          color: msg.startsWith('Error') ? 'var(--outcome-failed)' : 'var(--outcome-success)'
        }}>
          {msg}
        </div>
      )}

      {/* ── MISSION FORM ── */}
      {tab === 'missions' && (
        <form onSubmit={saveMission} className={styles.form}>
          <div className={styles.formHeading}>
            {editingMission ? 'Editing mission' : 'Log new mission'}
            {editingMission && (
              <button type="button" className={styles.cancelBtn} onClick={cancelEditMission}>
                Cancel edit
              </button>
            )}
          </div>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Mission name *</label>
              <input value={mission.name}
                onChange={e => setMission(p => ({ ...p, name: e.target.value }))}
                placeholder="Skylance I" required />
            </div>
            <div className={styles.field}>
              <label>In-game date</label>
              <input value={mission.ingame_date}
                onChange={e => setMission(p => ({ ...p, ingame_date: e.target.value }))}
                placeholder="Year 1, Day 47" />
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Career phase</label>
              <select value={mission.phase}
                onChange={e => setMission(p => ({ ...p, phase: e.target.value }))}>
                {CAREER_PHASES.map(ph => (
                  <option key={ph.value} value={ph.value}>{ph.label}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>Outcome</label>
              <select value={mission.outcome}
                onChange={e => setMission(p => ({ ...p, outcome: e.target.value }))}>
                {OUTCOMES.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Program</label>
              <select value={mission.program_id}
                onChange={e => setMission(p => ({ ...p, program_id: e.target.value }))}>
                <option value="">— none —</option>
                {programs.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
                <option value="other">Other / Unlisted</option>
              </select>
              {mission.program_id === 'other' && (
                <input
                style={{ marginTop: '6px' }}
                value={mission.program_other || ''}
                onChange={e => setMission(p => ({ ...p, program_other: e.target.value }))}
                placeholder="Enter program name"
                />
                )}

            </div>
            <div className={styles.field}>
              <label>Vehicle</label>
              <select value={mission.vehicle_id}
                onChange={e => setMission(p => ({ ...p, vehicle_id: e.target.value }))}>
                <option value="">— none —</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label>Crew (comma-separated)</label>
            <input value={mission.crew}
              onChange={e => setMission(p => ({ ...p, crew: e.target.value }))}
              placeholder="Jebediah Kerman, Valentina Kerman" />
          </div>

          <div className={styles.field}>
            <label>Mission report</label>
            <textarea value={mission.description}
              onChange={e => setMission(p => ({ ...p, description: e.target.value }))}
              placeholder="Describe what happened — objectives, events, outcome…"
              style={{ minHeight: '120px' }} />
          </div>

          <div className={styles.field}>
            <label>Mission tags</label>
            <TagPicker
              selected={mission.tags}
              onChange={tags => setMission(p => ({ ...p, tags }))}
            />
          </div>

          <div className={styles.field}>
            <label>Mission image / screenshot</label>
            <div className={styles.imgDrop}>
              <input type="file" accept="image/*"
                onChange={e => handleImgChange(e, setImgFile, setImgPreview)} />
              {imgPreview
                ? <img src={imgPreview} className={styles.imgPreview} alt="preview" />
                : <span className={styles.imgLabel}>Click to upload screenshot</span>
              }
            </div>
            {imgPreview && editingMission && (
              <button type="button" className={styles.clearImg}
                onClick={() => { setImgFile(null); setImgPreview(null) }}>
                Remove image
              </button>
            )}
          </div>

          <div className={styles.checkRow}>
            <input type="checkbox" id="highlight" checked={mission.highlight}
              onChange={e => setMission(p => ({ ...p, highlight: e.target.checked }))}
              style={{ width: 'auto' }} />
            <label htmlFor="highlight" style={{ cursor: 'pointer' }}>
              Mark as highlight mission
            </label>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving ? 'Saving…' : editingMission ? 'Save changes' : 'Log mission'}
          </button>
        </form>
      )}

      {/* ── VEHICLE FORM ── */}
      {tab === 'vehicles' && (
        <form onSubmit={saveVehicle} className={styles.form}>
          <div className={styles.formHeading}>
            {editingVehicle ? 'Editing vehicle' : 'Register new vehicle'}
            {editingVehicle && (
              <button type="button" className={styles.cancelBtn} onClick={cancelEditVehicle}>
                Cancel edit
              </button>
            )}
          </div>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Vehicle name *</label>
              <input value={vehicle.name}
                onChange={e => setVehicle(p => ({ ...p, name: e.target.value }))}
                placeholder="Valkyrie I" required />
            </div>
            <div className={styles.field}>
              <label>Type</label>
              <select value={vehicle.type}
                onChange={e => setVehicle(p => ({ ...p, type: e.target.value }))}>
                {VEHICLE_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label>Status</label>
            <select value={vehicle.status}
              onChange={e => setVehicle(p => ({ ...p, status: e.target.value }))}>
              {VEHICLE_STATUSES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Description / design notes</label>
            <textarea value={vehicle.description}
              onChange={e => setVehicle(p => ({ ...p, description: e.target.value }))}
              placeholder="Design notes, mission history, capabilities…" />
          </div>

          <div className={styles.field}>
            <label>Vehicle graphic / screenshot</label>
            <div className={styles.imgDrop}>
              <input type="file" accept="image/*"
                onChange={e => handleImgChange(e, setVImgFile, setVImgPreview)} />
              {vImgPreview
                ? <img src={vImgPreview} className={styles.imgPreview} alt="preview" />
                : <span className={styles.imgLabel}>Click to upload graphic</span>
              }
            </div>
            {vImgPreview && editingVehicle && (
              <button type="button" className={styles.clearImg}
                onClick={() => { setVImgFile(null); setVImgPreview(null) }}>
                Remove image
              </button>
            )}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving ? 'Saving…' : editingVehicle ? 'Save changes' : 'Register vehicle'}
          </button>
        </form>
      )}

      {/* ── ARCHIVE ── */}
      {tab === 'archive' && (
        <div className={styles.archiveSection}>
          <div className={styles.archiveGroup}>
            <div className={styles.archiveGroupTitle}>Missions</div>
            {missions.length === 0 && (
              <div className={styles.empty}>No missions logged yet.</div>
            )}
            {missions.map(m => (
              <div key={m.id} className={styles.archiveRow}>
                <div className={styles.archiveName}>{m.name}</div>
                <div className={styles.archiveMeta}>
                  <span className={`outcome-${m.outcome}`}>{m.outcome}</span>
                  <span>{m.phase}</span>
                  {m.programs?.name && <span>{m.programs.name}</span>}
                  {m.ingame_date && <span>{m.ingame_date}</span>}
                </div>
                <div className={styles.archiveActions}>
                  <button className={styles.editBtn} onClick={() => startEditMission(m)}>
                    Edit
                  </button>
                  <button className={styles.deleteBtn} onClick={() => deleteMission(m.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.archiveGroup}>
            <div className={styles.archiveGroupTitle}>Vehicles</div>
            {vehicles.length === 0 && (
              <div className={styles.empty}>No vehicles registered yet.</div>
            )}
            {vehicles.map(v => (
              <div key={v.id} className={styles.archiveRow}>
                <div className={styles.archiveName}>{v.name}</div>
                <div className={styles.archiveMeta}>
                  <span>{v.type}</span>
                  <span style={{
                    color: VEHICLE_STATUSES.find(s => s.value === v.status)?.color
                  }}>
                    {v.status}
                  </span>
                </div>
                <div className={styles.archiveActions}>
                  <button className={styles.editBtn} onClick={() => startEditVehicle(v)}>
                    Edit
                  </button>
                  <button className={styles.deleteBtn} onClick={() => deleteVehicle(v.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── BIO ── */}
      {tab === 'bio' && (
        <form onSubmit={saveBio} className={styles.form}>
          <div className={styles.formHeading}>Agency profile</div>
          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: '10px',
            letterSpacing: '0.14em', color: 'var(--white-dim)',
            textTransform: 'uppercase', marginBottom: '0.5rem'
          }}>
            Paste your agency profile in Markdown format. Supports headings, lists, tables, and blockquotes.
          </p>
          <div className={styles.field}>
            <label>Markdown content</label>
            <textarea
              value={bioContent}
              onChange={e => setBioContent(e.target.value)}
              style={{ minHeight: '480px', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem' }}
              placeholder="# Valkyrie Orbital&#10;&#10;## Core Identity&#10;..."
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={bioSaving}>
            {bioSaving ? 'Saving…' : 'Save agency profile'}
          </button>
        </form>
      )}
    </main>
  )
}