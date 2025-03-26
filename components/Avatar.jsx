// 'use client'
// import React, { useEffect, useState } from 'react'
// import { createClient } from '@/utils/supabase/client'
// import Image from 'next/image'
// import { Upload } from 'lucide-react'

// export default function Avatar({ uid, url, size, onUpload }) {
//     const supabase = createClient()
//     const [avatarUrl, setAvatarUrl] = useState(url)
//     const [uploading, setUploading] = useState(false)

//     // useEffect(() => {
//     //     async function downloadImage(path) {
//     //         try {
//     //             const { data, error } = await supabase.storage.from('avatars').download(path)
//     //             if (error) {
//     //                 throw error
//     //             }

//     //             const url = URL.createObjectURL(data)
//     //             setAvatarUrl(url)
//     //         } catch (error) {
//     //             console.log('Error downloading image: ', error)
//     //         }
//     //     }

//     //     if (url) downloadImage(url)
//     // }, [url, supabase])



//     const fetchUserAvatar = async () => {
//         try {
//             // First, fetch the avatar path from the user's profile
//             const { data: profileData, error: profileError } = await supabase
//                 .from('profiles')
//                 .select('avatar_path')
//                 .eq('id', uid)
//                 .single()

//             if (profileError) {
//                 throw profileError
//             }

//             // If there's an avatar path, download the image
//             if (profileData?.avatar_path) {
//                 const { data, error } = await supabase.storage.from('avatars').download(profileData.avatar_path)

//                 if (error) {
//                     throw error
//                 }

//                 const url = URL.createObjectURL(data)
//                 setAvatarUrl(url)
//             }
//         } catch (error) {
//             console.log('Error fetching avatar: ', error)
//         }
//     }

//     // You can call this function when you want to load the user's avatar
//     useEffect(() => {
//         fetchUserAvatar()
//     }, [uid, supabase])



//     const uploadAvatar = async (event) => {
//         try {
//             setUploading(true)
//             if (!event.target.files || event.target.files.length === 0) {
//                 throw new Error('You must select an image to upload.')
//             }
//             const file = event.target.files[0]
//             const fileExt = file.name.split('.').pop()
//             const filePath = `${uid}-${Math.random()}.${fileExt}`

//             // Upload to storage
//             const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)
//             if (uploadError) {
//                 throw uploadError
//             }

//             // Update user's profile in the database with the avatar path
//             const { error: updateError } = await supabase
//                 .from('profiles')  // assuming you have a 'profiles' table
//                 .update({ avatar_path: filePath })
//                 .eq('id', uid)

//             if (updateError) {
//                 throw updateError
//             }

//             onUpload(filePath)
//         } catch (error) {
//             alert('Error uploading avatar!')
//             console.error(error)
//         } finally {
//             setUploading(false)
//         }
//     }

//     return (
//         <div className='flex items-end'>
//             {avatarUrl ? (
//                 <Image
//                     width={size}
//                     height={size}
//                     src={avatarUrl}
//                     alt="Avatar"
//                     className="rounded-full "
//                     style={{ height: size, width: size }}
//                 />
//             ) : (
//                 <div className="avatar no-image" style={{ height: size, width: size }} />
//             )}
//             <div >

//                 <label className="text-blue-300" htmlFor="single">
//                     {uploading ? 'Uploading ...' : <Upload className='text-blue-300 cursor-pointer' />}
//                 </label>

//                 <input
//                     style={{
//                         visibility: 'hidden',
//                         position: 'absolute',
//                     }}
//                     type="file"
//                     id="single"
//                     accept="image/*"
//                     onChange={uploadAvatar}
//                     disabled={uploading}
//                 />
//             </div>
//         </div>
//     )
// }



















































































'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'

export default function Avatar({ uid, url, size, onUpload }) {
    const supabase = createClient()
    const [avatarUrl, setAvatarUrl] = useState(url)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        async function downloadImage(path) {
            try {
                const { data, error } = await supabase.storage.from('avatars').download(path)
                if (error) {
                    throw error
                }

                const url = URL.createObjectURL(data)
                setAvatarUrl(url)
            } catch (error) {
                console.log('Error downloading image: ', error)
            }
        }

        if (url) downloadImage(url)
    }, [url, supabase])

    const uploadAvatar = async (event) => {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const filePath = `${uid}-${Math.random()}.${fileExt}`

            const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            onUpload(filePath)
        } catch (error) {
            alert('Error uploading avatar!')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div>
            {avatarUrl ? (
                <Image
                    width={size}
                    height={size}
                    src={avatarUrl || '/know more.png'}
                    alt="Avatar"
                    className="avatar image"
                    style={{ height: size, width: size }}
                />
            ) : (
                <div className="avatar no-image" style={{ height: size, width: size }} />
            )}
            <div style={{ width: size }}>
                <label className="button primary block" htmlFor="single">
                    {uploading ? 'Uploading ...' : 'Upload'}
                </label>
                <input
                    style={{
                        visibility: 'hidden',
                        position: 'absolute',
                    }}
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                />
            </div>
        </div>
    )
}