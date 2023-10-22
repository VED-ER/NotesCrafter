'use client'

import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import SidebarItem from "./SidebarItem"
import { cn } from "@/lib/utils"
import { FileIcon } from "lucide-react"

type NoteListProps = {
    parentNoteId?: Id<'notes'>,
    level?: number,
    data?: Doc<'notes'>[]
}
const NoteList = ({ parentNoteId, level = 0 }: NoteListProps) => {
    const params = useParams()
    const router = useRouter()
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})

    const onExpand = (noteId: string) => {
        setExpanded(prev => ({
            ...prev,
            [noteId]: !prev[noteId]
        }))
    }

    const notes = useQuery(api.notes.getSidebar, {
        parentNote: parentNoteId
    })

    const onRedirect = (noteId: string) => {
        router.push('/notes/'.concat(noteId))
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
                className={cn("hidden text-sm font-medium text-muted-foreground/80", expanded && 'last:block', level === 0 && 'hidden')}
            >
                No pages inside
            </p>
            {notes.map(doc => (
                <div key={doc._id}>
                    <SidebarItem
                        id={doc._id}
                        onClick={() => onRedirect(doc._id)}
                        label={doc.title}
                        icon={FileIcon}
                        noteIcon={doc.icon}
                        active={params.noteId === doc._id}
                        level={level}
                        onExpand={() => onExpand(doc._id)}
                        expanded={expanded[doc._id]}
                    />
                    {expanded[doc._id] && (
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