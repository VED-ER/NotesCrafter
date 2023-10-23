'use client'

import { cn } from '@/lib/utils'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const font = Poppins({
    subsets: ['latin'],
    weight: ['400', '600']
})

const Logo = () => {
    const router = useRouter()

    return (
        <div
            role='button'
            onClick={() => router.push('/')}
            className='hidden md:flex items-center gap-x-2'
        >
            <Image
                src={'/logo.png'}
                height={35}
                width={35}
                alt='logo'
                className='dark:hidden'
            />
            <Image
                src={'/logo-dark.png'}
                height={35}
                width={35}
                alt='logo'
                className='hidden dark:block'
            />
            <p className={cn('font-semibold text-lg', font.className)}>NotesCrafter</p>
        </div>
    )
}

export default Logo