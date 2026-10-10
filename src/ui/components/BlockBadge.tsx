import styles from './BlockBadge.module.scss'

type Props = {
  block: number
  label?: string
  size?: 'default' | 'large'
}

export function BlockBadge({ block, label = 'Block', size = 'default' }: Props) {
  return (
    <div
      className={`${styles.badge} ${block <= 0 ? styles.zero : ''} ${size === 'large' ? styles.large : ''} ${block > 0 && size === 'large' ? styles.active : ''}`}
      aria-label={`${label} ${block}`}
    >
      <span className={styles.shield} aria-hidden>
        🛡
      </span>
      <span className={styles.amount}>
        {label} {block}
      </span>
    </div>
  )
}
