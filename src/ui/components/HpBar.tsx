import styles from './HpBar.module.scss'

type Props = {
  hp: number
  maxHp: number
  label?: string
}

export function HpBar({ hp, maxHp, label }: Props) {
  const pct = maxHp > 0 ? Math.max(0, Math.min(100, (hp / maxHp) * 100)) : 0
  return (
    <div className={styles.wrap}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.text}>
        {hp}/{maxHp}
      </span>
    </div>
  )
}
