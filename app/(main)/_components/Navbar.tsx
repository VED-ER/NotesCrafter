'use client'

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { MenuIcon } from "lucide-react"
import { useParams } from "next/navigation"
import Banner from "./Banner"
import Menu from "./Menu"
import Publish from "./Publish"
import TitleList from "./TitleList"

type NavbarProps = {
    isCollapsed: boolean,
    onResetWidth: () => void
}
const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
    const params = useParams()
    const note = useQuery(api.notes.getById, { noteId: params.noteId as Id<'notes'> })

    if (note === undefined && isCollapsed) {
        return (
            <nav className="bg-background px-3 py-2 w-full flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <Menu.Skeleton />
                </div>
            </nav>
        )
    }

    if (note === null) return null

    return (
        <>
            <nav className="bg-background px-3 py-2 w-full flex items-center justify-between gap-x-4">
                {isCollapsed && (
                    <MenuIcon
                        role="button"
                        onClick={onResetWidth}
                        className="h-6 w-6 text-muted-foreground"
                    />
                )}
                {note && (
                    <div className="flex items-center gap-x-2 justify-between w-full max-w-[90%] md:max-w-full ">
                        <TitleList note={note} />
                        <div className="flex items-center gap-x-2">
                            <Publish initialData={note} />
                            <Menu noteId={note._id} />
                        </div>
                    </div>
                )}
            </nav>
            {note && note.isArchived && (
                <Banner noteId={note._id} />
            )}
        </>
    )
}

export default Navbar