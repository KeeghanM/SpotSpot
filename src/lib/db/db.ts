// src/lib/db/db.ts
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
// eslint-disable-next-line no-undef
process.env.NODE_TLS_REJECT_UNAUTHORIZED = import.meta.env
  .DEV
  ? '0'
  : '1'

const turso = createClient({
  url: import.meta.env.TURSO_DATABASE_URL!,
  authToken: import.meta.env.TURSO_AUTH_TOKEN,
})

export const db = drizzle(turso)
