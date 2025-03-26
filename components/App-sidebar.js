import { Bot, Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    // SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

// Menu items.
const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },

    {
        title: "Bantr AI",
        url: "/bant_ai",
        icon: Bot,
    },

    {
        title: "Settings",
        url: "/profile_page",
        icon: Settings,
    },
]

export function AppSidebar() {

    return (
        <Sidebar collapsible="icon" >
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className='font-serif  font-medium rounded-full mb-3'> Turn thoughts into quick posts</SidebarGroupLabel>
                    <SidebarGroupContent  >
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem className='py-2' key={item.title}>
                                    <SidebarMenuButton className='font-medium font-serif text-lg' asChild >
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>



                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
