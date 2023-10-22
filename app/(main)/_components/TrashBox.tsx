'use client'

import { Spinner } from "@/components/Spinner"
import ConfirmModal from "@/components/modals/ConfirmModal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { Search, Trash, Undo } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

const TrashBox = () => {
    const router = useRouter()
    const params = useParams()
    const notes = useQuery(api.notes.getArchived)
    const restore = useMutation(api.notes.restore)
    const remove = useMutation(api.notes.remove)
    const removeNotes = useMutation(api.notes.removeNotes)

    const [search, setSearch] = useState('')
    const filteredNotes = notes?.filter(note => note.title.toLowerCase().includes(search.toLowerCase()))

    const onClick = (noteId: string) => {
        router.push('/notes/'.concat(noteId))
    }

    const onRestore = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, noteId: Id<'notes'>) => {
        e.stopPropagation()
        const promise = restore({ id: noteId })

        toast.promise(promise, {
            // todo
            loading: `Restoring note`,
            success: `Note restored`,
            error: `Failed to restore note`
        })
    }


    const onRemove = (noteId: Id<'notes'>) => {
        const promise = remove({ id: noteId })

        toast.promise(promise, {
            // todo
            loading: `Deleting note`,
            success: `Note deleted`,
            error: `Failed to delete note`
        })
        if (params.noteId === noteId) {
            router.push('/notes')
        }
    }

    const onDeleteAll = () => {
        if (!notes) return
        const notesIds = notes.map(n => n._id)
        const promise = removeNotes({ ids: notesIds })
        toast.promise(promise, {
            loading: `Deleting notes`,
            success: `Notes deleted`,
            error: `Failed to delete notes`
        })
        router.push('/notes')
    }

    // loading
    if (notes === undefined) {
        return (
            <div className="h-full flex items-center justify-center p-4">
                <Spinner size={'lg'} />
            </div>
        )
    }

    return (
        <div className="text-sm">
            <div className="flex flex-col">
                <div className="flex items-center gap-x-1 p-2">
                    <Search className="w-4 h-4" />
                    <Input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="px-2 focus-visible:ring-transparent bg-secondary"
                        placeholder="Filter by note title..."
                    />
                </div>
                {notes.length > 1 && (
                    <ConfirmModal onConfirm={onDeleteAll}>
                        <div className="px-2">
                            <Button className="w-full" variant={'destructive'}>Delete all</Button>
                        </div>
                    </ConfirmModal>
                )}
            </div>
            <div className="mt-2 px-1 pb-1">
                <p className="hidden last:block text-xm text-center text-muted-foreground pb-2">Trash is empty.</p>
                {filteredNotes?.map(note => (
                    <div
                        key={note._id}
                        role="button"
                        onClick={() => onClick(note._id)}
                        className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
                    >
                        <span className="truncate pl-2">{note.title}</span>
                        <div className="flex items-center">
                            <div
                                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                                role="button"
                                onClick={(e) => onRestore(e, note._id)}
                            >
                                <Undo className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <ConfirmModal onConfirm={() => onRemove(note._id)}>
                                <div
                                    className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                                    role="button"
                                >
                                    <Trash className="w-4 h-4 text-muted-foreground" />
                                </div>
                            </ConfirmModal>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TrashBox