'use client'

import ConfirmModal from "@/components/modals/ConfirmModal"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type BannerProps = {
    noteId: Id<'notes'>
}

const Banner = ({ noteId }: BannerProps) => {
    const router = useRouter()

    const remove = useMutation(api.notes.remove)
    const restore = useMutation(api.notes.restore)

    const onRemove = async () => {
        const promise = remove({ id: noteId })

        toast.promise(promise, {
            loading: 'Deleting note...',
            error: 'Failed to delete note.',
            success: 'Note deleted!'
        })

        router.push('/notes')
        // has to be here, throws an error if used in .then in remove promise
    }
    const onRestore = () => {
        const promise = restore({ id: noteId })

        toast.promise(promise, {
            loading: 'Restoring note...',
            error: 'Failed to restore note.',
            success: 'Note restored!'
        })
    }

    return (
        <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center justify-center gap-x-2 ">
            <p>This note is in trash.</p>
            <Button
                size={'sm'}
                onClick={onRestore}
                variant={'outline'}
                className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
            >
                Restore note
            </Button>
            <ConfirmModal onConfirm={onRemove}>
                <Button
                    size={'sm'}
                    variant={'outline'}
                    className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
                >
                    Delete forever
                </Button>
            </ConfirmModal>
        </div>
    )
}

export default Banner