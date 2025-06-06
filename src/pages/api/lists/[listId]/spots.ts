import type { TSpot } from '@/components/app/stores/app'
import { auth } from '@/lib/auth/auth'
import { db } from '@/lib/db/db'
import { list, spot, spotTag, tag } from '@/lib/db/schema'
import type { APIRoute } from 'astro'
import { and, count, eq, inArray } from 'drizzle-orm'

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
      newSpot: TSpot
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
      spotToUpdate: TSpot
    }

    if (
      !spotToUpdate ||
      spotToUpdate.listId !== +params.listId
    )
      return new Response('Invalid request', {
        status: 400,
      })

    // Check we have permissions to update this spot
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

    // Update the spot basic information
    const updated = await db
      .update(spot)
      .set({
        name: spotToUpdate.name,
        locationName: spotToUpdate.location?.name,
        locationAddress: spotToUpdate.location?.address,
        locationLink: spotToUpdate.location?.link,
        locationLat: spotToUpdate.location?.lat,
        locationLng: spotToUpdate.location?.lng,
        visited: spotToUpdate.visited,
        rating: spotToUpdate.rating,
        notes: spotToUpdate.notes,
      })
      .where(
        and(
          eq(spot.id, spotToUpdate.id),
          eq(spot.listId, +params.listId),
        ),
      )
      .returning()

    if (!updated[0]) throw new Error('Failed to update')

    // Handle tag updates
    // Get existing tags for this spot
    const existingSpotTags = await db
      .select()
      .from(spotTag)
      .where(eq(spotTag.spotId, spotToUpdate.id))

    // Get existing tag records that match the incoming tag names
    const existingTagsForUser = await db
      .select()
      .from(tag)
      .where(eq(tag.userId, session.user.id))

    // Find which tags need to be removed from this spot
    const tagsToRemove = existingSpotTags.filter(
      (st) =>
        !spotToUpdate.tags.some((t) => t.id === st.tagId),
    )

    // Remove the spot-tag associations
    if (tagsToRemove.length > 0) {
      await db.delete(spotTag).where(
        and(
          eq(spotTag.spotId, spotToUpdate.id),
          inArray(
            spotTag.tagId,
            tagsToRemove.map((t) => t.tagId),
          ),
        ),
      )

      // For each removed tag, check if it's the last instance
      // If so, also delete the tag itself
      await Promise.all(
        tagsToRemove.map(async (tagToRemove) => {
          const remainingAssociations = await db
            .select({ count: count() })
            .from(spotTag)
            .where(eq(spotTag.tagId, tagToRemove.tagId))

          if (remainingAssociations[0].count === 0) {
            await db
              .delete(tag)
              .where(eq(tag.id, tagToRemove.tagId))
          }
        }),
      )
    }

    // Handle new tags
    // First, identify which tag names already exist in the database
    const incomingTagNames = spotToUpdate.tags.map(
      (t) => t.name,
    )
    const existingTagsByName = existingTagsForUser.filter(
      (t) => incomingTagNames.includes(t.name),
    )

    // Identify which tag names are new and need to be created
    const newTagNames = incomingTagNames.filter(
      (name) =>
        !existingTagsByName.some((t) => t.name === name),
    )

    // Create new tags
    const newTags = []
    if (newTagNames.length > 0) {
      const createdTags = await db
        .insert(tag)
        .values(
          newTagNames.map((name) => ({
            name,
            userId: session.user.id,
          })),
        )
        .returning()

      newTags.push(...createdTags)
    }

    // Combine existing and new tags to get complete tag list
    const allTags = [...existingTagsByName, ...newTags]

    // Find which tag-spot associations need to be created
    const existingTagIds = existingSpotTags.map(
      (st) => st.tagId,
    )
    const tagsToAssociate = allTags.filter(
      (t) => !existingTagIds.includes(t.id),
    )

    // Create new associations
    if (tagsToAssociate.length > 0) {
      await db
        .insert(spotTag)
        .values(
          tagsToAssociate.map((t) => ({
            spotId: spotToUpdate.id,
            tagId: t.id,
          })),
        )
    }

    // Fetch the updated spot with its tags to return
    const updatedSpotWithTags = await db
      .select()
      .from(spot)
      .where(eq(spot.id, spotToUpdate.id))
      .leftJoin(spotTag, eq(spot.id, spotTag.spotId))
      .leftJoin(tag, eq(spotTag.tagId, tag.id))

    return new Response(JSON.stringify(updatedSpotWithTags))
  } catch (error) {
    const msg =
      error instanceof Error
        ? error.message
        : 'An error occurred'
    return new Response(msg, { status: 500 })
  }
}

export const DELETE: APIRoute = async ({
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

    const { spotId } = (await request.json()) as {
      spotId: number
    }

    if (!spotId)
      return new Response('Missing spot id', {
        status: 400,
      })

    //Check we have permissions to update this spot
    const validSpot = await db
      .select()
      .from(spot)
      .leftJoin(list, eq(spot.listId, list.id))
      .where(
        and(
          eq(spot.id, spotId),
          eq(spot.listId, +params.listId),
          eq(list.userId, session.user.id),
        ),
      )

    if (!validSpot[0])
      return new Response('Unauthorized', { status: 401 })

    const deleted = await db
      .delete(spot)
      .where(
        and(
          eq(spot.id, spotId),
          eq(spot.listId, +params.listId),
        ),
      )
      .returning()

    if (!deleted[0]) throw new Error('Failed to delete')

    return new Response(JSON.stringify(deleted[0]))
  } catch (error) {
    const msg =
      error instanceof Error
        ? error.message
        : 'An error occurred'
    return new Response(msg, { status: 500 })
  }
}
