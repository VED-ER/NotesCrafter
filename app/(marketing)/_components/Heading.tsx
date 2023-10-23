'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useConvexAuth } from 'convex/react'
import { Spinner } from '@/components/Spinner'
import Link from 'next/link'
import { SignInButton } from '@clerk/clerk-react'

const Heading = () => {
    const { isAuthenticated, isLoading } = useConvexAuth()

    return (
        <div className='max-w-3xl space-y-4'>
            <h1 className='text-3xl sm:text-5xl md:text-6xl font-bold'>Collect Your Thoughts. Simple & Easy</h1>
            <h3 className='text-base sm:text-xl md:text-2xl font-medium'>Take notes the simple way for free.<br />
                Forever.
            </h3>
            {isLoading && (
                <div className='w-full flex items-center justify-center'>
                    <Spinner size={'lg'} />
                </div>
            )}
            {isAuthenticated && !isLoading && (
                <Button asChild>
                    <Link href={'/notes'}>
                        Enter NotesCrafter
                        <ArrowRight className='w-5 h-5 ml-2' />
                    </Link>
                </Button>
            )}
            {!isAuthenticated && !isLoading && (
                <SignInButton mode='modal'>
                    <Button className=''>
                        Get NotesCrafter for free
                        <ArrowRight className='w-5 h-5 ml-2' />
                    </Button>
                </SignInButton>
            )}
        </div>
    )
}

export default Heading