import { v } from "convex/values";
import { mutation, query } from "./_generated/server"
import { Doc, Id } from "./_generated/dataModel"

export const archive = mutation({
    args: {
        id: v.id('notes')
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error('Not authenticated')
        }

        const userId = identity.subject
        const note = await ctx.db.get(args.id)

        if (!note) {
            throw new Error('Not found')
        }

        if (note.userId !== userId) {
            throw new Error('Unauthorized')
        }

        const recursiveArchive = async (noteId: Id<'notes'>) => {
            const children = await ctx.db.query('notes').withIndex('by_user_parent', (q) => (
                q.eq('userId', userId).eq('parentNote', noteId)
            )).collect()

            for (const child of children) {
                await ctx.db.patch(child._id, { isArchived: true })

                await recursiveArchive(child._id)
            }
        }

        const patchedNote = await ctx.db.patch(args.id, { isArchived: true })

        recursiveArchive(args.id)

        return patchedNote
    },
})

export const remove = mutation({
    args: { id: v.id('notes') },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error('Not authenticated')
        }
        const userId = identity.subject

        const note = await ctx.db.get(args.id)

        if (!note) {
            throw new Error('Not found')
        }

        if (note.userId !== userId) {
            throw new Error('Unauthorized')
        }
        // if deleted and has children, remove parentNote from all children

        const deletedNote = await ctx.db.delete(args.id)

        return deletedNote
    }
})

export const removeNotes = mutation({
    args: { ids: v.array(v.id('notes')) },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error('Not authenticated')
        }
        const userId = identity.subject

        const deletedNotes: Doc<'notes'>[] = []

        for (const noteId of args.ids) {

            const note = await ctx.db.get(noteId)

            if (!note) {
                throw new Error('Not found')
            }

            if (note.userId !== userId) {
                throw new Error('Unauthorized')
            }
            await ctx.db.delete(noteId)

            deletedNotes.push(note)
        }
        // if deleted and has children, remove parentNote from all children

        return deletedNotes
    }
})

export const getArchived = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error('Not authenticated')
        }
        const userId = identity.subject

        const notes = await ctx.db.query('notes').withIndex('by_user', (q) => (
            q.eq('userId', userId)
        )).filter(q => q.eq(q.field('isArchived'), true)).order('desc').collect()

        return notes
    }
})

export const restore = mutation({
    args: { id: v.id('notes') },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error('Not authenticated')
        }
        const userId = identity.subject

        const note = await ctx.db.get(args.id)

        if (!note) {
            throw new Error('Not found')
        }

        if (note.userId !== userId) {
            throw new Error('Unauthorized')
        }

        const recursiveRestore = async (noteId: Id<'notes'>) => {
            const children = await ctx.db.query('notes').withIndex('by_user_parent', (q) => (
                q.eq('userId', userId).eq('parentNote', noteId)
            )).collect()

            for (const child of children) {
                await ctx.db.patch(child._id, { isArchived: false })
                await recursiveRestore(child._id)
            }
        }

        // can restore a note which has a parent
        const options: Partial<Doc<"notes">> = {
            isArchived: false
        }

        if (note.parentNote) {
            const parent = await ctx.db.get(note.parentNote)
            if (parent?.isArchived) {
                options.parentNote = undefined
            }
        }

        const patchedNote = await ctx.db.patch(args.id, options)
        recursiveRestore(args.id)
        return patchedNote
    }
})

export const getSidebar = query({
    args: {
        parentNote: v.optional(v.id('notes'))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error('Not authenticated')
        }

        const userId = identity.subject

        const notes = await ctx.db.query('notes')
            .withIndex('by_user_parent', (q) =>
                q.eq('userId', userId)
                    .eq('parentNote', args.parentNote)
            )
            .filter(q => q.eq(q.field('isArchived'), false))
            .collect()

        return notes
    }
})

