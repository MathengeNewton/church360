import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

import LoginForm from "./LoginForm";

export const metadata = {
  title: "Login | PCEA Welfare System",
  description:
    "Access your PCEA Welfare account to manage family contributions, payments, and welfare activities.",
  icons: {
    icon: "/pcea-seeklogo.svg",
    shortcut: "/icons/favicon-16x16.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="grid md:grid-cols-2 items-center">
          {/* Left Side - Login Form */}
          <div className="p-8 md:p-12 bg-white">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    PCEA Welfare
                  </h1>
                  <p className="text-sm text-gray-600">Management System</p>
                </div>
              </div>
            </div>
            <LoginForm />
          </div>

          {/* Right Side - Image & Branding */}
          <div className="hidden md:block relative h-full min-h-[600px] bg-gradient-to-br from-blue-600 via-blue-700 to-green-600">
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H9v-1a4 4 0 014-4h4a4 4 0 014 4v1z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-center mb-4">
                  Welfare Management
                </h2>
                <p className="text-lg text-blue-100 text-center max-w-md">
                  Manage family contributions, track payments, and oversee
                  welfare activities for the PCEA community.
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Annual Contributions</p>
                    <p className="text-sm text-blue-100">
                      Track yearly family contributions
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Payment Tracking</p>
                    <p className="text-sm text-blue-100">
                      Monitor payments and distributions
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Family Management</p>
                    <p className="text-sm text-blue-100">
                      Organize and manage family structures
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
