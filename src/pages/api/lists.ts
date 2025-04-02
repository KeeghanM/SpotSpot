import { auth } from '@/lib/auth/auth'
import { db } from '@/lib/db/db'
import { list } from '@/lib/db/schema'
import type { APIRoute } from 'astro'
import { and, eq } from 'drizzle-orm'

type List = typeof list.$inferSelect

export const GET: APIRoute = async ({ request }) => {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session)
      return new Response('Unauthorized', { status: 401 })

    const lists = await db
      .select()
      .from(list)
      .where(eq(list.userId, session.user.id))

    return new Response(JSON.stringify(lists))
  } catch (error) {
    const msg =
      error instanceof Error
        ? error.message
        : 'An error occurred'
    return new Response(msg, { status: 500 })
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session)
      return new Response('Unauthorized', { status: 401 })

    const { newList } = (await request.json()) as {
      newList: { name: string; parentId: number | null }
    }

    if (!newList)
      return new Response('Missing list', { status: 400 })

    const inserts = await db
      .insert(list)
      .values({
        name: newList.name,
        parentId: newList.parentId,
        userId: session.user.id,
      })
      .returning({ insertedId: list.id })

    if (!inserts[0]?.insertedId)
      throw new Error('Failed to insert')

    return new Response(
      JSON.stringify({
        id: inserts[0].insertedId,
        ...newList,
      }),
    )
  } catch (error) {
    const msg =
      error instanceof Error
        ? error.message
        : 'An error occurred'
    return new Response(msg, { status: 500 })
  }
}
export const DELETE: APIRoute = async ({ request }) => {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session)
      return new Response('Unauthorized', { status: 401 })

    const { id } = (await request.json()) as { id: number }

    if (!id)
      return new Response('Missing list id', {
        status: 400,
      })

    const validList = await db
      .select()
      .from(list)
      .where(
        and(
          eq(list.userId, session.user.id),
          eq(list.id, id),
        ),
      )

    if (validList.length === 0)
      throw new Error('Invalid ID or Auth')

    await db
      .delete(list)
      .where(
        and(
          eq(list.userId, session.user.id),
          eq(list.id, id),
        ),
      )

    // Return the original list back, so that it can be removed in client state
    return new Response(JSON.stringify(validList[0]))
  } catch (error) {
    const msg =
      error instanceof Error
        ? error.message
        : 'An error occurred'
    return new Response(msg, { status: 500 })
  }
}
