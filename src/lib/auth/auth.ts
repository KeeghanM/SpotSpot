import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { Resend } from 'resend'
import { db } from '../db/db'
import * as schema from '../db/schema'

const resend = new Resend(import.meta.env.RESEND_API_KEY)

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: 'auth@spotspot.app',
        to: user.email,
        subject: 'Reset your SpotSpot password',
        html: `<p>Someone (hopefully you) has requested a password reset for your SpotSpot account.</p>
        <p>If this was you, click the link below to set a new password</p>
        <p><a href="${url}">Reset Password</a></p>
        <p><i>If that link doesn't work try copypasting ${url}</i></p>
        <p>If you didn't request this, you can ignore this email and your password will remain unchanged.</p>
        <p>Thanks for using SpotSpot!</p>
        <p>— The SpotSpot Team</p>`,
      })
    },
  },
})
