import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function SignoutModal({ trigger }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">{trigger}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Sad to see you leave 😞
                    </AlertDialogDescription>
                </AlertDialogHeader >
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <form action="/auth/signout" method="post">
                        <button type="submit">

                            <AlertDialogAction className='py-2 px-4 rounded-2xl bg-red-500 hover:bg-red-700 text-white font-medium font-serif'>Continue</AlertDialogAction>
                        </button>
                    </form>

                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog >
    )
}
