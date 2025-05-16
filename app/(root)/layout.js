// import { Geist, Geist_Mono } from "next/font/google";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "../globals.css";
import { AppSidebar } from "@/components/App-sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ModeToggle } from "@/components/ModeToggle";
import Link from "next/link";
import { Toaster } from "sonner";


export default function RootLayout({ children }) {
    return (

        <div className="flex flex-col">
            <SidebarProvider>
                <AppSidebar />
                <main className="flex-1">


                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange >

                        <div className="flex items-center space-x-[25%] sticky bg-white/50 backdrop-blur-sm dark:bg-black top-0">
                            <SidebarTrigger className='sticky top-0 bg-white dark:bg-black' />
                            <Link href='/'>
                                <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500"> (B) Bantr</p>

                            </Link>
                            <ModeToggle />
                        </div>

                        {children}
                        <Toaster />
                    </ThemeProvider>
                </main>
            </SidebarProvider>
        </div>

    );
}
