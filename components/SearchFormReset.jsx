'use client'

import Link from 'next/link'
import React from 'react'

const SearchFormReset = () => {

    // RESET FUNCTION
    const reset = () => {
        const form = document.querySelector('.search-form')

        if (form) form.reset()
    }

    return (
        <button type='reset' onClick={reset}>
            <Link href='/' className='search-btn text-black'>Xxxxxxxx</Link>
        </button>
    )
}

export default SearchFormReset