'use client'

import { cn } from "@/lib/utils"
import Image from "next/image"
import { Button } from "./ui/button"
import { ImageIcon, X } from "lucide-react"
import { useCoverImage } from "@/hooks/useCoverImage"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import { useEdgeStore } from "@/lib/edgestore"
import { Skeleton } from "./ui/skeleton"
import { useMediaQuery } from "usehooks-ts"

type CoverProps = {
    url?: string,
    preview?: boolean
}

const Cover = ({ url, preview }: CoverProps) => {
    const isMobile = useMediaQuery("(max-width: 768px)")
    const coverImage = useCoverImage()
    const removeCoverImage = useMutation(api.notes.removeCoverImage)

    const params = useParams()
    const { edgestore } = useEdgeStore()

    const onRemoveCoverImage = async () => {
        if (url) {
            await edgestore.publicFiles.delete({ url: url })
        }
        removeCoverImage({ id: params.noteId as Id<'notes'> })
    }

    return (
        <div className={cn("relative w-full h-[35vh] group", !url && "h-[12vh]", url && "bg-muted")}>
            {!!url && (
                <Image
                    src={url}
                    fill
                    alt="cover"
                    className="object-cover"
                />
            )}
            {url && !preview && (
                <div className={cn("opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2", isMobile && "opacity-100")}>
                    <Button onClick={() => coverImage.onReplace(url)} className="text-muted-foreground text-xs" variant={'outline'} size={'sm'}>
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Change cover
                    </Button>
                    <Button onClick={onRemoveCoverImage} className="text-muted-foreground text-xs" variant={'outline'} size={'sm'}>
                        <X className="w-4 h-4 mr-2" />
                        Remove cover
                    </Button>
                </div>
            )}
        </div>
    )
}

Cover.Skeleton = function () {
    return (
        <Skeleton className="w-full h-[35vh]" />
    )
}

export default Cover