'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react"
import { PinIcon, PinOffIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import Menu from "../../_components/Menu";
import { Spinner } from "@/components/Spinner";

const PinnedPage = () => {
    const [pinning, setPinning] = useState(false)
    const notes = useQuery(api.notes.getPinned)
    const togglePinned = useMutation(api.notes.togglePinned)
    const archive = useMutation(api.notes.archive)
    console.log(notes);

    if (notes === undefined) {
        return <div className="h-full flex items-center justify-center"><Spinner size={'lg'} /></div>
    }

    if (notes === null || notes.length === 0) {
        console.log('asdasddsasda');

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

    const onPinClick = (noteId: Id<'notes'>) => {
        setPinning(true)
        togglePinned({ id: noteId }).then(() => setPinning(false))
    }

    const onArchive = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, noteId: Id<'notes'>) => {
        e.stopPropagation()
        if (!noteId) return
        const promise = archive({ id: noteId })

        toast.promise(promise, {
            loading: 'Moving to trash...',
            error: 'Failed to archive note.',
            success: 'Note moved to trash!'
        })
    }

    const formatNicely = (date: Date) => {
        return date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    }

    return (
        <div className="w-full md:max-w-3xl lg:max-w-5xl mx-auto p-5">
            <div className="space-y-6 py-8 md:columns-2 sm:gap-6 xl:columns-3 gap-3">
                {notes?.map(note => (
                    <Card key={note._id} className="flex-1 break-inside-avoid border border-gray-30 h-fit">
                        <CardHeader>
                            <CardTitle className="mb-4 last:mb-0 leading-5">{note.icon} {note.title}</CardTitle>
                            {note?.coverImage && (
                                <div className="h-48 relative">
                                    <Image
                                        src={note.coverImage}
                                        alt="note image"
                                        className='object-cover rounded-md'
                                        fill
                                    />
                                </div>
                            )}
                            {/* <CardDescription></CardDescription> */}
                        </CardHeader>
                        <CardContent>
                            <p>Created at: {formatNicely(new Date(note._creationTime))}</p>
                        </CardContent>
                        <CardFooter>
                            {note.pinned ? (
                                <Button
                                    variant={'ghost'}
                                    onClick={() => onPinClick(note._id)}
                                    disabled={pinning}
                                >
                                    <PinOffIcon className="h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    variant={'ghost'}
                                    onClick={() => onPinClick(note._id)}
                                    disabled={pinning}
                                >
                                    <PinIcon className="h-4 w-4" />
                                </Button>
                            )}
                            <div className="ms-auto">
                                <Menu noteId={note._id} pinned={note.pinned} align="center" />
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default PinnedPage