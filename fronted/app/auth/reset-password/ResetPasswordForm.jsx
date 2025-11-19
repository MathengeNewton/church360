"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    toast.info("Resetting password...");
    // Simulate reset delay
    setTimeout(() => {
      toast.success("Password reset successfully");
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
              Reset Password
            </h1>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="text-slate-900 text-sm lg:text-base font-medium mb-2 block">
              New Password
            </label>
            <div className="relative flex items-center">
              <input
                name="new-password"
                type={showNewPassword ? "text" : "password"}
                required
                className="w-full text-sm lg:text-base text-slate-900 bg-slate-100 focus:bg-transparent pl-4 pr-10 py-3 rounded-md border border-slate-100 focus:border-blue-600 outline-none transition-all"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {showNewPassword ? (
                <EyeSlashIcon
                  className="w-[18px] h-[18px] absolute right-4 text-[#bbb] cursor-pointer"
                  onClick={() => setShowNewPassword(false)}
                />
              ) : (
                <EyeIcon
                  className="w-[18px] h-[18px] absolute right-4 text-[#bbb] cursor-pointer"
                  onClick={() => setShowNewPassword(true)}
                />
              )}
            </div>
          </div>
          <div>
            <label className="text-slate-900 text-sm lg:text-base font-medium mb-2 block">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <input
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                required
                className="w-full text-sm lg:text-base text-slate-900 bg-slate-100 focus:bg-transparent pl-4 pr-10 py-3 rounded-md border border-slate-100 focus:border-blue-600 outline-none transition-all"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {showConfirmPassword ? (
                <EyeSlashIcon
                  className="w-[18px] h-[18px] absolute right-4 text-[#bbb] cursor-pointer"
                  onClick={() => setShowConfirmPassword(false)}
                />
              ) : (
                <EyeIcon
                  className="w-[18px] h-[18px] absolute right-4 text-[#bbb] cursor-pointer"
                  onClick={() => setShowConfirmPassword(true)}
                />
              )}
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
        </div>
      </form>

      <ToastContainer />
    </div>
  );
}
