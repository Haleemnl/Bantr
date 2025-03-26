
import Profile from "@/components/Profile";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


export default async function Page() {

    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/login')
    }


    return (

        <div className=" ">

            <Profile
                user={user}
            />

        </div>

    )
}

