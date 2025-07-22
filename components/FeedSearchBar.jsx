// 'use client'

// import React from 'react'
// import SearchFormReset from './SearchFormReset'
// import { SearchIcon } from 'lucide-react'

// const FeedSearchBar = ({ query }) => {
//     return (
//         <form
//             action="/"
//             // scroll={false}
//             className='flex items-center gap-2 '
//         >

//             <input
//                 name='query'
//                 defaultValue={query}
//                 className='border rounded-full w-[90%]  p-2 mb-5'
//                 placeholder='Search Yaps!'
//             />

//             <div className='flex gap-2'>

//                 {/* IN HERE, if query exists, then it should show the SearchFormReset button  */}
//                 {query && <SearchFormReset />}

//                 <button type='submit' className='search-btn text-black'><SearchIcon className='size-4' /></button>
//             </div>

//         </form>
//     )
// }

// export default FeedSearchBar










'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formUrlQuery, removeKeysFromUrlQuery, } from "@jsmastery/utils";
import { Search } from "lucide-react";

const FeedSearchBar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('tweet') || '';

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        //delayed search request to db by 500millsec
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: "tweet",
                    value: searchQuery,
                });

                router.push(newUrl, { scroll: false });
            } else {
                if (pathname === '/') {
                    const newUrl = removeKeysFromUrlQuery({
                        params: searchParams.toString(),
                        keysToRemove: ["tweet"],
                    });

                    router.push(newUrl, { scroll: false });
                }
            }
        }, 500)


    }, [searchQuery, router, searchParams, pathname]);

    return (
        <div className="relative border border-black rounded-lg items-center flex gap-2 px-2 py-1 h-fit">

            <Search className="w-5 h-5" />
            <input
                placeholder="Search companions..."
                className="outline-none border rounded-full w-[90%]  p-2 mb-5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    )
}
export default FeedSearchBar