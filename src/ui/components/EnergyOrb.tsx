import { Tooltip } from './Tooltip'
import styles from './EnergyOrb.module.scss'

type Props = {
  current: number
  max: number
  size?: 'default' | 'combat'
  showTooltip?: boolean
}

export function EnergyOrb({ current, max, size = 'default', showTooltip = false }: Props) {
  const orb = (
    <div className={`${styles.orb} ${size === 'combat' ? styles.orbCombat : ''}`}>
      <span className={styles.value}>{current}</span>
      <span className={styles.sub}>/ {max}</span>
    </div>
  )

  if (!showTooltip) return orb

  return (
    <Tooltip
      body="Spend energy to play cards each turn. Unused energy is lost when you end your turn."
      placement="top"
    >
      {orb}
    </Tooltip>
  )
}
