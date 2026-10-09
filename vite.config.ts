import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => ({
  // Project site: https://diazailan.github.io/arcana/
  base: mode === 'production' ? '/arcana/' : '/',
  plugins: [react()],
  test: {
    include: ['src/game/**/*.test.ts'],
  },
}))
