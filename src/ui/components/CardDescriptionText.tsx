import type { DescriptionPart } from './cardDescriptionDisplay'
import styles from './CardView.module.scss'

type Props = { parts: DescriptionPart[] }

export function CardDescriptionText({ parts }: Props) {
  return (
    <p className={styles.desc}>
      {parts.map((part, i) => {
        if (part.kind === 'text') {
          return <span key={`t-${i}`}>{part.text}</span>
        }
        const tone = part.buff ? styles.effectBuff : part.debuff ? styles.effectDebuff : styles.effectNeutral
        return (
          <span key={`s-${i}`} className={styles.descStat}>
            <span className={styles.effectIcon} aria-hidden>
              {part.symbol}
            </span>{' '}
            <span className={`${styles.effectValueInline} ${tone}`}>{part.value}</span>
          </span>
        )
      })}
    </p>
  )
}
