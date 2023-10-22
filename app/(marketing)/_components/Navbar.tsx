'use client'
import { useScrollTop } from '@/hooks/useScrollTop'
import { cn } from '@/lib/utils'
import React from 'react'
import Logo from './Logo'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/theme-mode-toggle'
import { useConvexAuth } from 'convex/react'
import { SignInButton, UserButton } from '@clerk/clerk-react'
import { Spinner } from '@/components/Spinner'
import Link from 'next/link'

const Navbar = () => {
    const { isAuthenticated, isLoading } = useConvexAuth()
    const scrolled = useScrollTop(10)
    return (
        <div className={cn('z-50 bg-background dark:bg-[#1e1e1e] fixed top-0 flex items-center w-full p-6', scrolled && 'border-b shadow-sm')}>
            <div className='hidden md:block'>
                <Logo />
            </div>
            <div className='space-x-3 md:ml-auto flex justify-between items-center md:justify-end ml-0 w-full'>
                {isLoading && <Spinner />}
                {!isAuthenticated && !isLoading && (
                    <>
                        <SignInButton mode='modal'>
                            <Button variant={'ghost'}>Log in</Button>
                        </SignInButton>
                        <SignInButton mode='modal'>
                            <Button variant={'default'}>Get NotesCrafter for free</Button>
                        </SignInButton>
                    </>
                )}
                {isAuthenticated && !isLoading && (
                    <>
                        <Button variant={'ghost'} asChild>
                            <Link href={'/notes'}>Enter NotesCrafter</Link>
                        </Button>
                        <UserButton afterSignOutUrl='/' />
                    </>
                )}
                <ModeToggle />
            </div>
        </div>
    )
}

export default Navbar