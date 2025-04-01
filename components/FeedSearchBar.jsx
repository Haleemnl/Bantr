'use client'

import React from 'react'
import SearchFormReset from './SearchFormReset'
import { SearchIcon } from 'lucide-react'

const FeedSearchBar = ({ query }) => {
    return (
        <form
            action="/"
            // scroll={false}
            className='flex items-center gap-2 '
        >

            <input
                name='query'
                defaultValue={query}
                className='border rounded-full w-[90%]  p-2 mb-5'
                placeholder='Search Yaps!'
            />

            <div className='flex gap-2'>

                {/* IN HERE, if query exists, then it should show the SearchFormReset button  */}
                {query && <SearchFormReset />}

                <button type='submit' className='search-btn text-black'><SearchIcon className='size-4' /></button>
            </div>

        </form>
    )
}

export default FeedSearchBar