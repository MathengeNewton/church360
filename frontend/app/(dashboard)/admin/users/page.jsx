// app/(dashboard)/admin/users/page.jsx
// Users page: List of users with roles (admin, members, group-leader). UI for create/edit/delete (using simple modals with useState).
// Mock data for PCEA church users in Kenya. Aesthetics: white cards, shadows, borders, similar to dashboard.
// Table for listing, buttons for actions.

"use client";
import { useState } from "react";

const mockUsers = [
  {
    id: 1,
    name: "John Kamau",
    email: "john@pcea.or.ke",
    role: "admin",
    region: "Nairobi",
  },
  {
    id: 2,
    name: "Mary Wanjiku",
    email: "mary@pcea.or.ke",
    role: "member",
    region: "Thika",
  },
  {
    id: 3,
    name: "Peter Mutua",
    email: "peter@pcea.or.ke",
    role: "group-leader",
    region: "Kiambu",
  },
  {
    id: 4,
    name: "Anne Njeri",
    email: "anne@pcea.or.ke",
    role: "member",
    region: "Nakuru",
  },
  {
    id: 5,
    name: "David Ochieng",
    email: "david@pcea.or.ke",
    role: "group-leader",
    region: "Kisumu",
  },
];

const UsersPage = () => {
  const [users, setUsers] = useState(mockUsers);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "member",
    region: "",
  });

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "member", region: "" });
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData(user);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(
        users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u))
      );
    } else {
      setUsers([...users, { id: users.length + 1, ...formData }]);
    }
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full space-y-8 bg-gray-50 min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Users Management
        </h1>
        <p className="text-gray-600 mt-1">Manage PCEA church users and roles</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">User List</h3>
          <button
            onClick={handleCreate}
            className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-[#1e88b5]"
          >
            Create User
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              {editingUser ? "Edit User" : "Create User"}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 border rounded mb-2"
                required
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="group-leader">Group Leader</option>
              </select>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                placeholder="Region"
                className="w-full p-2 border rounded mb-4"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-900 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
