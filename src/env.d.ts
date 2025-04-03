/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly BETTER_AUTH_SECRET: string
  readonly BETTER_AUTH_URL: string
  readonly TURSO_DATABASE_URL: string
  readonly TURSO_AUTH_TOKEN: string
  readonly PUBLIC_GOOGLE_PLACES_API_KEY: string
}

declare namespace App {
  interface Locals {
    user: import('better-auth').User | null
    session: import('better-auth').Session | null
  }
}
