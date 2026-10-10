import type { AnalyticsBlob, CompletedRunRecord } from './types'

const STORAGE_KEY = 'arcana-analytics-v1'

function emptyBlob(): AnalyticsBlob {
  return { version: 1, runs: [] }
}

export function loadAnalyticsBlob(): AnalyticsBlob {
  if (typeof localStorage === 'undefined') return emptyBlob()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyBlob()
    const parsed = JSON.parse(raw) as AnalyticsBlob
    if (parsed.version !== 1 || !Array.isArray(parsed.runs)) return emptyBlob()
    return parsed
  } catch {
    return emptyBlob()
  }
}

export function saveAnalyticsBlob(blob: AnalyticsBlob): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blob))
}

export function appendCompletedRun(record: CompletedRunRecord): void {
  const blob = loadAnalyticsBlob()
  blob.runs.push(record)
  saveAnalyticsBlob(blob)
}

export function clearAnalytics(): void {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
