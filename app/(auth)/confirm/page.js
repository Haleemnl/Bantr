import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <div className='flex items-center justify-center h-screen '>

            <p className='text-center' >Check your email to confirm verification
                <Link href='/'>
                    <span className='text-blue-500'> Click here </span> to continue
                </Link>
            </p>

        </div>
    )
}

export default page