import type { Spot } from '@/components/app/stores/lists'
import { auth } from '@/lib/auth/auth'
import { db } from '@/lib/db/db'
import { list, spot } from '@/lib/db/schema'
import type { APIRoute } from 'astro'
import { and, eq } from 'drizzle-orm'

export const POST: APIRoute = async ({
  request,
  params,
}) => {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session)
      return new Response('Unauthorized', { status: 401 })

    if (!params.listId)
      return new Response('Missing listId', { status: 400 })

    const { newSpot } = (await request.json()) as {
      newSpot: Spot
    }

    if (
      !newSpot ||
      !newSpot.name ||
      newSpot.listId !== +params.listId
    )
      return new Response('Invalid request', {
        status: 400,
      })

    const inserts = await db
      .insert(spot)
      .values(newSpot)
      .returning({ insertedId: spot.id })

    if (!inserts[0]?.insertedId)
      throw new Error('Failed to insert')

    return new Response(
      JSON.stringify({
        listId: newSpot.listId,
        spot: { ...newSpot, id: inserts[0].insertedId },
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

export const PUT: APIRoute = async ({
  request,
  params,
}) => {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session)
      return new Response('Unauthorized', { status: 401 })

    if (!params.listId)
      return new Response('Missing listId', { status: 400 })

    const { spotToUpdate } = (await request.json()) as {
      spotToUpdate: Spot
    }

    console.log('spotToUpdate', spotToUpdate)

    if (
      !spotToUpdate ||
      spotToUpdate.listId !== +params.listId
    )
      return new Response('Invalid request', {
        status: 400,
      })

    //Check we have permissions to update this spot
    const validSpot = await db
      .select()
      .from(spot)
      .leftJoin(list, eq(spot.listId, list.id))
      .where(
        and(
          eq(spot.id, spotToUpdate.id),
          eq(spot.listId, +params.listId),
          eq(list.userId, session.user.id),
        ),
      )

    if (!validSpot[0])
      return new Response('Unauthorized', { status: 401 })

    const updated = await db
      .update(spot)
      .set(spotToUpdate)
      .where(
        and(
          eq(spot.id, spotToUpdate.id),
          eq(spot.listId, +params.listId),
        ),
      )
      .returning()

    if (!updated[0]) throw new Error('Failed to update')

    return new Response(JSON.stringify(updated[0]))
  } catch (error) {
    console.error(error)
    const msg =
      error instanceof Error
        ? error.message
        : 'An error occurred'
    return new Response(msg, { status: 500 })
  }
}
