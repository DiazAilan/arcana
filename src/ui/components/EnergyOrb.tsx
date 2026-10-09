import styles from './EnergyOrb.module.scss'

type Props = { current: number; max: number }

export function EnergyOrb({ current, max }: Props) {
  return (
    <div className={styles.orb} title="Energy">
      <span className={styles.value}>{current}</span>
      <span className={styles.sub}>/ {max}</span>
    </div>
  )
}
