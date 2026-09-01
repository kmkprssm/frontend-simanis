"use client";

import { IconChevronRight, type TablerIcon } from "@tabler/icons-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useRouter } from "@bprogress/next/app";
import { canAccessMenu } from "@/lib/permissions";

interface IItems {
  title: string;
  url: string;
  key?: string; // Menambahkan key unik untuk identifikasi permission
  icon?: TablerIcon;
}

interface IItemsCollapsible {
  title: string;
  url: string;
  key?: string;
}

type NavRiskProps = {
  itemsContext: IItems;
  itemsCollapsiblePenilaian: {
    item: IItems;
    items: IItemsCollapsible[];
  };
  itemsRisk: IItems[];
  pathname: string;
  userRole?: string; // Pass userRole dari parent/sidebar
};

export const NavRisk = ({
  itemsContext,
  itemsCollapsiblePenilaian,
  itemsRisk,
  pathname,
  userRole,
}: NavRiskProps) => {
  const router = useRouter();

  // Filter items berdasarkan role
  const showContext = canAccessMenu(userRole, itemsContext.key || "konteks");

  const filteredPenilaianSubItems = itemsCollapsiblePenilaian.items.filter(
    (sub) => canAccessMenu(userRole, sub.key),
  );
  const showPenilaianGroup = filteredPenilaianSubItems.length > 0;

  const filteredRiskItems = itemsRisk.filter((item) =>
    canAccessMenu(userRole, item.key),
  );

  // Jika tidak ada satu pun menu risiko yang boleh diakses role ini, sembunyikan seluruh Group
  if (!showContext && !showPenilaianGroup && filteredRiskItems.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Manajemen Risiko</SidebarGroupLabel>
      <SidebarMenu>
        {/* Menu Penetapan Konteks */}
        {showContext && (
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={itemsContext.title}
              isActive={pathname.startsWith(itemsContext.url)}
              className="cursor-pointer"
              onClick={() =>
                router.push(itemsContext.url, { showProgress: true })
              }
            >
              {itemsContext.icon && <itemsContext.icon stroke={2} />}
              <span>{itemsContext.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}

        {/* Group Penilaian Risiko (Collapsible) */}
        {showPenilaianGroup && (
          <Collapsible
            key={itemsCollapsiblePenilaian.item.title}
            asChild
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={itemsCollapsiblePenilaian.item.title}
                >
                  {itemsCollapsiblePenilaian.item.icon && (
                    <itemsCollapsiblePenilaian.item.icon stroke={2} />
                  )}
                  <span>{itemsCollapsiblePenilaian.item.title}</span>
                  <IconChevronRight
                    stroke={2}
                    className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {filteredPenilaianSubItems.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        isActive={pathname === subItem.url}
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(subItem.url, { showProgress: true })
                        }
                      >
                        <span>{subItem.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        )}

        {/* Sub-menu Risiko Lainnya */}
        {filteredRiskItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={pathname.startsWith(item.url)}
              className="cursor-pointer"
              onClick={() => router.push(item.url, { showProgress: true })}
            >
              {item.icon && <item.icon stroke={2} />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
