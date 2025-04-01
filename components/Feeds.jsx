import React from 'react'
import FeedSearchBar from './FeedSearchBar'
import { User } from 'lucide-react'

// Explicitly mark as async server component
const Feeds = async ({ searchParams }) => {
    // Safe way to handle potential undefined query
    const query = searchParams?.query || ''

    return (
        <div className='hidden md:inline col-span-1 h-screen sticky top-0 pt-3'>
            {/* search bar */}
            <FeedSearchBar
                query={query}
            />

            <div className=' border-b p-2 bg-slate-100 dark:bg-black w-[90%] mx-auto flex items-start justify-start gap-3 my-2 shadow-lg rounded-2xl'>

                {/* profile photo */}

                <User className='bg-slate-400 text-slate-300 rounded-full w-10 h-10' />


                <div className='w-full'>

                    <p className='text-sm font-bold font-serif'>{'user'}</p>
                    <p className='text-sm mb-3 line-clamp-2'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, totam!</p>

                </div>

            </div>

        </div>
    )
}

export default Feeds