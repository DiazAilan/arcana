import type { ReactNode } from 'react'
import styles from './Tooltip.module.scss'

type Props = {
  title?: string
  body: string
  children: ReactNode
  /** Default top — use bottom for HUD relics near the screen edge. */
  placement?: 'top' | 'bottom'
}

export function Tooltip({ title, body, children, placement = 'top' }: Props) {
  return (
    <span className={styles.wrap}>
      {children}
      <span
        className={`${styles.panel} ${placement === 'bottom' ? styles.panelBottom : styles.panelTop}`}
        role="tooltip"
      >
        {title ? <div className={styles.title}>{title}</div> : null}
        {body}
      </span>
    </span>
  )
}
