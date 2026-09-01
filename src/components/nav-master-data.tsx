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
import Link from "next/link";

interface IItems {
  title: string;
  url: string;
  icon?: TablerIcon;
}

interface IItemsCollapsible {
  title: string;
  url: string;
}

type NavRiskProps = {
  itemsCollapsible: {
    item: IItems;
    items: IItemsCollapsible[];
  };
  pathname: string;
};

export const NavMasterData = ({ itemsCollapsible, pathname }: NavRiskProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Kelola Data</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible
          key={itemsCollapsible.item.title}
          asChild
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={itemsCollapsible.item.title}>
                {itemsCollapsible.item.icon && (
                  <itemsCollapsible.item.icon stroke={2} />
                )}
                <span>{itemsCollapsible.item.title}</span>
                <IconChevronRight
                  stroke={2}
                  className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {itemsCollapsible.items.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === subItem.url}
                    >
                      <Link href={subItem.url}>
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
};
