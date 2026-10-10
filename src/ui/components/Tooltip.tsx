import type { ReactNode } from 'react'
import styles from './Tooltip.module.scss'

type Props = {
  title: string
  body: string
  children: ReactNode
}

export function Tooltip({ title, body, children }: Props) {
  return (
    <span className={styles.wrap} title={`${title}: ${body}`}>
      {children}
      <span className={styles.panel} role="tooltip">
        <div className={styles.title}>{title}</div>
        {body}
      </span>
    </span>
  )
}
