"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
// import { useSession } from "next-auth/react";

import SideBar from "./SideBar";
import DashBoardHeader from "./DashboardHeader";
import DashboardFooter from "./DashboardFooter";
import {
  BellIcon,
  BriefcaseIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  HomeIcon,
  UserIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  FolderOpenIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  EnvelopeIcon,
  CreditCardIcon,
  LifebuoyIcon,
} from "@heroicons/react/24/outline";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Admin menu
  const adminMenu = [
    { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },

    // Members
    { name: "Members", href: "/admin/#", icon: UserIcon },
    { name: "Families", href: "/admin/#", icon: FolderOpenIcon },

    // Groups & Ministries
    { name: "Groups", href: "/admin/#", icon: ClipboardDocumentListIcon },

    // Contributions & Finance
    {
      name: "Contributions",
      href: "/admin/#",
      icon: CreditCardIcon,
    },
    {
      name: "Finance Reports",
      href: "/admin/finance/#",
      icon: ChartBarIcon,
    },

    // Events
    { name: "Events", href: "/admin/#", icon: CalendarIcon },

    // Communication
    {
      name: "Announcements",
      href: "/admin/#",
      icon: ChatBubbleLeftRightIcon,
    },
    { name: "Messages", href: "/admin/#", icon: EnvelopeIcon },

    // Users
    { name: "User Management", href: "/admin/#", icon: CogIcon },

    // Settings
    { name: "Settings", href: "/admin/#", icon: LifebuoyIcon },
  ];

  // Regular user menu
  const userMenu = [
    { name: "Dashboard", href: "/user/dashboard", icon: HomeIcon },

    { name: "My Profile", href: "/user/#", icon: UserIcon },
    { name: "My Family", href: "/user/#", icon: FolderOpenIcon },

    {
      name: "My Groups",
      href: "/user/#",
      icon: ClipboardDocumentListIcon,
    },

    // Contributions
    {
      name: "My Contributions",
      href: "/user/#",
      icon: CreditCardIcon,
    },

    // Calendar & Events
    { name: "Events", href: "/user/#", icon: CalendarIcon },

    // Messaging
    { name: "Messages", href: "/user/#", icon: EnvelopeIcon },
    { name: "Notifications", href: "/user/#", icon: BellIcon },

    // Support
    { name: "Support", href: "/user/#", icon: LifebuoyIcon },

    { name: "Settings", href: "/user/#", icon: CogIcon },
  ];

  //   const menuItems = userMenu;
  const menuItems = adminMenu;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 relative">
      <SideBar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        pathname={pathname}
        menuItems={menuItems}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashBoardHeader />
        <main className="flex-1 overflow-y-auto p-6 bg-white/50">
          {children}
        </main>
        <DashboardFooter />
      </div>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="cursor-pointer md:hidden fixed bottom-4 right-4 z-50 bg-blue-900 hover:bg-[#1e88b5] text-white p-3 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
      >
        {isMobileOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
