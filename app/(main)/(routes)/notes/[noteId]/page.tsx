'use client'

import Cover from "@/components/Cover"
import Toolbar from "@/components/Toolbar"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import dynamic from "next/dynamic"
import { useMemo } from "react"

type NoteIdPageProps = {
    params: {
        noteId: Id<'notes'>
    }
}

const NoteIdPage = ({ params }: NoteIdPageProps) => {
    const Editor = useMemo(() => dynamic(() => import("@/components/Editor"), { ssr: false }), []) // recommended way to import Editor from noteation

    const note = useQuery(api.notes.getById, { noteId: params.noteId })
    const update = useMutation(api.notes.update)
    console.log('RENDER');
    const onChange = (content: string) => {
        update({ id: params.noteId, content })

    }

    // const note = undefined
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

    if (note === null) {
        return (
            <p>Not found</p>
        )
    }

    return (
        <div className="pb-40">
            <Cover url={note.coverImage} />
            <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
                <Toolbar initialData={note} />
                <Editor
                    onChange={onChange}
                    initialContent={note.content}
                />
            </div>
        </div>
    )
}

export default NoteIdPage