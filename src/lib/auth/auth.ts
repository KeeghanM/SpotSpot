import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../db/db'
import * as schema from '../db/schema'

// fix UNABLE_TO_GET_ISSUER_CERT_LOCALLY
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema,
  }),
  emailAndPassword: { enabled: true },
})
