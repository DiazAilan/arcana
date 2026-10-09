import type { RunEffect } from './effects'

export type EventChoice = {
  label: string
  effects: RunEffect[]
}

export type EventDef = {
  id: string
  title: string
  body: string
  choices: EventChoice[]
}
