"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useGetAllNotificationQuery } from '../../features/notifications/notificationsApi';
import { useGetProfileQuery } from '../../features/settings/settingsApi';
import { baseURL } from '../../utils/BaseURL';

export default function Header() {
  const pathname = usePathname();
  const cleanPath = pathname.replace("/", "");

  const { data: notifications } = useGetAllNotificationQuery({});
  const { data: profile } = useGetProfileQuery({});


  const userName = "Jacob Jones";
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMyProfile = () => {
    router.push("/settings");
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    setIsDropdownOpen(false);
    router.push("/auth/login");
  };

  return (
    <div className="w-full border-b bg-white">
      <header className="flex h-16 items-center justify-between px-6">
        {/* Left side - Overview title */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {pathname === "/"
              ? "Overview"
              : cleanPath}
          </h1>
        </div>

        {/* Middle - Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search here..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div> */}
        </div>

        {/* Right side - Notification and Profile */}
        <div className="flex items-center gap-6">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => router.push("/notifications")}
              className="relative flex cursor-pointer items-center justify-center transition-colors"
            >
              <Bell className="h-6 w-6 text-gray-700" />
              {notifications?.data?.length > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-4 w-4 min-w-4 rounded-full p-0 flex items-center justify-center text-[10px] font-semibold"
                  variant="destructive"
                >
                  {notifications?.data?.length}
                </Badge>
              )}
            </button>
          </div>

          {/* User Profile with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-3 transition-colors cursor-pointer"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={baseURL + "/" + profile?.data?.profile} alt={userName} />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm">
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-gray-900">
                  {profile?.data?.fullName}
                </span>
                <span className="text-xs text-gray-500">{profile?.data?.role}</span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg z-50">
                <button
                  onClick={handleMyProfile}
                  className="flex w-full px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full px-4 py-2 text-sm cursor-pointer text-red-600 hover:bg-gray-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}