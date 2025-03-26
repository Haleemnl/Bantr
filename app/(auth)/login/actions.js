


'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    console.log('error seen:', error.message);


    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
        options: {
            data: {
                full_name: formData.get('name')
            }
        }
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        console.error('Error creating user:', error.message);

        redirect('/error')
    }

    if (data) {
        redirect('/confirm')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}