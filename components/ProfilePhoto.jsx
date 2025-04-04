'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Loader2, UploadIcon } from 'lucide-react'
import ControlledAlertDialog from './ControlledDialog'

export default function ProfileImageUpload() {

    const supabase = createClient()
    const [file, setFile] = useState(null)
    const [filePreview, setFilePreview] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [currentImage, setCurrentImage] = useState(null)
    const [error, setError] = useState(null)


    const [user, setUser] = useState(null)

    // Get user when component mounts
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [])



    // Handle file selection with preview
    const handleFileSelect = (event) => {
        const selectedFile = event.target.files[0]

        // Check if file is an image
        if (!selectedFile.type.startsWith('image/')) {
            setError('Please select an image file')
            setFile(null)
            setFilePreview(null)
            return
        }

        setFile(selectedFile)
        setError(null)

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setFilePreview(reader.result)
        }
        reader.readAsDataURL(selectedFile)
    }


    const handleUpload = async () => {
        try {
            setError(null)
            if (!file) {
                setError('Please select an image first')
                return
            }
            if (!user) {
                setError('User not authenticated')
                return
            }

            setUploading(true)

            // Delete existing file if any
            if (currentImage?.name) {
                await supabase.storage
                    .from('avatars')
                    .remove([currentImage.name])
            }

            // Create unique file name using timestamp
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}-${Date.now()}.${fileExt}`
            const filePath = fileName

            // Upload the new file
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true })

            if (uploadError) throw uploadError

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            // Update profile table
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id)

            if (updateError) throw updateError

            // Update local state
            await getProfile()
            setFile(null)
            setFilePreview(null)

        } catch (error) {
            setError(error.message)
        } finally {
            setUploading(false)
        }
    }

    // Get current PROFILE image
    const getProfile = async () => {
        try {
            setUploading(true);
            const { data, error, status } = await supabase
                .from('profiles')
                .select(`avatar_url`)
                .eq('id', user?.id)
                .single();

            if (error && status !== 406) throw error;
            if (data) {
                setCurrentImage(data.avatar_url);
                return data.avatar_url;
            }
        } catch (error) {
            alert('Error loading user data!');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        if (user) {
            getProfile();
        }
    }, [user]); // Only depend on user changes


    const handleConfirm = async () => {
        try {
            await handleUpload();
            setFilePreview(null);
        } catch (error) {
            console.error('Confirm error:', error);
            setError('Upload failed');
        }
    };


    return (
        <div className="">


            <div className="mb-3 flex items-end">

                {/* Current profile image */}
                {currentImage ?

                    <div className="w-32 h-32 overflow-hidden rounded-full">
                        <img

                            src={currentImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div> :

                    <div className="w-32 h-32 overflow-hidden rounded-full">
                        <img
                            src={'/no-user.png'}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                        <p className='text-sm'>upload an image</p>
                    </div>

                }


                <div className="">
                    {/* Upload section */}
                    <label htmlFor="file-upload" className="cursor-pointer ">
                        <div className="text-gray-400 mb-2">

                            {filePreview ? (
                                <div className="w-32 h-32 overflow-hidden rounded-full">

                                    <ControlledAlertDialog
                                        filePreview={filePreview}
                                        onOpenChange={setFilePreview}
                                        onConfirm={handleConfirm}
                                        isLoading={uploading}
                                    />
                                </div>
                            )
                                : (
                                    <span
                                        className="text-blue-400"><UploadIcon />
                                        {uploading && <span className='flex items-center gap-1'><Loader2 className='text-blue-500 animate-spin' /> loading...</span>}
                                    </span>
                                )
                            }
                        </div>
                    </label>

                    <input
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                        disabled={uploading}
                        accept="image/*"
                    />
                </div>

            </div>


            {/* Error display */}
            {error && (
                <div className="text-red-500 mb-4">
                    {error}
                </div>
            )}
        </div>
    )
}