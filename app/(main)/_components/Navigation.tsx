'use client'

import { cn } from "@/lib/utils"
import { ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings, Trash } from "lucide-react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { ElementRef, useEffect, useRef, useState } from "react"
import { useMediaQuery } from "usehooks-ts"
import UserIcon from "./UserIcon"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import SidebarItem from "./SidebarItem"
import { toast } from "sonner"
import NoteList from "./NoteList"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import TrashBox from "./TrashBox"
import { useSearch } from "@/hooks/useSearch"
import { useSettings } from "@/hooks/useSettings"
import Navbar from "./Navbar"

const Navigation = () => {
    const pathname = usePathname()
    const params = useParams()
    const isMobile = useMediaQuery("(max-width: 768px)")
    const isResizingRef = useRef(false)
    const sidebarRef = useRef<ElementRef<'aside'>>(null)
    const navbarRef = useRef<ElementRef<'div'>>(null)
    const [isReseting, setIsReseting] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(isMobile)
    const search = useSearch()
    const settings = useSettings()
    const create = useMutation(api.notes.create)
    const router = useRouter()

    useEffect(() => {
        if (isMobile) {
            collapse()
        } else {
            resetWidth()
        }
    }, [isMobile])

    // useEffect(() => {
    //     if (isMobile) {
    //         collapse()
    //     }
    // }, [pathname, isMobile])

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()

        isResizingRef.current = true
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizingRef.current) return
        console.log('1');

        let newWidth = e.clientX
        if (newWidth < 240) newWidth = 240
        if (newWidth > 480) newWidth = 480

        if (sidebarRef.current && navbarRef.current) {
            console.log('2');

            sidebarRef.current.style.width = `${newWidth}px`
            navbarRef.current.style.setProperty("left", `${newWidth}px`)
            // navbarRef.current.style.setProperty("width", `calc(100%-${newWidth}px)`)
            navbarRef.current.style.left = `${newWidth}px`
            navbarRef.current.style.width = `calc(100%-${newWidth}px)`
        }
    }

    const handleMouseUp = () => {
        isResizingRef.current = false
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
    }

    const resetWidth = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(false)
            setIsReseting(true)

            sidebarRef.current.style.width = isMobile ? '100%' : '240px'
            navbarRef.current.style.setProperty('width', isMobile ? '0' : 'calc(100%-240px)')
            navbarRef.current.style.setProperty('left', isMobile ? '100%' : '240px')
            setTimeout(() => setIsReseting(false), 300)
        }
    }

    const collapse = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(true)
            setIsReseting(true)

            sidebarRef.current.style.width = '0'
            navbarRef.current.style.setProperty('width', '100%')
            navbarRef.current.style.setProperty('left', '0')
            setTimeout(() => setIsReseting(false), 300)
        }
    }

    const handleCreate = () => {
        const promise = create({ title: 'Untitled' }).then((noteId) => router.push('/notes/'.concat(noteId)))

        toast.promise(promise, {
            loading: 'Creating new note...',
            success: 'New note created!',
            error: 'Failed to create new note.'
        })
    }

    return <>
        <aside
            ref={sidebarRef}
            className={cn('group/sidebar h-full bg-secondary overflow-y-auto dark:bg-[#232323] relative flex w-60 flex-col z-[99999]',
                isReseting && "transition-all ease-in-out duration-300",
                isMobile && 'w-0')}
        >
            <div
                role="button"
                onClick={collapse}
                className={cn("h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition", isMobile && "opacity-100")}
            >
                <ChevronsLeft className="h-6 w-6" />
            </div>
            <div>
                <UserIcon />
                <SidebarItem
                    label="Search"
                    onClick={search.onOpen}
                    icon={Search}
                    isSearch
                />
                <SidebarItem
                    label="Settings"
                    onClick={settings.onOpen}
                    icon={Settings}
                />
                <SidebarItem
                    label="New Note"
                    onClick={handleCreate}
                    icon={PlusCircle}
                />
            </div>
            <div className="mt-4">
                <NoteList />
                <SidebarItem
                    label="New Note"
                    onClick={handleCreate}
                    icon={Plus}
                />
                <Popover>
                    <PopoverTrigger className="w-full mt-4">
                        <SidebarItem label="Trash" icon={Trash} />
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-72" side={isMobile ? 'bottom' : 'right'}>
                        <TrashBox />
                    </PopoverContent>
                </Popover>
            </div>
            <div
                onMouseDown={handleMouseDown}
                onClick={resetWidth}
                className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0" />
        </aside>
        <div
            ref={navbarRef}
            className={cn(
                "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
                isReseting && "transition-all ease-in-out duration-300",
                isMobile && "left-0 w-full"
            )}
        >
            {!!params.noteId ? (
                <Navbar
                    isCollapsed={isCollapsed}
                    onResetWidth={resetWidth}
                />
            ) : (
                <nav className="bg-transparent px-3 py-2 w-full">
                    {isCollapsed && <MenuIcon onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground" />}
                </nav>
            )}
        </div>
    </>
}

export default Navigation