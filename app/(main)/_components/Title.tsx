'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useMutation } from "convex/react"
import { useParams, useRouter } from "next/navigation"
import { useState, useRef } from "react"

type TitleProps = {
    initialData: Doc<'notes'>
}

const Title = ({ initialData }: TitleProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState(initialData.title || "Untitled")

    const params = useParams()
    const router = useRouter()
    const update = useMutation(api.notes.update)

    const inputRef = useRef<HTMLInputElement>(null)


    const onTitleClick = () => {
        if (params.noteId !== initialData._id) {
            router.push('/notes/'.concat(initialData._id))
        } else {
            setTitle(initialData.title)
            setIsEditing(true)
            setTimeout(() => {
                inputRef.current?.focus()
                inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
            }, 0);
        }
    }

    const disableInput = () => {
        setIsEditing(false)
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
        update({
            id: initialData._id,
            title: e.target.value || "Untitled"
        })
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            disableInput()
        }

    }

    return (
        <div className="flex items-center gap-x-1">
            {!!initialData.icon && <p>{initialData.icon}</p>}
            {isEditing ? (
                <Input
                    ref={inputRef}
                    onClick={onTitleClick}
                    onBlur={disableInput}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={title}
                    className="h-7 px-2 focus-visible:ring-transparent w-36"
                />
            ) : (
                <Button
                    onClick={onTitleClick}
                    variant={'ghost'}
                    size={'sm'}
                    className={cn("font-normal h-auto p-1 text-sm px-2", 
                    params.noteId === initialData._id && "bg-secondary")}
                >
                    <span className="truncate">
                        {initialData.title}
                    </span>
                </Button>
            )}
        </div>
    )
}

export default Title