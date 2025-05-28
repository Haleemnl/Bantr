

'use client'

import React, { useEffect, useState } from 'react'
import Tweetbox from './Tweetbox'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { DropDownMenu } from './DropDownMenu'
import { User } from 'lucide-react'
import { PostSkeleton } from './loaders/PostSkeleton'
import SubscriberBadge from './SubscriberBadge '
import { LikeButton } from './LikeButton'

const Middle = ({ user }) => {

    const supabase = createClient()

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [subscriptions, setSubscriptions] = useState([])

    // get posts
    useEffect(() => {
        // Initial fetch of posts
        // Replace your existing fetchPosts function with this:
        const fetchPosts = async () => {
            try {
                setLoading(true)

                let { data: posts, error } = await supabase
                    .from('posts')
                    .select(`*, profiles( username,avatar_url ),likes(id,user_id)`)
                    .order('created_at', { ascending: false })

                if (error) {
                    throw error
                }

                if (posts) {
                    // Transform posts to include like count and user's like status
                    const postsWithLikes = posts.map(post => ({
                        ...post,
                        likeCount: post.likes?.length || 0,
                        isLikedByUser: post.likes?.some(like => like.user_id === user?.id) || false
                    }))

                    console.log(postsWithLikes);
                    setPosts(postsWithLikes)
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
                            // Fetch the complete new post with profile and likes information
                            const { data: newPost, error } = await supabase
                                .from('posts')
                                .select(`*, profiles (username,avatar_url), likes(id,user_id)`)
                                .eq('id', payload.new.id)
                                .single()

                            if (!error && newPost) {
                                // Transform the new post to include like data
                                const postWithLikes = {
                                    ...newPost,
                                    likeCount: newPost.likes?.length || 0,
                                    isLikedByUser: newPost.likes?.some(like => like.user_id === user?.id) || false
                                }
                                // Add new post to the beginning of the list
                                setPosts(prevPosts => [postWithLikes, ...prevPosts])
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
        <div className='col-span-3 md:col-span-2 border-r border-l flex flex-col overflow-y-auto overscroll-none bg-slate-100 dark:bg-black'>

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

            {/* 👉🏽 TWEETS */}
            {error && <p className='text-red-500'>{error}</p>}

            {loading ? <PostSkeleton /> :
                posts.map(({ id, user_id, image_url, tweet, profiles, likeCount, isLikedByUser }) => (
                    <div key={id} className='px- w-full'>
                        <div className=' md:border-r-2 border-gray-300 dark:border-gray-800  p-5 w-[95%]'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center space-x-2'>
                                    <div>
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
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <p className='text-sm font-bold font-serif'>
                                            @{profiles?.username || 'user'}
                                        </p>
                                        <SubscriberBadge
                                            userId={user_id}
                                            subscriptions={subscriptions}
                                        />
                                    </div>
                                </div>
                                {user_id === user?.id && (
                                    <DropDownMenu postId={id} />
                                )}
                            </div>
                            <div className='ml-12'>
                                <p className='text-sm mb-3'>{tweet}</p>
                                {image_url &&
                                    <div className='max-w-md mx-auto '>
                                        <Image
                                            width={600}
                                            height={600}
                                            src={image_url}
                                            alt="post-image"
                                            className='w-full max-h-[400px] object-fill border rounded-xl'
                                        />
                                    </div>
                                }
                            </div>
                            {/* Like Button */}
                            <div className='ml-12 mt-3'>
                                <LikeButton
                                    postId={id}
                                    userId={user?.id}
                                    initialLikeCount={likeCount}
                                    initialIsLiked={isLikedByUser}
                                />
                            </div>
                        </div>
                        <hr className='w-full md:w-[95%] ' />
                    </div>
                ))
            }
        </div>
    )
}

export default Middle