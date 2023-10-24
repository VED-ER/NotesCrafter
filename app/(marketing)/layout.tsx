import React from 'react'
import Navbar from './_components/Navbar'
import Footer from './_components/Footer'

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='h-full'>
            <Navbar />
            <main className='h-full flex flex-col pt-40'>
                <div className='flex-1'>
                {children}
                </div>
                <Footer />
            </main>
        </div>
    )
}

export default MarketingLayout