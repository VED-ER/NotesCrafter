import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import Title from "./Title"
import { ChevronRightIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

type TitleListProps = {
    note: Doc<'notes'>
}
const TitleList = ({ note }: TitleListProps) => {
    const notes = useQuery(api.notes.getAllParents, {
        noteId: note._id
    })

    if (notes === undefined) {
        return (
            <Skeleton className="h-5 w-full" />
        )
    }

    return (
        <div className="flex items-center space-x-1">
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