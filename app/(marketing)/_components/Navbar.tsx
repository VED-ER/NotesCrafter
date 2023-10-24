'use client'
import { useScrollTop } from '@/hooks/useScrollTop'
import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import Logo from '../../../components/Logo'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/theme-mode-toggle'
import { useConvexAuth } from 'convex/react'
import { SignInButton, UserButton } from '@clerk/clerk-react'
import { Spinner } from '@/components/Spinner'
import Link from 'next/link'
import { MenuIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

const Navbar = () => {
    const [showMenu, setShowMenu] = useState(false)
    const { isAuthenticated, isLoading } = useConvexAuth()
    const scrolled = useScrollTop(10)
    const pathname = usePathname()

    useEffect(() => {
        setShowMenu(false)
    }, [pathname])

    return (
        <nav className={cn("p-5 fixed top-0 bg-background w-full z-50", scrolled && 'border-b shadow')}>
            <div className="flex items-center justify-between">
                <div className="flex w-full md:w-auto justify-between items-center ">
                    <Logo />

                    <div className='flex md:hidden ms-auto space-x-3 items-center'>
                        <ModeToggle />
                        <Button onClick={() => setShowMenu(prev => !prev)} >
                            <MenuIcon className='h-6 w-6 text-muted' />
                        </Button>
                    </div>
                </div>

                <div className={cn("hidden md:flex z-[-1] md:z-auto top-[76px]  flex-col md:flex-row md:items-center  md:static bg-background w-full md:w-auto left-0 px-5 md:px-0 md:py-0 pb-4 md:pb-0 space-y-2 md:space-y-0 opacity-0 md:opacity-100 transition-all ease-in duration-200", showMenu && " opacity-100 absolute flex shadow md:shadow-none")}>
                    <Button variant={'ghost'} asChild>
                        <Link href={'/about'}>About</Link>
                    </Button>
                    <Button variant={'ghost'} asChild>
                        <Link href={'/careers'}>Careers</Link>
                    </Button>
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
                            <Button className="mr-3" variant={'default'} asChild>
                                <Link href={'/notes'}>Enter NotesCrafter</Link>
                            </Button>
                            <div className='mx-auto md:mx-0'>
                            <UserButton afterSignOutUrl='/' />
                            </div>
                        </>
                    )}
                    <div className='hidden md:block ml-3'>
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </nav>
    )

    return (
        <>

            <div className={cn('z-50 bg-background fixed top-0 flex items-center w-full p-6',
                scrolled && 'border-b shadow-sm')}>
                <Logo />

                <Button onClick={() => setShowMenu(true)} className='md:hidden ms-auto'>
                    <MenuIcon className='h-6 w-6 text-muted' />
                </Button>

                <div className={cn('ms-auto flex flex-col md:flex-row md:items-center',
                    showMenu && "fixed top-[84px] bg-secondary w-[calc(100%-48px)] ")}>
                    <Button variant={'ghost'} asChild>
                        <Link href={'/about'}>About</Link>
                    </Button>
                    <Button variant={'ghost'} asChild>
                        <Link href={'/careers'}>Careers</Link>
                    </Button>
                    <div className='space-x-3 flex flex-col md:flex-row justify-between items-center'>
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
                                <Button variant={'default'} asChild>
                                    <Link href={'/notes'}>Enter NotesCrafter</Link>
                                </Button>
                                <UserButton afterSignOutUrl='/' />
                            </>
                        )}
                        <ModeToggle />
                    </div>
                </div>
            </div>
            {/* {showMenu && <div className={cn('z-50 bg-background fixed top-0 flex items-center w-full p-6',
                scrolled && 'border-b shadow-sm')}>
                <div className='md:ms-auto flex flex-col md:flex-row align-center'>
                    <Button variant={'ghost'} asChild>
                        <Link href={'/about'}>About</Link>
                    </Button>
                    <Button variant={'ghost'} asChild>
                        <Link href={'/careers'}>Careers</Link>
                    </Button>
                    <div className='space-x-3 flex justify-between items-center'>
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
                                <Button variant={'default'} asChild>
                                    <Link href={'/notes'}>Enter NotesCrafter</Link>
                                </Button>
                                <UserButton afterSignOutUrl='/' />
                            </>
                        )}
                        <ModeToggle />
                    </div>
                </div>
            </div>} */}
        </>
    )
}

export default Navbar