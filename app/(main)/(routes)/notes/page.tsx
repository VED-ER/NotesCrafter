'use client'

import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/clerk-react"
import { useMutation } from "convex/react"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { useRouter } from "next/navigation"

const NotesPage = () => {
    const { user } = useUser()
    const router = useRouter()

    const create = useMutation(api.notes.create)

    const onCreate = () => {
        const promise = create({ title: 'Untitled' }).then((noteId) => router.push('/notes/'.concat(noteId)))

        toast.promise(promise, {
            loading: 'Creating new note...',
            success: 'New note created!',
            error: 'Failed to create new note.'
        })
    }

    return (
        <div className='h-full flex flex-col items-center justify-center space-y-4'>
            <Image
                src={'/empty.png'}
                height={300}
                width={300}
                alt="empty"
                className="dark:hidden"
            />
            <Image
                src={'/empty-dark.png'}
                height={300}
                width={300}
                alt="empty"
                className="hidden dark:block"
            />
            <h2 className="text-lg font-medium">Welcome to {user?.firstName}&apos;s NotesCrafter</h2>
            <Button onClick={onCreate}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create a note
            </Button>
        </div>
    )
}

export default NotesPage