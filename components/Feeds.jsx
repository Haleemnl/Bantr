import React from 'react'
import FeedSearchBar from './FeedSearchBar'
import { User } from 'lucide-react'
import { getFeedImage, getFeedTweets } from '@/app/action/actions';
import Image from 'next/image';

const Feeds = async ({ searchParams }) => {

    const filters = await searchParams;
    const tweet = filters?.tweet ? filters?.tweet : '';

    const posts = await getFeedTweets({ tweet });
    const images = await getFeedImage()

    return (
        <div className='hidden md:inline col-span-1 h-screen sticky top-0 pt-3'>
            {/* search bar */}

            <FeedSearchBar />

            <div className=' border-b p-2 bg-slate-100 dark:bg-black w-[90%] mx-auto flex items-start justify-start gap-3 my-2 shadow-lg rounded-2xl'>


                <div className='flex flex-col'>
                    {posts.map((post) => (
                        <div key={post.id} className='flex items-start'>




                            {post.image_url ?
                                <>
                                    <Image src={post.image_url} alt={post.post_username} height={40} width={40} className='object-cover rounded-full' />
                                </> : <User className='w-32 bg-gray-500 rounded-full' />}

                            <div className='ml-3'>
                                <h1 className='font-bold text-lg'>{post.post_username}</h1>
                                <p className='text-sm mb-3 line-clamp-2'>{post.tweet}</p>
                            </div>

                        </div>
                    ))}
                </div>
                {/* {images.map((image) => (
                                <>
                                    <img src={image.avatar_url} alt="" />
                                </>
                            ))} */}

            </div>

        </div>
    )
}

export default Feeds