import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

import LoginForm from "./LoginForm";

export const metadata = {
  title: "Login | PCEA Church Admin",
  description:
    "Access your PCEA Church Admin account to manage districts, sermons, announcements, events, and church activities.",
  icons: {
    icon: "/pcea-seeklogo.svg",
    shortcut: "/icons/favicon-16x16.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="grid md:grid-cols-2 items-center">
          {/* Left Side - Login Form */}
          <div className="p-8 md:p-12 bg-white">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-4m-6 0H5m6 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-6 0h6"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    PCEA Church
                  </h1>
                  <p className="text-sm text-gray-600">Admin Portal</p>
                </div>
              </div>
            </div>
            <LoginForm />
          </div>

          {/* Right Side - Image & Branding */}
          <div className="hidden md:block relative h-full min-h-[600px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative h-full flex flex-col items-center justify-center p-12 text-white">
              <div className="mb-8">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <svg
                    className="w-14 h-14 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-4m-6 0H5m6 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-6 0h6"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-center mb-4">
                  Church Administration
                </h2>
                <p className="text-lg text-blue-100 text-center max-w-md">
                  Manage districts, sermons, announcements, events, and all
                  church administrative activities.
                </p>
              </div>

              <div className="mt-12 space-y-4 w-full max-w-sm">
                <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H9v-1a4 4 0 014-4h4a4 4 0 014 4v1z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">District Management</p>
                    <p className="text-sm text-blue-100">
                      Organize and manage church districts
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Sermons & Messages</p>
                    <p className="text-sm text-blue-100">
                      Create and manage church sermons
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Announcements</p>
                    <p className="text-sm text-blue-100">
                      Share announcements with members
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
