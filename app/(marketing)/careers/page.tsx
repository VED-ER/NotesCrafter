'use client'

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

const CareersPage = () => {
    return (
        <div className="h-full bg-background flex flex-col items-center justify-center space-y-4">
            <Image
                src={'/error.png'}
                width={300}
                height={300}
                alt="error image"
                className="dark:hidden"
            />
            <Image
                src={'/error-dark.png'}
                width={300}
                height={300}
                alt="error image"
                className="hidden dark:block"
            />
            <h2 className="text-xl text-center px-10 font-medium">Unfortunately, we do not have any openings, please check again later</h2>
            <Button asChild>
                <Link href={'/'}>
                    Go Back
                </Link>
            </Button>
        </div>
    )
}

export default CareersPage