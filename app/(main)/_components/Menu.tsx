'use client'

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useUser } from "@clerk/clerk-react"
import { useMutation } from "convex/react"
import { MoreHorizontalIcon, Pin, PinOff, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type MenuProps = {
    noteId: Id<'notes'>,
    pinned?: boolean,
    children?: React.ReactNode,
    align?: "center" | "start" | "end" | undefined,
    side?: "top" | "right" | "bottom" | "left" | undefined
}

const Menu = ({ noteId, side, children, pinned, align = "end" }: MenuProps) => {
    const router = useRouter()
    const { user } = useUser()
    const archive = useMutation(api.notes.archive)
    const togglePinned = useMutation(api.notes.togglePinned)

    const onArchive = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        const promise = archive({ id: noteId })

        toast.promise(promise, {
            loading: 'Moving to trash...',
            error: 'Failed to archive note.',
            success: 'Note moved to trash!'
        })
    }

    const onPin = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        togglePinned({ id: noteId })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children ? (
                    children
                ) : (
                    <Button size={'sm'} variant={'ghost'}>
                        <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-60"
                align={align}
                side={side}
                forceMount
            >
                <DropdownMenuItem onClick={onArchive}>
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onPin}>
                    {pinned ? <PinOff className="h-4 w-4 mr-2" /> : <Pin className="h-4 w-4 mr-2" />}
                    {pinned ? 'Unpin' : 'Pin'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="text-xs text-muted-foreground p-2">
                    Last edited by {user?.fullName}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

Menu.Skeleton = function MenuSkeleton() {
    return (
        <Skeleton className="h-10 w-10" />
    )
}

export default Menu