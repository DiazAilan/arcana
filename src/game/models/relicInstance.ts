let relicInstanceCounter = 0

export type RelicInstance = {
  instanceId: string
  defId: string
  influences: string[]
}

export function createRelicInstance(defId: string, influences: string[] = []): RelicInstance {
  relicInstanceCounter += 1
  return { instanceId: `r-${relicInstanceCounter}`, defId, influences: [...influences] }
}

export function resetRelicInstanceCounter(): void {
  relicInstanceCounter = 0
}

export function relicDefIds(relics: RelicInstance[]): string[] {
  return relics.map((r) => r.defId)
}

export function hasRelicDef(relics: RelicInstance[], defId: string): boolean {
  return relics.some((r) => r.defId === defId)
}
