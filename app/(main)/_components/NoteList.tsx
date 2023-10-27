'use client'

import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useConvex, useQuery } from "convex/react"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import SidebarItem from "./SidebarItem"
import { cn } from "@/lib/utils"
import { FileIcon } from "lucide-react"
import { useActiveNote } from "@/hooks/useActiveNote"
import { useExpandedTree } from "@/hooks/useExpandedTree"

type NoteListProps = {
    parentNoteId?: Id<'notes'>,
    level?: number,
    data?: Doc<'notes'>[]
}
const NoteList = ({ parentNoteId, level = 0 }: NoteListProps) => {
    const params = useParams()
    const router = useRouter()
    const { setExpandedTree, expandedTree } = useExpandedTree()
    const { activeNote } = useActiveNote()

    const convex = useConvex()

    const notes = useQuery(api.notes.getSidebar, {
        parentNote: parentNoteId
    })

    useEffect(() => {
        const expandAllParents = async () => {
            const noteParents = await convex.query(api.notes.getAllParents, { noteId: activeNote?._id! })

            noteParents.map(parent => {
                if (parent) onExpand(parent._id)
            })
        }

        if (params.noteId === activeNote?._id && activeNote?.parentNote) {
            if (!expandedTree[activeNote.parentNote] || expandedTree[activeNote.parentNote] === false) {
                console.log("Expanding all");
                console.log(expandedTree);
                expandAllParents()
            }
        }
    }, [activeNote])

    const onRedirect = (noteId: string) => {
        router.push('/notes/'.concat(noteId))
    }

    const onExpand = (noteId: string) => {
        setExpandedTree(noteId)
    }

    // means its loading, if its an error or convex cant find anything it will be null
    if (notes === undefined) {
        return (
            <>
                <SidebarItem.Skeleton level={level} />
                {level === 0 && (
                    <>
                        <SidebarItem.Skeleton level={level} />
                        <SidebarItem.Skeleton level={level} />
                    </>
                )}
            </>
        )
    }

    return (
        <>
            {/* if its not last it will be hidden by default, if its last it will be displayed */}
            <p
                style={{ paddingLeft: level ? `${(level * 12) + 25}px` : undefined }}
                className={cn("hidden text-sm font-medium text-muted-foreground/80", expandedTree && 'last:block', level === 0 && 'hidden')}
            >
                No notes inside
            </p>
            {notes.map(doc => (
                <div key={doc._id}>
                    <SidebarItem
                        id={doc._id}
                        onClick={() => onRedirect(doc._id)}
                        label={doc.title}
                        pinned={doc.pinned}
                        icon={FileIcon}
                        noteIcon={doc.icon}
                        active={params.noteId === doc._id}
                        level={level}
                        onExpand={() => onExpand(doc._id)}
                        expanded={expandedTree[doc._id]}
                    />
                    {expandedTree[doc._id] && (
                        <NoteList
                            parentNoteId={doc._id}
                            level={level + 1}
                        />
                    )}
                </div>
            ))}
        </>
    )
}

export default NoteList