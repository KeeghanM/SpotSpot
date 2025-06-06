import { auth } from '@/lib/auth/auth'
import { db } from '@/lib/db/db'
import { tag } from '@/lib/db/schema'
import type { APIRoute } from 'astro'
import { asc, eq } from 'drizzle-orm'

export const GET: APIRoute = async ({ request }) => {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session)
      return new Response('Unauthorized', { status: 401 })

    const tags = await db
      .select()
      .from(tag)
      .where(eq(tag.userId, session.user.id))
      .orderBy(asc(tag.name))

    return new Response(JSON.stringify(tags))
  } catch (error) {
    const msg =
      error instanceof Error
        ? error.message
        : 'An error occurred'
    return new Response(msg, { status: 500 })
  }
}
