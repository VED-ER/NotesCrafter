'use client'

import { useState, useEffect } from "react"
import { useUser } from "@clerk/clerk-react"
import { useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useSearch } from "@/hooks/useSearch"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { File } from "lucide-react"

const SearchCommand = () => {
    const { user } = useUser()
    const router = useRouter()
    const notes = useQuery(api.notes.getSearch)
    const [isMounted, setIsMounted] = useState(false)

    const toggle = useSearch((store) => store.toggle)
    const isOpen = useSearch((store) => store.isOpen)
    const onClose = useSearch((store) => store.onClose)
    useEffect(() => {
        // trick to render only when its mounted, to avoid hydration errors
        setIsMounted(true)
    }, [])

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            // handling both windows and mac
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                toggle()
            }
        }

        document.addEventListener('keydown', down)

        return () => document.removeEventListener('keydown', down)
    }, [])

    const onSelect = (id: string) => {
        router.push('/notes/'.concat(id))
        onClose()
    }

    if (!isMounted) return null // prevent hydration error

    return (
        <CommandDialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <CommandInput
                placeholder={`Search ${user?.fullName}'s NotesCrafter...`}
            />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading={'Notes'}>
                    {notes?.map(note => (
                        <CommandItem
                            key={note._id}
                            value={`${note._id}-${note.title}`}
                            title={note.title}
                            onSelect={() => onSelect(note._id)}
                        >
                            {note.icon ? (
                                <p className="mr-2 text-lg">{note.icon}</p>
                            ) : (
                                <File className="mr-2 h-4 w-4" />
                            )}
                            <span>{note.title}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}

export default SearchCommand