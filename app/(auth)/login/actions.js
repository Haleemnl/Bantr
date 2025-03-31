'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData) {
    const supabase = await createClient()
    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    }

    const { data: authData, error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        console.error('Login error:', error)
        return { error: error.message }
    }

    if (!authData.user) {
        return { error: 'Authentication failed' }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData) {
    const supabase = await createClient()
    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
        //other login details
        options: {
            data: {
                full_name: formData.get('name')
            }
        }
    }

    const { data: signupData, error } = await supabase.auth.signUp(data)

    if (error) {
        console.error('Signup error:', error)
        return { error: error.message }
    }

    if (signupData.user) {
        redirect('/confirm')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}