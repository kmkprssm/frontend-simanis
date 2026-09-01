"use client";

import { type TablerIcon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "@bprogress/next/app";

export const NavMain = ({
  items,
  pathname,
}: {
  items: {
    title: string;
    url: string;
    icon?: TablerIcon;
  }[];
  pathname: string;
}) => {
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              className="cursor-pointer"
              tooltip={item.title}
              isActive={pathname === item.url}
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
