import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}











// import { createServerClient } from '@supabase/ssr'
// import { cookies } from 'next/headers'

// /**
//  * Creates a Supabase client for server components.
//  * This should only be used within route handlers, server actions, or server components.
//  */
// export async function createClient() {
//     try {
//         const cookieStore = cookies()

//         return createServerClient(
//             process.env.NEXT_PUBLIC_SUPABASE_URL,
//             process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
//             {
//                 cookies: {
//                     get(name) {
//                         return cookieStore.get(name)?.value
//                     },
//                     set(name, value, options) {
//                         try {
//                             cookieStore.set(name, value, options)
//                         } catch {
//                             // The `set` method was called from a Server Component.
//                             // This can be ignored if you have middleware refreshing sessions.
//                         }
//                     },
//                     remove(name, options) {
//                         try {
//                             cookieStore.set(name, '', { ...options, maxAge: 0 })
//                         } catch {
//                             // The `delete` method was called from a Server Component.
//                             // This can be ignored if you have middleware refreshing sessions.
//                         }
//                     },
//                 },
//             }
//         )
//     } catch (error) {
//         if (error.message.includes('cookies was called outside a request scope')) {
//             console.warn('Supabase client created outside request scope. Authentication will not work.')
//             // Return a client without cookie handling for non-request contexts
//             return createServerClient(
//                 process.env.NEXT_PUBLIC_SUPABASE_URL,
//                 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
//                 {
//                     auth: {
//                         persistSession: false,
//                     },
//                 }
//             )
//         }
//         throw error
//     }
// }