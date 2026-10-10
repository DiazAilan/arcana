import { useMemo, useState } from 'react'
import {
  aggregateCards,
  aggregateEnemies,
  aggregatePlayer,
  aggregateRelics,
} from '../../analytics/aggregateAnalytics'
import { downloadAnalyticsCsv } from '../../analytics/exportAnalyticsCsv'
import { clearAnalytics, loadAnalyticsBlob } from '../../analytics/storage'
import { loadRegistry } from '../../game/content/registry'
import styles from './AnalyticsDashboard.module.scss'

type Props = {
  onClose: () => void
}

type TabId = 'cards' | 'relics' | 'enemies'

const TABS: { id: TabId; label: string }[] = [
  { id: 'cards', label: 'Cards' },
  { id: 'relics', label: 'Relics' },
  { id: 'enemies', label: 'Enemies' },
]

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`
}

export function AnalyticsDashboard({ onClose }: Props) {
  const [tick, setTick] = useState(0)
  const [tab, setTab] = useState<TabId>('cards')

  const blob = useMemo(() => {
    loadRegistry()
    void tick
    return loadAnalyticsBlob()
  }, [tick])

  const player = useMemo(() => aggregatePlayer(blob), [blob])
  const cards = useMemo(() => aggregateCards(blob), [blob])
  const relics = useMemo(() => aggregateRelics(blob), [blob])
  const enemies = useMemo(() => aggregateEnemies(blob), [blob])

  const tabCounts: Record<TabId, number> = {
    cards: cards.length,
    relics: relics.length,
    enemies: enemies.length,
  }

  const refresh = () => setTick((t) => t + 1)

  const onClear = () => {
    if (!window.confirm('Clear all stored run analytics?')) return
    clearAnalytics()
    refresh()
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Analytics (dev)</h1>
        <div className={styles.headerActions}>
          <button type="button" className="btnGhost" onClick={() => downloadAnalyticsCsv(blob)}>
            Export CSV
          </button>
          <button type="button" className="btnGhost" onClick={onClear}>
            Clear data
          </button>
          <button type="button" className="btnGhost" onClick={refresh}>
            Refresh
          </button>
          <button type="button" className="btnPrimary" onClick={onClose}>
            Back
          </button>
        </div>
      </div>

      <p className={styles.meta}>{blob.runs.length} completed runs in local storage</p>

      <section className={styles.section}>
        <h2>Player</h2>
        <div className={styles.playerSummary}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Win rate</span>
            <span className={styles.statValue}>{pct(player.winRate)}</span>
            <span className={styles.statDetail}>
              {player.victories} wins · {player.defeats} losses
              {player.abandoned > 0 ? ` · ${player.abandoned} abandoned` : ''}
            </span>
          </div>
        </div>
      </section>

      <div className={styles.tabs} role="tablist" aria-label="Analytics categories">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            <span className={styles.tabCount}>{tabCounts[t.id]}</span>
          </button>
        ))}
      </div>

      <section className={styles.section} role="tabpanel">
        {tab === 'cards' ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Plays</th>
                <th>Deck runs</th>
                <th>Win rate</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((row) => (
                <tr key={row.defId}>
                  <td>{row.name}</td>
                  <td>{row.plays}</td>
                  <td>{row.deckRuns}</td>
                  <td>{pct(row.winRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}

        {tab === 'relics' ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Runs</th>
                <th>Win rate</th>
              </tr>
            </thead>
            <tbody>
              {relics.map((row) => (
                <tr key={row.relicId}>
                  <td>{row.name}</td>
                  <td>{row.runs}</td>
                  <td>{pct(row.winRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}

        {tab === 'enemies' ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Encounters</th>
                <th>Kill rate</th>
              </tr>
            </thead>
            <tbody>
              {enemies.map((row) => (
                <tr key={row.defId}>
                  <td>{row.name}</td>
                  <td>{row.encounters}</td>
                  <td>{pct(row.killRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </section>
    </div>
  )
}
