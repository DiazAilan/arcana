import { useCallback, useEffect, useRef, useState } from 'react'
import { useGame } from '../../context/GameContext'
import { getRegistry } from '../../game/content/registry'
import { parseDevConsoleCommand } from '../dev/parseDevConsoleCommand'
import styles from './DevConsole.module.scss'

type LogLine = { kind: 'in' | 'out' | 'err' | 'ok'; text: string }

export function DevConsole() {
  const { session, dispatch } = useGame()
  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState<LogLine[]>([
    { kind: 'out', text: 'Dev console — ` to toggle. /fly on · /relic add relic_embers' },
  ])
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLDivElement>(null)

  const append = useCallback((kind: LogLine['kind'], text: string) => {
    setLines((prev) => [...prev, { kind, text }])
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Backquote' || e.repeat) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        if (!open) return
      }
      e.preventDefault()
      setOpen((o) => !o)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    logRef.current?.scrollTo(0, logRef.current.scrollHeight)
  }, [lines, open])

  const runCommand = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    append('in', trimmed)
    setValue('')

    const parsed = parseDevConsoleCommand(trimmed)
    if (!parsed.ok) {
      append('err', parsed.message)
      return
    }

    const { command } = parsed

    if (command.kind === 'fly_set') {
      if (!session.run) {
        append('err', 'No active run. Start a run first.')
        return
      }
      dispatch({ type: 'DEV_SET_FLY', enabled: command.enabled })
      append('ok', command.enabled ? 'Fly mode on — any uncleared node.' : 'Fly mode off — normal pathing.')
      return
    }

    if (!session.run) {
      append('err', 'No active run. Start a run first.')
      return
    }

    const registry = getRegistry()

    if (command.kind === 'relic_add') {
      if (!registry.relics.has(command.relicId)) {
        append('err', `Unknown relic: ${command.relicId}`)
        return
      }
      if (session.run.relics.includes(command.relicId)) {
        append('err', 'Relic already owned.')
        return
      }
      dispatch({ type: 'DEV_RELIC_ADD', relicId: command.relicId })
      append('ok', `Added ${registry.relics.get(command.relicId)?.name ?? command.relicId}.`)
      return
    }

    if (command.kind === 'relic_delete') {
      if (!session.run.relics.includes(command.relicId)) {
        append('err', 'Relic not in inventory.')
        return
      }
      dispatch({ type: 'DEV_RELIC_DELETE', relicId: command.relicId })
      append('ok', `Removed ${command.relicId}.`)
    }
  }

  if (!import.meta.env.DEV) return null

  return (
    <>
      {!open ? <div className={styles.hint}>` dev console</div> : null}
      <div className={`${styles.wrap} ${open ? styles.open : ''}`} aria-hidden={!open}>
        {open ? (
          <div className={styles.panel} role="dialog" aria-label="Developer console">
            <div className={styles.header}>
              <span>Debug console</span>
              <button type="button" className="btnGhost" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <div className={styles.log} ref={logRef}>
              {lines.map((line, i) => (
                <p key={i} className={`${styles.line} ${styles[line.kind]}`}>
                  {line.text}
                </p>
              ))}
            </div>
            <form
              className={styles.form}
              onSubmit={(e) => {
                e.preventDefault()
                runCommand(value)
              }}
            >
              <span className={styles.prompt}>&gt;</span>
              <input
                ref={inputRef}
                className={styles.input}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                spellCheck={false}
                autoComplete="off"
                aria-label="Console command"
              />
            </form>
          </div>
        ) : null}
      </div>
    </>
  )
}
