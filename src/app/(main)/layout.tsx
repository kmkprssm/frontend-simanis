import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarWrapper } from "@/contexts/sidebar-wrapper";
import { currentUser } from "@/lib/auth";

const AdminLayout = async ({ children }: React.PropsWithChildren) => {
  const user = await currentUser();

  return (
    <SidebarWrapper>
      <AppSidebar user={user} />
      <SidebarInset>
        <SiteHeader />
        <div className="@container/main mb-6 flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarWrapper>
  );
};

export default AdminLayout;
