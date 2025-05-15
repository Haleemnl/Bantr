// 'use client'

// import React, { useEffect, useState } from 'react'
// import Tweetbox from './Tweetbox'
// import { createClient } from '@/utils/supabase/client'
// import Image from 'next/image'
// import { DropDownMenu } from './DropDownMenu'
// import { User } from 'lucide-react'
// import { PostSkeleton } from './loaders/PostSkeleton'
// import SubscriberLogic from './SubscriberLogic'

// const Middle = ({ user }) => {

//     const supabase = createClient()

//     const [posts, setPosts] = useState([])
//     const [loading, setLoading] = useState()
//     const [error, setError] = useState('')

//     // get posts
//     useEffect(() => {
//         // Initial fetch of posts
//         const fetchPosts = async () => {
//             try {
//                 setLoading(true)

//                 let { data: posts, error } = await supabase
//                     .from('posts')
//                     .select(`*, profiles( username,avatar_url )`)
//                     // .select(`*, profiles( username,avatar_url ), subscription(userId)`)
//                     .order('created_at', { ascending: false })

//                 if (error) {
//                     throw error
//                 }

//                 if (posts) {
//                     console.log(posts);
//                     setPosts(posts)

//                 }
//             } catch (error) {
//                 setError('Failed to fetch posts')
//             } finally {
//                 setLoading(false)
//             }
//         }
//         // Initial fetch
//         fetchPosts()


//         // Set up real-time subscription
//         const channel = supabase
//             .channel('posts-changes')
//             .on(
//                 'postgres_changes',
//                 {
//                     event: '*',
//                     schema: 'public',
//                     table: 'posts'
//                 },
//                 async (payload) => {
//                     console.log('Change received!', payload)

//                     switch (payload.eventType) {
//                         case 'INSERT':
//                             // Fetch the complete new post with profile information
//                             const { data: newPost, error } = await supabase
//                                 .from('posts')
//                                 .select(`*, profiles (username,avatar_url)`)
//                                 .eq('id', payload.new.id)
//                                 .single()

//                             if (!error && newPost) {
//                                 // Add new post to the beginning of the list
//                                 setPosts(prevPosts => [newPost, ...prevPosts])
//                             }
//                             break
//                         case 'DELETE':
//                             // Remove deleted post from the list
//                             setPosts(prevPosts =>
//                                 prevPosts.filter(post => post.id !== payload.old.id)
//                             )
//                             break
//                         case 'UPDATE':
//                             // Update existing post in the list
//                             setPosts(prevPosts =>
//                                 prevPosts.map(post =>
//                                     post.id === payload.new.id ? payload.new : post
//                                 )
//                             )
//                             break
//                     }
//                 }
//             )
//             .subscribe()

//         // Cleanup subscription when component unmounts
//         return () => {
//             supabase.removeChannel(channel)
//         }
//     }, [])


//     const [subs, setSubs] = useState([])
//     //Simple CLIENT data fetching
//     useEffect(() => {

//         try {
//             const getsubs = async () => {

//                 let { data: subs, error } = await supabase
//                     .from('subscription')
//                     .select('*')
//                 // .eq('userId', user.id)

//                 if (error) {
//                     throw new Error("error");
//                 }
//                 if (subs) {
//                     setSubs(subs)
//                 }
//             }

//             getsubs()

//         } catch (error) {
//             // setError('error')
//             throw new Error(error.message);

//         } finally {
//             // setLoading(false)
//         }

//     }, [])


//     return (

//         <div className='col-span-3 md:col-span-2 border-r border-l flex flex-col overflow-y-auto overscroll-none bg-slate-100 dark:bg-gray-900'>

//             {/* home header */}
//             <div className='flex items-center justify-between mt-3'>
//                 <h1 className='font-bold text-lg ml-3'>Home</h1>
//                 {!user && <a href="/login"> <span className='mr-5 rounded-xl text-[#825cff] border-[#825cff] border px-5 hover:text-white hover:bg-[#825cff]'>login</span></a>}
//             </div>

//             {user && <p className='ml-3 text-sm'>welcome {user.user_metadata.full_name}</p>}



//             {/* Tweet input box */}
//             <Tweetbox
//                 user={user}
//             />

//             <div className='w-full h-3 bg-gray-300'></div>

//             {/* TWEETS */}
//             {error && <p className='text-red-500'>{error}</p>}

//             {loading ? <PostSkeleton /> :
//                 posts.map(({ id, user_id, image_url, tweet, profiles }) => (

//                     <div key={id} className=' border-b p-5 bg-slate-100 dark:bg-black w-[90%] mx-auto flex items-start justify-start gap-3 my-2 shadow-lg rounded-3xl'>

//                         {/* profile photo */}
//                         {profiles.avatar_url ? (
//                             <img
//                                 src={profiles?.avatar_url}
//                                 alt="profile-photo"
//                                 className='rounded-full w-10 h-10'
//                             />
//                         ) :
//                             <User className='bg-slate-400 text-slate-300 rounded-full w-10 h-10' />
//                         }

//                         <div className='w-full'>


//                             <div className='flex items-center gap-1'>
//                                 <p className='text-sm font-bold font-serif'>
//                                     @{profiles?.username || 'user'}
//                                 </p>

//                                 {
//                                     subs.map((sub) => (
//                                         sub?.userId == user?.id &&
//                                         <SubscriberLogic />
//                                     ))

//                                 }

//                                 {
//                                     user_id == user?.id &&
//                                     <DropDownMenu
//                                         postId={id}
//                                     />
//                                 }

