import React from 'react'
import Logo from './Logo'
import { Button } from '@/components/ui/button'

const Footer = () => {
    return (
        <div className='w-full flex items-center p-6 bg-background z-50 dark:bg-[#1e1e1e]'>
            <Logo />
            <div className='flex md:ml-auto justify-between w-full md:justify-end'>
                <Button variant={'ghost'} size={'sm'}>
                    Privacy Policy
                </Button>
                <Button variant={'ghost'} size={'sm'}>
                    Terms & Conditions
                </Button>
            </div>
        </div>
    )
}

export default Footer