'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/clerk-react"
import { useMutation } from "convex/react"
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontalIcon, PlusCircle, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Menu from "./Menu"
import { Button } from "@/components/ui/button"

type SidebarItemProps = {
    id?: Id<'notes'>,
    noteIcon?: string,
    active?: boolean,
    pinned?: boolean,
    expanded?: boolean,
    isSearch?: boolean,
    level?: number,
    onExpand?: () => void,
    label: string,
    onClick?: () => void,
    icon: LucideIcon
}

const SidebarItem = ({
    id,
    noteIcon,
    active,
    pinned,
    expanded,
    isSearch,
    level = 0,
    onExpand,
    label,
    onClick,
    icon: Icon,

}: SidebarItemProps) => {
    const ChevronIcon = expanded ? ChevronDown : ChevronRight
    const router = useRouter()
    const create = useMutation(api.notes.create)

    const handleExpand = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        onExpand?.()
    }

    const handleCreateChildNote = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        if (!id) return
        const promise = create({ title: 'Untitled', parentNote: id }).then((noteId) => {
            if (!expanded) {
                onExpand?.()
            }
            router.push('/notes/'.concat(noteId))
        })

        toast.promise(promise, {
            loading: 'Creating new note...',
            success: 'New note created!',
            error: 'Failed to create new note.'
        })
    }

    return (
        <div
            onClick={onClick}
            role="button"
            style={{ paddingLeft: level ? `${(level * 12) + 12}px` : '12px' }}
            className={cn("group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
                active && "bg-primary/5 text-primary"
            )}
        >
            {!!id && (
                <div
                    role="button"
                    className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
                    onClick={handleExpand}
                >
                    <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                </div>
            )}
            {noteIcon ? (
                <div className="shrink-0 mr-2 text-[18px]">
                    {noteIcon}
                </div>
            ) : (
                <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
            )}
            <span className="truncate">{label}</span>
            {!!id && (
                <div className="ml-auto flex items-center gap-x-2">
                    <Menu noteId={id} pinned={pinned} align="start" side="right">
                        <Button
                            size={'sm'}
                            variant={'ghost'}
                            className="opacity-0 p-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                        >
                            <MoreHorizontalIcon className="w-4 h-4 text-muted-foreground" />
                        </Button>
                    </Menu>
                    <div
                        role="button"
                        onClick={handleCreateChildNote}
                        className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600">
                        <PlusCircle className="w-4 h-4 text-muted-foreground" />
                    </div>
                </div>
            )}
            {isSearch && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    <span className="text-xs">CMD</span>K
                </kbd>
            )}
        </div>
    )
}

SidebarItem.Skeleton = function SidebarItemSkeleton({ level }: { level?: number }) {
    return (
        <div style={{ paddingLeft: level ? `${(level * 12) + 12}px` : '12px' }} className="flex gap-x-2 py-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[30%]" />
        </div>
    )
}

export default SidebarItem