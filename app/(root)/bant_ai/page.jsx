import Test from '@/components/ai/Test'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {

    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/login')
    }


    return (
        <div>

            <Test
                user={user}
            />
        </div>
    )
}

export default page