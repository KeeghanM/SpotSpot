// src/lib/db/db.ts
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

const turso = createClient({
  url: import.meta.env.TURSO_DATABASE_URL!,
  authToken: import.meta.env.TURSO_AUTH_TOKEN,
})

export const db = drizzle(turso)
