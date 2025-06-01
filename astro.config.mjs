// @ts-check
import node from '@astrojs/node'
import partytown from '@astrojs/partytown'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import compress from 'astro-compress'
import icon from 'astro-icon'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [react(), partytown(), icon(), compress()],
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  vite: { plugins: [tailwindcss()] },
})
