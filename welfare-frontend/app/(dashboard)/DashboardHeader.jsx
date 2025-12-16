// components/DashBoardHeader.jsx   (or wherever you keep it)
"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRightIcon, UserIcon } from "@heroicons/react/24/solid";
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

// ===================================================
// SIMULATED USER – SAME AS proxy.js (keep in sync!)
// ===================================================
const SIMULATED_USER = {
  isLoggedIn: true,
  role: "admin", // ← Change to "user" to see member view
  name: "Rev. Peter Kamau",
  email: "peter.kamau@pcea.or.ke",
  parish: "PCEA St. Andrews Nairobi",
  avatar: "https://img.icons8.com/ios-filled/50/0d47a1/test-account.png", // same for both for now
};

// Optional: Different avatar for regular members
const getAvatar = () => {
  if (SIMULATED_USER.role === "user") {
    return "https://img.icons8.com/ios-filled/50/10b981/user-male-circle.png";
  }
  return SIMULATED_USER.avatar;
};

export default function DashBoardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

    if (segments[0] === "admin" && SIMULATED_USER.role === "admin") {
      crumbs.push({ name: "Dashboard", href: "/admin/dashboard" });
      segments.slice(2).forEach((seg, i) => {
        const href = `/admin/dashboard/${segments.slice(2, i + 3).join("/")}`;
        const name =
          seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
        crumbs.push({ name, href });
      });
    } else if (segments[0] === "user" && SIMULATED_USER.role === "user") {
      crumbs.push({ name: "My Dashboard", href: "/user/dashboard" });
      segments.slice(2).forEach((seg, i) => {
        const href = `/user/dashboard/${segments.slice(2, i + 3).join("/")}`;
        const name =
          seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
        crumbs.push({ name, href });
      });
    }

    return crumbs;
  };

  const crumbs = getBreadcrumbs();

  const handleLogout = () => {
    // In real app: clear session
    // For now: just go to login (or simulate logout by reloading)
    router.push("/auth/login");
  };

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
            src={getAvatar()}
            alt="User avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-gray-900">
              {SIMULATED_USER.name}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {SIMULATED_USER.role}
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
                {SIMULATED_USER.name}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {SIMULATED_USER.email}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {SIMULATED_USER.parish}
              </p>
            </div>

            <div className="py-2">
              <Link
                href={
                  SIMULATED_USER.role === "admin"
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
