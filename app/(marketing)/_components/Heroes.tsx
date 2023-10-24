import Image from 'next/image'
import React from 'react'

const Heroes = () => {
    return (
        <div className='flex flex-col items-center justify-center max-w-6xl lg:mt-24'>
            <div className='flex items-center flex-col md:flex-row'>
                <div className='relative md:flex-1 w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px]'>
                    <Image
                        src='/notes.png'
                        fill
                        className='object-contain dark:hidden'
                        alt='notes'
                    />
                    <Image
                        src='/notes-dark.png'
                        fill
                        className='object-contain hidden dark:block'
                        alt='notes'
                    />
                </div>
                <div className='flex-1'>
                    <h2 className="text-2xl md:text-left sm:text-3xl md:text-4xl font-semibold">Easy Note Capture</h2>
                    <p className="text-lg sm:text-xl mt-4 md:text-left">Quickly jot down your thoughts, ideas, and to-dos. Our user-friendly interface ensures effortless note capture, so you can stay organized without the hassle.</p>
                </div>
            </div>
            <div className='flex items-center flex-col md:flex-row mt-10 md:mt-0 lg:mt-20'>
                <div className='flex-1 order-2 md:order-1'>
                    <h2 className="text-2xl md:text-left sm:text-3xl md:text-4xl font-semibold">Effortless Note-Taking</h2>
                    <p className="text-lg sm:text-xl mt-4 md:text-left">Seamlessly capture your thoughts and ideas without any learning curve. Our app's intuitive design ensures that note-taking is a breeze, enabling you to stay organized effortlessly.</p>
                </div>
                <div className='relative md:order-2 md:flex-1 w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px]'>
                    <Image
                        src='/reading.png'
                        fill
                        className='object-contain dark:hidden'
                        alt='reading'
                    />
                    <Image
                        src='/reading-dark.png'
                        fill
                        className='object-contain hidden dark:block'
                        alt='reading'
                    />
                </div>

            </div>
        </div>
    )
}

export default Heroes