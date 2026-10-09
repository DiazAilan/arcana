import styles from './BlockBadge.module.scss'

type Props = {
  block: number
  label?: string
}

export function BlockBadge({ block, label = 'Block' }: Props) {
  return (
    <div className={`${styles.badge} ${block <= 0 ? styles.zero : ''}`} aria-label={`${label} ${block}`}>
      <span className={styles.shield} aria-hidden>
        🛡
      </span>
      <span>
        {label} {block}
      </span>
    </div>
  )
}
