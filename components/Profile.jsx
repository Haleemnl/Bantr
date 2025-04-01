'use client'

import AccountForm from "@/components/AccountForm";
import { SignoutModal } from "@/components/SignoutModal";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { SingleSkeleton } from "./loaders/SingleSkeleton";
import ProfileImageUpload from "./ProfilePhoto";


// get data from table
export default function Profile({ user }) {

    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(false)


    const supabase = createClient()

    // get PROFILE data from database
    useEffect(() => {

        const getPosts = async () => {
            try {
                setLoading(true)

                let { data: profile, error } = await supabase
                    .from('profiles')
                    .select(`full_name,username,bio,website`)
                    .eq('id', user.id)
                    .single()

                if (error) {
                    throw new Error("error");
                    // redirect('/')
                }
                setProfile(profile)
            } catch (error) {

                console.error(error)
            } finally {
                setLoading(false)

            }



        }

        getPosts()

        // Set up real-time subscription
        const channel = supabase
            .channel('posts-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'profiles'
                },
                (payload) => {
                    console.log('Change received!', payload)

                    switch (payload.eventType) {
                        case 'INSERT':
                            setProfile(payload.new);
                            break;
                        case 'DELETE':
                            setProfile(null);
                            break;
                        case 'UPDATE':
                            setProfile(payload.new);
                            break;
                    }
                }
            )
            .subscribe()

        // Cleanup subscription when component unmounts
        return () => {
            supabase.removeChannel(channel)
        }


    }, [])



    return (

        <div className="w-[95%] mx-auto bg-slate-100 dark:bg-black shadow-lg py-5 ">

            <div className="flex items-center justify-end mr-3">
                {/* edit modal */}
                <AccountForm user={user} />
            </div>


            {/* profile display */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-around mt-5  border p-5">

                {/* <UploadImage /> */}
                <ProfileImageUpload />

                <div className="flex items-center justify-between">
                    <div className="w-1/2 p-2">

                        <div>
                            <p className="font-bold text-sm font-serif">Email</p>
                            <p className="">{user.email}</p>

                        </div>

                        <div className="my-3">
                            <p className="font-semibold text-sm font-serif"> Full Name</p>
                            {loading ? <SingleSkeleton /> : <p>{profile?.full_name || 'Your name'}</p>}
                        </div>

                        <div className="my-3">
                            <p className="font-semibold text-sm font-serif">Website</p>
                            {loading ? <SingleSkeleton /> : <p>{profile?.website}</p>}
                        </div>

                    </div>

                    <div className=" w-1/2 p-2">
                        <div>
                            <p className="font-semibold text-sm font-serif">Username</p>
                            {loading ? <SingleSkeleton /> : <p>{profile?.username || 'set a username'}</p>}
                        </div>



                        <div className="my-3">
                            <p className="font-semibold text-sm font-serif">Bio</p>
                            {loading ? <SingleSkeleton /> : <p>{profile?.bio || 'Your Bio'}</p>}
                        </div>
                    </div>
                </div>

            </div>


            <div className="mt-5 ">



                {/* signout Modal */}
                <SignoutModal
                    trigger='Sign Out'
                />


            </div>
        </div>

    )
}


