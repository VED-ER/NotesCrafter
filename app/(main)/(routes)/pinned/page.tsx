'use client'

import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import Image from "next/image";
import { Spinner } from "@/components/Spinner";
import NoteCard from "../../_components/NoteCard";

const PinnedPage = () => {
    const notes = useQuery(api.notes.getPinned)

    if (notes === undefined) {
        return <div className="h-full flex items-center justify-center"><Spinner size={'icon'} /></div>
    }

    if (notes === null || notes.length === 0) {
        return (<div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image
                src={'/error.png'}
                width={300}
                height={300}
                alt="error image"
                className="dark:hidden"
            />
            <Image
                src={'/error-dark.png'}
                width={300}
                height={300}
                alt="error image"
                className="hidden dark:block"
            />
            <h2 className="text-xl font-medium">You have no pinned notes.</h2>
            <p>Start pinning notes and they will show up here.</p>
        </div>)
    }

    return (
        <div className="w-full md:max-w-3xl lg:max-w-5xl mx-auto p-5">
            <div className="space-y-6 py-8 md:columns-2 sm:gap-6 xl:columns-3 gap-3">
                {notes?.map(note => (
                    <NoteCard key={note._id} note={note} />
                ))}
            </div>
        </div>
    )
}

export default PinnedPage