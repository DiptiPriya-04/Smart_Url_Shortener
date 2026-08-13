import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { HomeIcon, UserIcon, ListChecks, LogOutIcon, Link } from "lucide-react";
import { useLogout } from "@/hooks/useUserQueries";
import { useUserInfo } from "@/hooks/useUserQueries";


// Navigation items
const NAVIGATION_ITEMS = [
    {
        href: "/",
        icon: HomeIcon,
        label: "Home",
    },
    {
        href: "/features",
        icon: ListChecks,
        label: "Features",
    },
    {
        href: "/profile",
        icon: UserIcon,
        label: "Profile",
    },
    {
        href: "/my-urls",
        icon: Link,
        label: "My URLs",
    },
];

export function AppSidebar() {
    const { data: userData, isLoading } = useUserInfo();
    const { mutate: logout, isPending } = useLogout();

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                // Clear local storage
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                // Redirect to login page
                window.location.href = '/signin';
            },
            onError: () => {
                // Still clear local storage and redirect even if API call fails
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/signin';
            },
        });
    };

    // Check if user is logged in (user data exists and no error)
    const isLoggedIn = !isLoading && userData?.data;

    return (
        <Sidebar collapsible="icon" side="left">
            <SidebarHeader>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {NAVIGATION_ITEMS.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.href}>
                                            <item.icon />
                                            <span>{item.label}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            {isLoggedIn && (
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={handleLogout}
                                disabled={isPending}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <LogOutIcon className={isPending ? "animate-spin" : ""} />
                                <span>{isPending ? "Logging out..." : "Logout"}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            )}
        </Sidebar>
    );
}