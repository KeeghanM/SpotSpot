import { auth } from '@/lib/auth/auth'
import { db } from '@/lib/db/db'
import { list, spot, spotTag, tag } from '@/lib/db/schema'
import type { APIRoute } from 'astro'
import { and, eq, inArray } from 'drizzle-orm'

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

    const spots = await db
      .select()
      .from(spot)
      .where(
        inArray(
          spot.listId,
          lists.map((l) => l.id),
        ),
      )

    const tags = await db
      .select({
        id: tag.id,
        name: tag.name,
        spotId: spotTag.spotId,
      })
      .from(tag)
      .fullJoin(spotTag, eq(spotTag.tagId, tag.id))
      .where(
        inArray(
          spotTag.spotId,
          spots.map((s) => s.id),
        ),
      )
      .orderBy(spotTag.spotId, tag.name)

    const listsWithSpots = lists.map((l) => {
      const spotsWithTags = spots.map((s) => {
        const tagsForSpot = tags.filter(
          (t) => t.spotId === s.id,
        )
        return {
          id: s.id,
          name: s.name,
          visited: s.visited,
          rating: s.rating,
          notes: s.notes,
          location: {
            name: s.locationName,
            address: s.locationAddress,
            link: s.locationLink,
            lat: s.locationLat,
            lng: s.locationLng,
          },
          tags: tagsForSpot,
          listId: s.listId,
        }
      })
      const spotsForList = spotsWithTags.filter(
        (s) => s.listId === l.id,
      )
      return { ...l, spots: spotsForList }
    })

    return new Response(JSON.stringify(listsWithSpots))
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

export const PUT: APIRoute = async ({ request }) => {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session)
      return new Response('Unauthorized', { status: 401 })

    const { listToUpdate } = (await request.json()) as {
      listToUpdate: {
        id: number
        name: string
        parentId: number | null
      }
    }

    if (!listToUpdate)
      return new Response('Missing list', { status: 400 })

    // Check we have permissions to update this list
    const validList = await db
      .select()
      .from(list)
      .where(
        and(
          eq(list.userId, session.user.id),
          eq(list.id, listToUpdate.id),
        ),
      )
    if (validList.length === 0)
      return new Response('Unauthorized', { status: 401 })

    const updatedList = await db
      .update(list)
      .set({
        name: listToUpdate.name,
        parentId: listToUpdate.parentId,
      })
      .where(
        and(
          eq(list.userId, session.user.id),
          eq(list.id, listToUpdate.id),
        ),
      )
      .returning()

    if (!updatedList[0]) throw new Error('Failed to update')

    // Return the updated list back, so that it can be updated in client state
    return new Response(JSON.stringify(listToUpdate))
  } catch (error) {
    const msg =
      error instanceof Error
        ? error.message
        : 'An error occurred'
    return new Response(msg, { status: 500 })
  }
}
