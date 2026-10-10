import { loadRegistry } from '../game/content/registry'
import { aggregateCards, aggregateEnemies, aggregatePlayer, aggregateRelics } from './aggregateAnalytics'
import type { AnalyticsBlob } from './types'

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`
}

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function buildAnalyticsCsv(blob: AnalyticsBlob): string {
  loadRegistry()
  const lines: string[] = []
  const player = aggregatePlayer(blob)

  lines.push('=== Player ===')
  lines.push('metric,value')
  lines.push(`totalRuns,${player.totalRuns}`)
  lines.push(`victories,${player.victories}`)
  lines.push(`defeats,${player.defeats}`)
  lines.push(`abandoned,${player.abandoned}`)
  lines.push(`winRate,${pct(player.winRate)}`)
  lines.push('')

  lines.push('=== Cards ===')
  lines.push('defId,name,plays,deckRuns,wins,winRate')
  for (const row of aggregateCards(blob)) {
    lines.push(
      [
        escapeCsv(row.defId),
        escapeCsv(row.name),
        row.plays,
        row.deckRuns,
        row.wins,
        pct(row.winRate),
      ].join(','),
    )
  }

  lines.push('')
  lines.push('=== Relics ===')
  lines.push('relicId,name,runs,wins,winRate')
  for (const row of aggregateRelics(blob)) {
    lines.push(
      [escapeCsv(row.relicId), escapeCsv(row.name), row.runs, row.wins, pct(row.winRate)].join(','),
    )
  }

  lines.push('')
  lines.push('=== Enemies ===')
  lines.push('defId,name,encounters,playerDeaths,killRate')
  for (const row of aggregateEnemies(blob)) {
    lines.push(
      [
        escapeCsv(row.defId),
        escapeCsv(row.name),
        row.encounters,
        row.playerDeaths,
        pct(row.killRate),
      ].join(','),
    )
  }

  return lines.join('\n')
}

export function downloadAnalyticsCsv(blob: AnalyticsBlob, filename = 'arcana-analytics.csv'): void {
  const csv = buildAnalyticsCsv(blob)
  const blobObj = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blobObj)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
