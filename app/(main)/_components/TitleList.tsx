import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import Title from "./Title"
import { ChevronRightIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { WheelEvent, useEffect, useRef } from "react"

type TitleListProps = {
    note: Doc<'notes'>
}
const TitleList = ({ note }: TitleListProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const notes = useQuery(api.notes.getAllParents, {
        noteId: note._id
    })

    useEffect(() => {
        if (notes && notes?.length > 1 && containerRef.current && containerRef.current?.scrollWidth > containerRef.current?.clientWidth) {
            containerRef.current.scrollTo({
                top: 0,
                left: containerRef.current.scrollWidth,
                behavior: 'instant'
            })
        }
    }, [notes])

    const handleScroll = (event: WheelEvent<HTMLDivElement>) => {
        const scrollAmount = event.deltaY;
        containerRef.current?.scrollTo
        containerRef.current?.scrollTo({
            top: 0,
            left: containerRef.current.scrollLeft + scrollAmount,
            behavior: 'smooth',
        });
    };

    if (notes === undefined) {
        return (
            <Skeleton className="h-5 w-full" />
        )
    }

    return (
        <div
            className="flex items-center space-x-1 max-w-[90%] thin-scrollbar overflow-x-auto"
            onWheel={handleScroll}
            ref={containerRef}
        >
            {notes.map((note, idx) => (
                <div className="flex items-center space-x-1">
                    <Title key={note._id} initialData={note} />
                    {idx !== notes.length - 1 && <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />}
                </div>
            ))}
        </div>
    )
}

export default TitleList