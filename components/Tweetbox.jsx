'use client'

import { createClient } from '@/utils/supabase/client'
import { Image, User, X } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'

const Tweetbox = ({ user }) => {
    const supabase = createClient();

    // Form state
    const [tweet, setTweet] = useState('')
    const [file, setFile] = useState(null); //INPUT FILE
    const [filePreview, setFilePreview] = useState(null); //FILE PREVIEW
    const [uploading, setUploading] = useState(false); //UPLOAD STATE
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [currentImage, setCurrentImage] = useState(null) //current profile image

    // 1. Handle file selection
    const handleFileSelect = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setError(null);

        if (selectedFile && selectedFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setFilePreview(null);
        }
    };

    // 2. Combined submit handler for both textpost and image
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError(null);
            setUploading(true);

            // Validate form
            if (!tweet) {
                throw new Error('Please enter a bant');
            }

            let imageUrl = null;

            // If there's a file, upload it first
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                // Upload file to storage with error logging
                const { data: fileData, error: uploadError } = await supabase.storage
                    .from('posts')
                    .upload(filePath, file);

                if (uploadError) {
                    console.error('Storage upload error:', uploadError);
                    throw new Error(`Storage upload failed: ${uploadError.message}`);
                }

                // Get public URL
                const { data: { publicUrl }, error: urlError } = supabase.storage
                    .from('posts')
                    .getPublicUrl(filePath);

                if (urlError) {
                    console.error('Public URL generation error:', urlError);
                    throw new Error(`Failed to get public URL: ${urlError.message}`);
                }

                imageUrl = publicUrl;
            }

            // Create post FOR tweet and image URL if one was uploaded
            const { data, error: postError } = await supabase
                .from('posts')
                .insert([
                    {
                        tweet,
                        image_url: imageUrl
                    }
                ])
                .select();

            if (postError) {
                console.error('Post insertion error:', postError);
                throw new Error(`Post creation failed: ${postError.message}`);
            }

            // Reset form on success
            setTweet('');
            setFile(null);
            setFilePreview(null);
            setSuccess('Post created successfully!');

        } catch (error) {
            console.error('Full error object:', error);

            if (!user) {
                setError(' Error encountered yapping, Please login')
            } else {
                setError('An error has occured');
            }
        } finally {
            setUploading(false);
        }
    };


    // Get current PROFILE image
    const getProfile = useCallback(async () => {
        try {
            setUploading(true)

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`avatar_url`)
                .eq('id', user?.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setCurrentImage(data.avatar_url)

            }
        } catch (error) {
            setError('Error loading user data!')
        } finally {
            setUploading(false)
        }
    }, [user, supabase])

    useEffect(() => {
        getProfile()
    }, [user, getProfile])


    return (

        <div className=' border-t border-b mt-3 p-3 '>
            <div className='flex items-start gap-2 w-[90%] mx-auto' >

                {currentImage ? (<img src={currentImage} alt="altt" className='rounded-full w-10 h-10' />) : <User className='bg-slate-400 text-slate-300 rounded-full w-10 h-10' />}

                <form className='w-[80%]' onSubmit={handleSubmit}>

                    <textarea name="tweet" id="tweet"
                        value={tweet}
                        maxLength={200}
                        onChange={(e) => setTweet(e.target.value)}
                        placeholder='What happening'
                        style={{
                            resize: 'none', // Prevent resizing
                            overflow: 'hidden', // Handle scrolling if text exceeds the visible area
                        }}
                        className='outline-none p-2 w-full rounded-2xl border-gray-300 dark:bg-slate-200 dark:text-black text-wrap'
                    />

                    <div className="flex items-center justify-between border-t pt-3 mt-3">
                        {/* File input trigger */}
                        <div className="p-6">
                            <label htmlFor="file-upload" className="cursor-pointer block text-center">
                                <span> <Image className='text-blue-400' /></span>
                            </label>
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setFile(file);
                                        setFilePreview(URL.createObjectURL(file));
                                    }
                                }}
                                accept="image/*"
                            />
                        </div>

                        {/* Image preview with close button */}
                        {filePreview && (
                            <div className="relative inline-block ml-4 mb-4">
                                <img
                                    src={filePreview}
                                    alt="Preview"
                                    className="max-h-48 mx-auto mb-4"
                                />
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setFilePreview(null);
                                    }}
                                    aria-label="Remove image"
                                    className="absolute top-2 right-2 text-white rounded-full p-1 bg-black"
                                >
                                    <X className='size-4' />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className='flex justify-end items-end -mt-5'>
                        <button
                            type='submit'
                            disabled={uploading}
                            className=' py-2 px-4 text-sm rounded-2xl bg-[#825cff] text-white font-bold'>

                            {uploading ? 'Creating post...' : 'Create post'}
                        </button>
                    </div>
                </form>



            </div>

            {/* Error display */}
            {error ? (
                <div className="text-red-500 text-sm text-center">
                    {error}
                </div>
            ) :

                <div className="text-blue-500 text-sm text-center">
                    {success}
                </div>
            }

        </div>
    )
}

export default Tweetbox