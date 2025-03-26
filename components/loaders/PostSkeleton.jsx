import { Skeleton } from "@/components/ui/skeleton"

export function PostSkeleton() {
    return (
        <div className=" mt-5">


            <di className=' border-b p-5  w-[90%] mx-auto flex items-start justify-start gap-3 my-3 shadow-lg rounded-xl'>

                {/* profile photo */}
                <Skeleton className="h-10 w-10 rounded-full" />

                <div className='w-full'>

                    <Skeleton className="w-[200px] h-5 my-2" />
                    <Skeleton className="w-[200px] h-5 mb-5" />

                    <Skeleton className="object-cover w-full h-[300px] rounded-lg" />


                </div>

            </di>
        </div>
    )
}
