import { Outlet } from "react-router-dom";
import Bar from "../shared/sidebar/Bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function MainLayout() {
    return (
        <SidebarProvider>
            <Bar />
            <SidebarInset>
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    );
}