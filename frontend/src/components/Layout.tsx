import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                    <header className="flex items-center justify-between border-b p-4 shadow-sm">
                        <SidebarTrigger />
                        <ModeToggle />
                    </header>
                    <main className="flex-1 p-4 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}