export const create = mutation({
    args: {
        title: v.string(),
        parentNote: v.optional(v.id('notes'))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error('Not authenticated')
        }

        const userId = identity.subject
        const note = await ctx.db.insert('notes', {
            title: args.title,
            parentNote: args.parentNote,
            userId,
            isArchived: false,
            isPublished: false,
            pinned: false
        })
        return note
    }
})

export const getSearch = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error('Not authenticated')
        }

        const userId = identity.subject

        const notes = await ctx.db.query('notes').withIndex('by_user', q => (
            q.eq('userId', userId)
        )).filter(q => q.eq(q.field('isArchived'), false))
            .order('desc')
            .collect()

        return notes
    }
})

export const getById = query({
    args: { noteId: v.id('notes') },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        const note = await ctx.db.get(args.noteId)

        if (!note) {
            throw new Error('Not found')
        }

        if (note.isPublished && !note.isArchived) {
            return note
        }

        if (!identity) {
            throw new Error('Not authenticated')
        }

        const userId = identity.subject

        if (note.userId !== userId) {
            throw new Error('Unauthorized')
        }

        return note
    }
})

export const update = mutation({
    args: {
        id: v.id('notes'),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPublished: v.optional(v.boolean())
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error('Unauthenticated')
        }

        const userId = identity.subject

        const { id, ...rest } = args

        const existingNote = await ctx.db.get(args.id)

        if (!existingNote) {
            throw new Error('Not found')
        }

        if (existingNote.userId !== userId) {
            throw new Error('Unauthorized')
        }

        const note = await ctx.db.patch(args.id, { ...rest })

        return note
    }
})

export const removeIcon = mutation({
    args: {
        id: v.id('notes')
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error('Unauthenticated')
        }

        const userId = identity.subject

        const existingNote = await ctx.db.get(args.id)

        if (!existingNote) {
            throw new Error('Not found')
        }

        if (existingNote.userId !== userId) {
            throw new Error('Unauthorized')
        }

        const note = await ctx.db.patch(args.id, { icon: undefined })

        return note
    }
})

export const removeCoverImage = mutation({
    args: {
        id: v.id('notes')
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error('Unauthenticated')
        }

        const userId = identity.subject

        const existingNote = await ctx.db.get(args.id)

        if (!existingNote) {
            throw new Error('Not found')
        }

        if (existingNote.userId !== userId) {
            throw new Error('Unauthorized')
        }

        const note = await ctx.db.patch(args.id, { coverImage: undefined })

        return note
    }
})

export const getAllParents = query({
    args: { noteId: v.id('notes') },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        const note = await ctx.db.get(args.noteId)

        if (!note) {
            throw new Error('Not found')
        }

        if (!identity) {
            throw new Error('Not authenticated')
        }

        const userId = identity.subject

        if (note.userId !== userId) {
            throw new Error('Unauthorized')
        }

        const notes: Array<Doc<'notes'> | null> = []

        const getNextParent = async (noteId: Id<'notes'>) => {
            const note = await ctx.db.get(noteId)

            notes.unshift(note)

            if (note?.parentNote) {
                await getNextParent(note.parentNote)
            }
        }

        if (note.parentNote) {

            await getNextParent(note.parentNote)
        }

        return notes
    }
})

export const getPinned = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error('Not authenticated')
        }
        const userId = identity.subject

        const notes = await ctx.db.query('notes').withIndex('by_user', (q) => (
            q.eq('userId', userId)
        )).filter(q => q.eq(q.field('pinned'), true))
            .filter(q => q.eq(q.field('isArchived'), false))
            .order('desc').collect()

        return notes
    }
})

export const togglePinned = mutation({
    args: {
        id: v.id('notes')
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new Error('Unauthenticated')
        }

        const userId = identity.subject

        const existingNote = await ctx.db.get(args.id)

        if (!existingNote) {
            throw new Error('Not found')
        }

        if (existingNote.userId !== userId) {
            throw new Error('Unauthorized')
        }
        // when creating new note, add pinned to false??
        const note = await ctx.db.patch(args.id, { pinned: !existingNote.pinned })

        return note
    }
})