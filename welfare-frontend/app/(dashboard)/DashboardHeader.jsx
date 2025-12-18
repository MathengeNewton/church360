"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRightIcon, UserIcon } from "@heroicons/react/24/solid";
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";

export default function DashBoardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout, hasRole } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Breadcrumbs logic (Admin vs User)
  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return [];

    let crumbs = [];

    // Use actual user role from context
    if (segments[0] === "admin" && hasRole("admin")) {
      crumbs.push({ name: "Welfare Admin Dashboard", href: "/admin/dashboard" });
      segments.slice(1).forEach((seg, i) => {
        const href = `/admin/${segments.slice(1, i + 2).join("/")}`;
        const name =
          seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
        crumbs.push({ name, href });
      });
    } else if (segments[0] === "user") {
      crumbs.push({ name: "My Dashboard", href: "/user/dashboard" });
      segments.slice(1).forEach((seg, i) => {
        const href = `/user/${segments.slice(1, i + 2).join("/")}`;
        const name =
          seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
        crumbs.push({ name, href });
      });
    }

    return crumbs;
  };

  const crumbs = getBreadcrumbs();

  const handleLogout = () => {
    logout();
  };

  if (!user) return null; // Don't render header if user is not logged in

  return (
    <header className="bg-white border-b border-gray-200 p-4 shadow-sm flex items-center justify-between sticky top-0 z-40">
      {/* Breadcrumbs */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          {crumbs.map((crumb, index) => (
            <li key={crumb.href} className="inline-flex items-center">
              {index !== 0 && (
                <ChevronRightIcon className="w-4 h-4 mx-1 text-gray-400" />
              )}
              <Link
                href={crumb.href}
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith(crumb.href)
                    ? "text-gray-900 font-semibold"
                    : "text-gray-500 hover:text-[#0D47A1]"
                }`}
              >
                {crumb.name}
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      {/* User Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 h-11 px-3 rounded-full bg-white shadow-md border border-gray-200 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
        >
          <img
            src={user.avatar || "https://img.icons8.com/ios-filled/50/0d47a1/test-account.png"}
            alt="User avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-gray-900">
              {user.username}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user.roles && user.roles.length > 0 ? user.roles[0].name : 'N/A'}
            </p>
          </div>
          <ChevronDownIcon
            className={`w-4 h-4 text-gray-500 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-[#0D47A1]/5 to-blue-50 border-b border-gray-200">
              <p className="text-sm font-bold text-gray-900">
                {user.username}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {user.email}
              </p>
            </div>

            <div className="py-2">
              <Link
                href={
                  hasRole("admin")
                    ? "/admin/dashboard/profile"
                    : "/user/dashboard/profile"
                }
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <UserIcon className="w-5 h-5" />
                My Profile
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