//                                 {/* <SubscriberLogic user={user} /> */}



//                             </div>



//                             <p className='text-sm mb-3'>{tweet}</p>
//                             {image_url &&
//                                 <Image
//                                     width={600}
//                                     height={600}
//                                     src={image_url}
//                                     alt="post-image"
//                                     className='object-cover w-full h-[300px] rounded-lg' />
//                             }

//                         </div>


//                         {/* post options  (...) */}
//                         {user_id == user?.id && (
//                             <DropDownMenu
//                                 postId={id}
//                             />)

//                         }

//                     </div>

//                 ))}


//         </div>
//     )
// }

// export default Middle














































'use client'

import React, { useEffect, useState } from 'react'
import Tweetbox from './Tweetbox'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { DropDownMenu } from './DropDownMenu'
import { User } from 'lucide-react'
import { PostSkeleton } from './loaders/PostSkeleton'
import SubscriberBadge from './SubscriberBadge '

const Middle = ({ user }) => {

    const supabase = createClient()

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [subscriptions, setSubscriptions] = useState([])

    // get posts
    useEffect(() => {
        // Initial fetch of posts
        const fetchPosts = async () => {
            try {
                setLoading(true)

                let { data: posts, error } = await supabase
                    .from('posts')
                    .select(`*, profiles( username,avatar_url )`)
                    .order('created_at', { ascending: false })

                if (error) {
                    throw error
                }

                if (posts) {
                    console.log(posts);
                    setPosts(posts)
                }
            } catch (error) {
                setError('Failed to fetch posts')
            } finally {
                setLoading(false)
            }
        }
        // Initial fetch
        fetchPosts()

        // Set up real-time subscription
        const channel = supabase
            .channel('posts-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'posts'
                },
                async (payload) => {
                    console.log('Change received!', payload)

                    switch (payload.eventType) {
                        case 'INSERT':
                            // Fetch the complete new post with profile information
                            const { data: newPost, error } = await supabase
                                .from('posts')
                                .select(`*, profiles (username,avatar_url)`)
                                .eq('id', payload.new.id)
                                .single()

                            if (!error && newPost) {
                                // Add new post to the beginning of the list
                                setPosts(prevPosts => [newPost, ...prevPosts])
                            }
                            break
                        case 'DELETE':
                            // Remove deleted post from the list
                            setPosts(prevPosts =>
                                prevPosts.filter(post => post.id !== payload.old.id)
                            )
                            break
                        case 'UPDATE':
                            // Update existing post in the list
                            setPosts(prevPosts =>
                                prevPosts.map(post =>
                                    post.id === payload.new.id ? payload.new : post
                                )
                            )
                            break
                    }
                }
            )
            .subscribe()

        // Cleanup subscription when component unmounts
        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    // Fetch subscriptions
    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                let { data, error } = await supabase
                    .from('subscription')
                    .select('*')

                if (error) {
                    throw error
                }

                if (data) {
                    setSubscriptions(data)
                }
            } catch (error) {
                console.error('Error fetching subscriptions:', error.message)
            }
        }

        fetchSubscriptions()
    }, [])

    return (
        <div className='col-span-3 md:col-span-2 border-r border-l flex flex-col overflow-y-auto overscroll-none bg-slate-100 dark:bg-gray-900'>

            {/* home header */}
            <div className='flex items-center justify-between mt-3'>
                <h1 className='font-bold text-lg ml-3'>Home</h1>
                {!user && <a href="/login"> <span className='mr-5 rounded-xl text-[#825cff] border-[#825cff] border px-5 hover:text-white hover:bg-[#825cff]'>login</span></a>}
            </div>

            {user && <p className='ml-3 text-sm'>welcome {user.user_metadata.full_name}</p>}

            {/* Tweet input box */}
            <Tweetbox
                user={user}
            />

            <div className='w-full h-3 bg-gray-300'></div>

            {/* TWEETS */}
            {error && <p className='text-red-500'>{error}</p>}

            {loading ? <PostSkeleton /> :
                posts.map(({ id, user_id, image_url, tweet, profiles }) => (

                    <div key={id} className='border-b p-5 bg-slate-100 dark:bg-black w-[90%] mx-auto flex items-start justify-start gap-3 my-2 shadow-lg rounded-3xl'>

                        {/* profile photo */}
                        {profiles.avatar_url ? (
                            <img
                                src={profiles?.avatar_url}
                                alt="profile-photo"
                                className='rounded-full w-10 h-10'
                            />
                        ) :
                            <User className='bg-slate-400 text-slate-300 rounded-full w-10 h-10' />
                        }

                        <div className='w-full'>
                            <div className='flex items-center gap-1'>
                                <p className='text-sm font-bold font-serif'>
                                    @{profiles?.username || 'user'}
                                </p>

                                {/* Show verification badge if user has subscription */}
                                <SubscriberBadge
                                    userId={user_id}
                                    subscriptions={subscriptions}
                                />

                            </div>

                            <p className='text-sm mb-3'>{tweet}</p>
                            {image_url &&
                                <Image
                                    width={600}
                                    height={600}
                                    src={image_url}
                                    alt="post-image"
                                    className='object-cover w-full h-[300px] rounded-lg' />
                            }
                        </div>


                        {/* Show dropdown menu if post belongs to current user */}
                        {user_id === user?.id && (
                            <DropDownMenu postId={id} />
                        )}



                    </div>
                ))}
        </div>
    )
}

export default Middle