import styles from './HpBar.module.scss'

type Props = {
  hp: number
  maxHp: number
  label?: string
  previewHp?: number | null
  size?: 'default' | 'large'
}

export function HpBar({ hp, maxHp, label, previewHp, size = 'default' }: Props) {
  const safeHp = Math.max(0, Math.min(hp, maxHp))
  const preview =
    previewHp != null ? Math.max(0, Math.min(previewHp, maxHp)) : null
  const showIncoming = preview != null && preview < safeHp
  const remainHp = showIncoming ? preview! : safeHp

  const filledPct = maxHp > 0 ? (safeHp / maxHp) * 100 : 0
  const showGhost = showIncoming

  return (
    <div className={`${styles.wrap} ${size === 'large' ? styles.wrapLarge : ''}`}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <div className={styles.track}>
        <div className={styles.segments} style={{ width: `${filledPct}%` }}>
          {showIncoming ? (
            <>
              <div
                className={styles.fill}
                style={{ flex: remainHp }}
              />
              <div
                className={styles.fillIncoming}
                style={{ flex: safeHp - remainHp }}
              />
            </>
          ) : (
            <div className={styles.fill} style={{ width: '100%' }} />
          )}
        </div>
      </div>
      <span className={styles.text}>
        {showGhost ? (
          <>
            <span className={styles.previewHp}>{preview}</span>/{maxHp}
          </>
        ) : (
          <>
            {safeHp}/{maxHp}
          </>
        )}
      </span>
    </div>
  )
}
