"use client";
import { useState, useEffect, useRef } from "react";
import { apiClient } from "../lib/api";
import { toast } from "react-toastify";
import {
  MagnifyingGlassIcon,
  UserPlusIcon,
  XMarkIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default function UserSearch({
  value,
  onChange,
  onSelectUser,
  onCreateNew,
  placeholder = "Search users by username or email...",
  districtId,
  disabled = false,
  districts = [], // Pass districts from parent
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedUser, setSelectedUser] = useState(value || null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    districtId: districtId || "",
    password: "",
    confirmPassword: "",
  });
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (value) {
      // If value is provided, try to find the user
      const findUser = async () => {
        try {
          const response = await apiClient.users.getById(value);
          setSelectedUser(response.data);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
      findUser();
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target) &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setShowResults(false);
        setShowCreateModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.users.search(searchQuery);
      let users = response.data || [];
      
      // Filter by district if provided
      if (districtId) {
        users = users.filter((u) => u.districtId === districtId);
      }
      
      setResults(users);
      setShowResults(true);
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error("Failed to search users");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const debouncedSearch = debounce(handleSearch, 300);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setQuery("");
    setShowResults(false);
    if (onSelectUser) {
      onSelectUser(user);
    }
    if (onChange) {
      onChange(user.id);
    }
  };

  const handleClear = () => {
    setSelectedUser(null);
    setQuery("");
    setResults([]);
    setShowResults(false);
    if (onChange) {
      onChange(null);
    }
    if (onSelectUser) {
      onSelectUser(null);
    }
  };

  const handleCreateNewClick = () => {
    // Pre-fill username from search query
    setNewUserData({
      username: query.trim(),
      email: "",
      districtId: districtId || "",
      password: "",
      confirmPassword: "",
    });
    setShowCreateModal(true);
    setShowResults(false);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    // Validation
    if (!newUserData.username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!newUserData.districtId) {
      toast.error("District is required");
      return;
    }

    if (newUserData.password && newUserData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newUserData.password !== newUserData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setCreating(true);
    try {
      const payload = {
        username: newUserData.username.trim(),
        email: newUserData.email.trim() || undefined,
        districtId: parseInt(newUserData.districtId),
        password: newUserData.password || "temp123", // Default password if not provided
      };

      const response = await apiClient.users.create(payload);
      const createdUser = response.data;

      toast.success("User created successfully!");
      setShowCreateModal(false);
      setNewUserData({
        username: "",
        email: "",
        districtId: districtId || "",
        password: "",
        confirmPassword: "",
      });

      // Select the newly created user
      handleSelectUser(createdUser);
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(
        error.response?.data?.message || "Failed to create user"
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <div className="relative w-full" ref={searchRef}>
        {selectedUser ? (
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-semibold">
                {selectedUser.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">{selectedUser.username}</p>
                {selectedUser.email && (
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                )}
                {selectedUser.district && (
                  <p className="text-xs text-gray-400">{selectedUser.district.name}</p>
                )}
              </div>
            </div>
            {!disabled && (
              <button
                onClick={handleClear}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={() => {
                  if (results.length > 0) setShowResults(true);
                }}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent ${
                  disabled ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
              {loading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-900"></div>
                </div>
              )}
            </div>

            {showResults && (
              <div
                ref={resultsRef}
                className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
              >
                {results.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-gray-500 text-sm mb-2">No users found</p>
                    {(onCreateNew !== false) && (
                      <button
                        onClick={handleCreateNewClick}
                        className="text-blue-900 hover:text-blue-700 text-sm font-medium flex items-center gap-2 mx-auto"
                      >
                        <UserPlusIcon className="h-4 w-4" />
                        Create new user "{query}"
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {results.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleSelectUser(user)}
                        className="w-full p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 text-left transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{user.username}</p>
                            {user.email && (
                              <p className="text-sm text-gray-500">{user.email}</p>
                            )}
                            {user.district && (
                              <p className="text-xs text-gray-400">{user.district.name}</p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                    {(onCreateNew !== false) && query.trim().length >= 2 && (
                      <div className="border-t border-gray-200 p-2">
                        <button
                          onClick={handleCreateNewClick}
                          className="w-full p-2 text-blue-900 hover:bg-blue-50 rounded text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <UserPlusIcon className="h-4 w-4" />
                          Create new user "{query}"
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Create New User
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={newUserData.username}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, username: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-900 focus:border-blue-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-900 focus:border-blue-900"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District *
                </label>
                <select
                  value={newUserData.districtId}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, districtId: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-900 focus:border-blue-900"
                  required
                >
                  <option value="">Select a district</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password (Optional - defaults to "temp123")
                </label>
                <input
                  type="password"
                  value={newUserData.password}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-900 focus:border-blue-900"
                  placeholder="Leave empty for default password"
                />
                <p className="text-xs text-gray-500 mt-1">
                  If left empty, a temporary password will be set. User should change it on first login.
                </p>
              </div>

              {newUserData.password && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={newUserData.confirmPassword}
                    onChange={(e) =>
                      setNewUserData({
                        ...newUserData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-900 focus:border-blue-900"
                    placeholder="Confirm password"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    creating
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-900 hover:bg-[#1e88b5]"
                  }`}
                >
                  {creating ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
