'use client'

import { Spinner } from '@/components/Spinner'
import { useConvexAuth } from 'convex/react'
import { redirect } from 'next/navigation'
import Navigation from './_components/Navigation'
import SearchCommand from '@/components/SearchCommand'
// any route inside of "main" is protected
const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useConvexAuth()

    if (isLoading) {
        return (
            <div className='flex items-center justify-center h-full'>
                <Spinner size={'lg'} />
            </div>
        )
    }

    if (!isAuthenticated) {
        return redirect('/')
    }

    return (
        <div className='h-full flex bg-secondary'>
            <Navigation />
            <main className='flex-1 h-full overflow-y-auto'>
                <SearchCommand />
                {children}
            </main>
        </div>
    )
}

export default MainLayout