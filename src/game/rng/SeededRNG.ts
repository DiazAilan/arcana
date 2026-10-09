/** Mulberry32 — fast seeded PRNG for reproducible runs. */
export class SeededRNG {
  private state: number

  constructor(seed: number) {
    this.state = seed >>> 0 || 1
  }

  get seed(): number {
    return this.state
  }

  clone(): SeededRNG {
    const r = new SeededRNG(0)
    r.state = this.state
    return r
  }

  next(): number {
    let t = (this.state += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  nextInt(maxExclusive: number): number {
    return Math.floor(this.next() * maxExclusive)
  }

  pick<T>(items: readonly T[]): T {
    return items[this.nextInt(items.length)]!
  }

  shuffle<T>(items: T[]): T[] {
    const out = [...items]
    for (let i = out.length - 1; i > 0; i--) {
      const j = this.nextInt(i + 1)
      ;[out[i], out[j]] = [out[j]!, out[i]!]
    }
    return out
  }
}

export function randomSeed(): number {
  return (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0
}
