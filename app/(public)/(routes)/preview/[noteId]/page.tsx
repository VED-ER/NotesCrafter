'use client'

import Cover from "@/components/Cover"
import Toolbar from "@/components/Toolbar"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

type NotePreviewPageProps = {
    params: {
        noteId: Id<'notes'>
    }
}

const NotePreviewPage = ({ params }: NotePreviewPageProps) => {
    const [noteData, setNoteData] = useState<Doc<'notes'> | null>(null)
    const Editor = useMemo(() => dynamic(() => import("@/components/Editor"), { ssr: false }), []) // recommended way to import Editor from noteation

    const note = useQuery(api.notes.getById, { noteId: params.noteId })

    // preventing real-time updates on preview
    useEffect(() => {
        if ((note === null || note) && noteData === null) {
            setNoteData(note)
        }
    }, [note?.content])

    // TODO: show a toast ever x seconds if new version is available so a user can refresh to get the latest version

    // toast('A new version is available.', {
    //     description: 'Friday, February 10, 2023 at 5:57 PM',
    //     action: {
    //         label: 'Refresh',
    //         onClick: () => console.log('Undo')
    //     },
    // })

    if (note === undefined) {
        return (
            <div>
                <Cover.Skeleton />
                <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
                    <div className="space-y-4 pl-8 pt-4">
                        <Skeleton className="h-14 w-[50%]" />
                        <Skeleton className="h-4 w-[70%]" />
                        <Skeleton className="h-4 w-[30%]" />
                        <Skeleton className="h-4 w-[60%]" />
                    </div>
                </div>
            </div>
        )
    }

    if (note === null || noteData === null) {
        return (
            <p>Not found</p>
        )
    }

    return (
        <>
            <div className="pb-40">
                <Cover preview url={noteData.coverImage} />
                <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
                    <Toolbar preview initialData={noteData} />
                    <Editor
                        editable={false}
                        onChange={() => { }}
                        initialContent={noteData.content}
                    />
                </div>
            </div>
        </>
    )
}

export default NotePreviewPage