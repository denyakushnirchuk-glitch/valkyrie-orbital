import { useEffect, useRef } from 'react'

export default function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let stars = []
    let animId

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      seed()
    }

    function seed() {
      stars = []
      const n = Math.floor((canvas.width * canvas.height) / 5500)
      for (let i = 0; i < n; i++) {
        stars.push({
          x:     Math.random() * canvas.width,
          y:     Math.random() * canvas.height,
          r:     Math.random() * 0.85 + 0.1,
          a:     Math.random(),
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.002 + 0.0008,
        })
      }
    }

    let t = 0
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 0.016
      for (const s of stars) {
        const alpha = s.a * (0.25 + 0.75 * Math.sin(t * s.speed * 60 + s.phase))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201,168,76,${alpha * 0.6})`
        ctx.fill()
      }
      animId = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  )
}