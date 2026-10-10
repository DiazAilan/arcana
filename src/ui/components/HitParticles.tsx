import type { CSSProperties } from 'react'
import styles from './HitParticles.module.scss'

type Props = {
  active: boolean
  seed: number
}

const PARTICLES = [
  { dx: -28, dy: -22, color: '#ff6b6b' },
  { dx: 32, dy: -18, color: '#e8c547' },
  { dx: -18, dy: 24, color: '#ff8a8a' },
  { dx: 24, dy: 20, color: '#e85d5d' },
  { dx: 0, dy: -32, color: '#ffe680' },
  { dx: -34, dy: 4, color: '#ff6b6b' },
  { dx: 30, dy: 8, color: '#e8c547' },
]

export function HitParticles({ active, seed }: Props) {
  if (!active) return null

  return (
    <div className={styles.wrap} key={seed}>
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className={styles.particle}
          style={
            {
              ['--dx' as string]: `${p.dx}px`,
              ['--dy' as string]: `${p.dy}px`,
              background: p.color,
              animationDelay: `${i * 0.02}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
