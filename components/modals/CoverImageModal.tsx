'use client'

import { useCoverImage } from "@/hooks/useCoverImage"
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog"
import { SingleImageDropzone } from "../SingleImageDropzone"
import { useState } from "react"
import { useEdgeStore } from "@/lib/edgestore"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"


const CoverImageModal = () => {
    const [file, setFile] = useState<File>()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const update = useMutation(api.notes.update)
    const { edgestore } = useEdgeStore()
    const coverImage = useCoverImage()
    const params = useParams()

    const onChange = async (file?: File) => {
        if (file) {
            setIsSubmitting(true)
            setFile(file)

            const res = await edgestore.publicFiles.upload({ file, options: { replaceTargetUrl: coverImage.url } })

            await update({ id: params.noteId as Id<'notes'>, coverImage: res.url })
        }

        onClose()
    }

    const onClose = () => {
        setFile(undefined)
        setIsSubmitting(false)
        coverImage.onClose()
    }

    return (
        <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
            <DialogContent>
                <DialogHeader>
                    <h2 className="text-center text-lg font-semibold">Cover Image</h2>
                </DialogHeader>
                <SingleImageDropzone
                    className="w-full outline-none"
                    disabled={isSubmitting}
                    value={file}
                    onChange={onChange}

                />
            </DialogContent>
        </Dialog>
    )
}

export default CoverImageModal