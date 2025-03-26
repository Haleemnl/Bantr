'use client'

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from '@/utils/supabase/client'


export function DropDownMenu({ postId }) {

    const supabase = createClient()


    const handleDelete = async () => {

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId)

        if (error) {
            throw error
        }

    }



    return (
        <DropdownMenu className='flex items-start justify-start'>

            <DropdownMenuTrigger className="py-0" asChild>
                <Button className='flex items-center text-center font-bold ' variant="none">...</Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-full">

                <DropdownMenuGroup>
                    {/* this */}
                    <DropdownMenuItem className='bg-red-500 text-white hover:bg-red-700' onClick={handleDelete}>delete</DropdownMenuItem>

                </DropdownMenuGroup>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
