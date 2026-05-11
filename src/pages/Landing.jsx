import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AGENCIES } from '../lib/constants'
import styles from './Landing.module.css'

export default function Landing() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let stars = [], animId

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      seed()
    }

    function seed() {
      stars = []
      const n = Math.floor((canvas.width * canvas.height) / 4000)
      for (let i = 0; i < n; i++) stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 0.8 + 0.1,
        a: Math.random(),
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.002 + 0.0008,
      })
    }

    let t = 0
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 0.016
      for (const s of stars) {
        const alpha = s.a * (0.2 + 0.8 * Math.sin(t * s.speed * 60 + s.phase))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.5})`
        ctx.fill()
      }
      animId = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <div className={styles.root}>
      <canvas ref={canvasRef} className={styles.stars} />

      <div className={styles.header}>
        <p className={styles.headerEyebrow}>Kerbal Space Program — Active Campaigns</p>
        <h1 className={styles.headerTitle}>Two agencies.<br />One universe.</h1>
        <p className={styles.headerSub}>
          Two independent aerospace organizations. Two doctrines. One shared frontier.
          Choose your agency to follow their chronicle.
        </p>
      </div>

      <div className={styles.agencies}>
        {AGENCIES.map(agency => (
          <div
            key={agency.id}
            className={styles.agencyCard}
            data-agency={agency.id}
            onClick={() => navigate(agency.path)}
          >
            <div className={styles.cardInner}>
              <div className={styles.cardAccent} style={{ background: agency.accent }} />
              <p className={styles.cardEyebrow}>Active campaign</p>
              <h2 className={styles.cardName}>{agency.name}</h2>
              <p className={styles.cardMotto}>"{agency.motto}"</p>
              <div className={styles.cardCta}>
                Enter chronicle <span>→</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <span>KSP Multiplayer Chronicles</span>
      </div>
    </div>
  )
}