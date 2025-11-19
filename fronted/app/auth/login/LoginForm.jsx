"use client";

import { useState } from "react";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.info("Logging in...");
    // Simulate login delay
    setTimeout(() => {
      toast.success("Logged in successfully");
    }, 1000);
  };

  return (
    <div>
      <form
        className="max-w-md mx-auto w-full p-4 md:p-6"
        onSubmit={handleSubmit}
      >
        <div className="mb-8">
          <div>
            <h1 className="text-gray-800 text-xl lg:text-3xl font-semibold">
              Sign in
            </h1>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="text-slate-900 text-sm lg:text-base font-medium mb-2 block">
              Email
            </label>
            <div className="relative flex items-center">
              <input
                name="email"
                type="text"
                required
                className="w-full text-sm lg:text-base text-slate-900 bg-slate-100 focus:bg-transparent pl-4 pr-10 py-3 rounded-md border border-slate-100 focus:border-blue-600 outline-none transition-all"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <EnvelopeIcon className="w-[18px] h-[18px] absolute right-4 text-[#bbb]" />
            </div>
          </div>
          <div>
            <label className="text-slate-900 text-sm lg:text-base font-medium mb-2 block">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full text-sm lg:text-base text-slate-900 bg-slate-100 focus:bg-transparent pl-4 pr-10 py-3 rounded-md border border-slate-100 focus:border-blue-600 outline-none transition-all"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {showPassword ? (
                <EyeSlashIcon
                  className="w-[18px] h-[18px] absolute right-4 text-[#bbb] cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <EyeIcon
                  className="w-[18px] h-[18px] absolute right-4 text-[#bbb] cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="shrink-0 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded-md"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label
                htmlFor="remember-me"
                className="ml-3 block text-sm lg:text-base text-slate-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm lg:text-base">
              <Link
                href="/auth/forgot-password"
                className="text-blue-600 font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <button
            type="submit"
            className="w-full shadow-xl py-2 px-4 text-sm lg:text-base tracking-wide font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
