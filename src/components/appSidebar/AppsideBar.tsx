"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  LayoutGrid,
  Settings,
  Users,
} from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type SidebarItem = {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
};

const sidebars: SidebarItem[] = [
  { name: "Overview", path: "/", icon: LayoutGrid },
  { name: "User Management", path: "/user-management", icon: Users },
  { name: "App Setting", path: "/app-setting", icon: Settings },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Notification", path: "/notifications", icon: BarChart3 },
  { name: "Profile", path: "/settings", icon: BarChart3 },
];

export default function CathaSidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <Sidebar className="border-none ">
      <SidebarContent className="bg-[#0a0e27] text-white">
        <SidebarGroup>
          {/* Logo Section */}
          <div className="flex items-center justify-center gap-3 px-6 pt-6 pb-8">
            <Image src={"/icons/logo2.png"} alt='' width={100} height={100} />

          </div>

          {/* Navigation Menu */}
          <SidebarGroupContent className="px-0 pt-5">
            <SidebarMenu className="space-y-0">
              {sidebars.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    className={`h-12 px-6 rounded-none transition-all duration-200 ${isActive(item.path)
                      ? "bg-[#4a7cff] text-white hover:bg-[#4a7cff] hover:text-white border-l-4 border-white"
                      : "text-gray-300 hover:bg-[#1a1f3a] hover:text-white border-l-4 border-transparent"
                      }`}
                  >
                    <Link href={item.path} className="flex items-center gap-3 w-full">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}