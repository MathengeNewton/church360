"use client";

import { useState } from "react";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    toast.info("Sending reset link...");
    // Simulate sending reset email
    setTimeout(() => {
      toast.success("Password reset link sent to your email");
    }, 1000);
  };

  return (
    <div className="bg-gray-100 lg:h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl bg-white [box-shadow:0_2px_10px_-3px_rgba(6,81,237,0.3)] p-4 lg:p-5 rounded-md">
        <div className="grid md:grid-cols-2 items-center gap-y-8">
          <form
            className="max-w-md mx-auto w-full p-4 md:p-6"
            onSubmit={handleSubmit}
          >
            <div className="mb-8">
              <h1 className="text-gray-800 text-xl lg:text-3xl font-semibold">
                Forgot Password
              </h1>
              <p className="text-gray-700 text-sm lg:text-base font-medium mt-6 leading-relaxed">
                Enter your email to receive a password reset link. We&apos;ll
                help you get back into your account.
              </p>
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
            </div>
            <div className="mt-12">
              <button
                type="submit"
                className="w-full shadow-xl py-2 px-4 text-sm lg:text-base tracking-wide font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer"
              >
                Reset Password
              </button>
              <p className="text-sm lg:text-base mt-6 text-center text-slate-600">
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 font-medium tracking-wide hover:underline ml-1"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
          <div className="w-full h-full">
            <div className="aspect-square bg-gray-50 relative before:absolute before:inset-0 before:bg-indigo-600/40 rounded-md overflow-hidden w-full h-full">
              <Image
                width={600}
                height={600}
                src="/forgot-password.jpg"
                className="w-full h-full object-cover"
                alt="forgot password img"
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
