import React from 'react'
import FeedSearchBar from './FeedSearchBar'

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
            <div className='border border-gray-600 rounded-xl p-2  mr-3 text-sm'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit...
            </div>
        </div>
    )
}

export default Feeds