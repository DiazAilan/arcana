import styles from './HpBar.module.scss'

type Props = {
  hp: number
  maxHp: number
  label?: string
  previewHp?: number | null
}

export function HpBar({ hp, maxHp, label, previewHp }: Props) {
  const pct = maxHp > 0 ? Math.max(0, Math.min(100, (hp / maxHp) * 100)) : 0
  const showGhost = previewHp != null && previewHp !== hp

  return (
    <div className={styles.wrap}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.text}>
        {hp}/{maxHp}
        {showGhost ? <span className={styles.previewHp}> → {previewHp}</span> : null}
      </span>
    </div>
  )
}
