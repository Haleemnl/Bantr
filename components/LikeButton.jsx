'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast, Toaster } from 'sonner'


export function LikeButton({ postId, userId, initialLikeCount = 0, initialIsLiked = false }) {
    const [likeCount, setLikeCount] = useState(initialLikeCount)
    const [isLiked, setIsLiked] = useState(initialIsLiked)
    const [isLoading, setIsLoading] = useState(false)

    const supabase = createClient()

    const handleLike = async () => {
        if (!userId) {
            // Handle unauthenticated user - maybe show login modal
            toast.error('Please log in to like posts')
            return
        }

        setIsLoading(true)

        try {
            if (isLiked) {
                // Unlike: Remove like from database
                const { error } = await supabase
                    .from('likes')
                    .delete()
                    .eq('user_id', userId)
                    .eq('post_id', postId)

                if (error) throw error

                setIsLiked(false)
                setLikeCount(prev => prev - 1)
            } else {
                // Like: Add like to database
                const { error } = await supabase
                    .from('likes')
                    .insert({
                        user_id: userId,
                        post_id: postId
                    })

                if (error) throw error

                setIsLiked(true)
                setLikeCount(prev => prev + 1)
            }
        } catch (error) {
            console.error('Error toggling like:', error)
            // Revert optimistic update on error
            setIsLiked(!isLiked)
            setLikeCount(prev => isLiked ? prev + 1 : prev - 1)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleLike}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors duration-200 ${isLiked
                ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-500'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <Heart
                className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
            />
            <span className="text-sm font-medium">
                {likeCount > 0 ? likeCount : ''}
            </span>
        </button>
    )
}