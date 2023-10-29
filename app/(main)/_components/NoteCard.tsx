import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { PinIcon, PinOffIcon } from "lucide-react"
import Image from "next/image"
import Menu from "./Menu"
import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import { formatDate } from "@/lib/formatDate"

type NoteCardProps = {
    note: Doc<'notes'>
}

const NoteCard = ({ note }: NoteCardProps) => {
    const [pinning, setPinning] = useState(false)

    const router = useRouter()

    const togglePinned = useMutation(api.notes.togglePinned)

    const onPinClick = (noteId: Id<'notes'>) => {
        setPinning(true)
        togglePinned({ id: noteId }).then(() => setPinning(false))
    }

    const onCardClick = () => router.push('/notes/'.concat(note._id))

    return (
        <Card
            key={note._id}
            className="flex-1 break-inside-avoid border shadow border-gray-30 h-fit hover:bg-card/50 cursor-pointer"
            onClick={onCardClick}
        >
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
                <p>Created at: {formatDate(new Date(note._creationTime))}</p>
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
    )
}

export default NoteCard