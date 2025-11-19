"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
// import { useSession, signOut } from "next-auth/react";
import { ChevronRightIcon, UserIcon } from "@heroicons/react/24/solid";
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function DashBoardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // ref for detecting outside clicks

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter(Boolean);
    if (pathSegments.length === 0) return [];

    let crumbs = [];

    if (pathSegments[0] === "admin") {
      crumbs.push({ name: "Admin", href: "#" });
      for (let i = 1; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        const href = `/${pathSegments.slice(0, i + 1).join("/")}`;
        const name = segment.charAt(0).toUpperCase() + segment.slice(1);
        crumbs.push({ name, href });
      }
    } else {
      crumbs.push({ name: "User", href: "#" });
      for (let i = 1; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        const href = `${pathSegments.slice(1, i + 1).join("/")}`;
        const name = segment.charAt(0).toUpperCase() + segment.slice(1);
        crumbs.push({ name, href });
      }
    }

    return crumbs;
  };

  const crumbs = getBreadcrumbs();
  const userName = "Admin";

  const handleLogout = async () => {
    router.push("/auth/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 p-4 shadow-sm flex items-center justify-between">
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
                  pathname === crumb.href
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-blue-900"
                }`}
              >
                {crumb.name}
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      <div className="relative flex items-center space-x-4" ref={dropdownRef}>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="cursor-pointer flex items-center gap-2 h-10 pl-2 pr-3 rounded-full bg-white shadow-md border border-gray-200 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
            aria-label="User Profile"
          >
            <img
              width="32"
              height="32"
              src="https://img.icons8.com/ios-filled/50/0d47a1/test-account.png"
              alt="test-account"
            />
            <span className="hidden md:inline text-sm font-medium text-gray-700">
              {userName}
            </span>
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">
                  {userName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  admin@example.com
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-900 transition-colors"
              >
                <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
