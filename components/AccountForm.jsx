'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Pen } from 'lucide-react'


export default function AccountForm({ user }) {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)

    // inputs
    const [fullname, setFullname] = useState(null)
    const [username, setUsername] = useState(null)
    const [website, setWebsite] = useState(null)
    const [bio, setBio] = useState(null)


    // display profile
    const getProfile = useCallback(async () => {
        try {
            setLoading(true)

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`full_name, username, website, bio`)
                .eq('id', user?.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setFullname(data.full_name)
                setUsername(data.username)
                setWebsite(data.website)
                setBio(data.bio)
            }
        } catch (error) {
            alert('Error loading user data!')
        } finally {
            setLoading(false)
        }
    }, [user, supabase])

    useEffect(() => {
        getProfile()
    }, [user, getProfile])


    // update function
    async function updateProfile() {  // No parameters needed
        try {
            setLoading(true)
            const { error } = await supabase.from('profiles').upsert({
                id: user?.id,
                full_name: fullname,
                username,
                website,
                bio,
                updated_at: new Date().toISOString(),
            })
            if (error) throw error
            alert('Profile updated!')
        } catch (error) {
            alert('Error updating the data!')
            console.error('Error details:', error)  // For debugging
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className=" flex justify-between items-center bg-purple-200 rounded-lg dark:text-black">

            <Dialog>
                <DialogTrigger className='flex items-center rounded-md gap-2 border py-1 px-2 '>
                    <Pen className='size-3' />
                    <p className='text-sm'>Edit Profile </p>

                </DialogTrigger>

                <DialogContent className="w-full">

                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here.
                        </DialogDescription>
                    </DialogHeader>

                    {/* names */}
                    <div className='flex items-center justify-between gap-10 my-5'>
                        <div className='flex flex-col'>
                            <label htmlFor="fullName" className='font-light text-sm text-gray-800 dark:text-slate-100  font-serif'>Full Name</label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullname || ''}
                                onChange={(e) => setFullname(e.target.value)}
                                className='outline-none border rounded-md p-2'
                            />
                        </div>

                        {/* username */}
                        <div className='flex flex-col'>
                            <label htmlFor="username" className='font-light text-sm text-gray-800 dark:text-slate-100  font-serif'>Username</label>
                            <input
                                id="username"
                                type="text"
                                value={username || ''}
                                onChange={(e) => setUsername(e.target.value)}
                                className='outline-none border rounded-md p-2'
                            />
                        </div>

                    </div>


                    {/* site link */}
                    <div className='flex flex-col my-5'>
                        <label htmlFor="website" className='font-light text-sm text-gray-800 dark:text-slate-100 font-serif'>Website</label>
                        <input
                            id="website"
                            type="url"
                            value={website || ''}
                            onChange={(e) => setWebsite(e.target.value)}
                            className='outline-none border rounded-md p-2'
                        />
                    </div>

                    {/* bio */}
                    <div className='flex flex-col my-5'>
                        <label htmlFor="bio" className='font-light text-sm text-gray-800 dark:text-slate-100  font-serif'>Bio</label>
                        <textarea
                            name="bio"
                            value={bio || ''}
                            onChange={(e) => setBio(e.target.value)}
                            id="bio"
                            className='outline-none border rounded-md p-2 resize-y'
                        />
                    </div>

                    {/* footer */}
                    <DialogFooter>
                        <button
                            className="py-2 px-4 rounded-2xl bg-purple-600 text-white font-medium font-serif"
                            onClick={updateProfile}
                            disabled={loading}
                        >
                            {loading ? 'Loading ...' : 'Update'}
                        </button>
                    </DialogFooter>

                </DialogContent>
            </Dialog>



        </div>
    )
}