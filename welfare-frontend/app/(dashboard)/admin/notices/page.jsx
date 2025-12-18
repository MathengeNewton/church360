"use client";
import { useState, useEffect } from "react";
import { apiClient } from "../../../../lib/api";
import { toast } from "react-toastify";

const NoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "notice",
    priority: "medium",
    targetAudience: "all",
    targetFamilyIds: [],
    expiresAt: "",
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.notices.getAll();
      setNotices(res.data);
    } catch (error) {
      toast.error("Failed to load notices");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      title: "",
      content: "",
      type: "notice",
      priority: "medium",
      targetAudience: "all",
      targetFamilyIds: [],
      expiresAt: "",
      isActive: true,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.notices.create({
        ...formData,
        targetFamilyIds:
          formData.targetAudience === "specific"
            ? formData.targetFamilyIds
            : undefined,
        expiresAt: formData.expiresAt || undefined,
      });
      toast.success("Notice created successfully");
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create notice");
    }
  };

  const handlePublish = async (id) => {
    try {
      await apiClient.notices.publish(id);
      toast.success("Notice published successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to publish notice");
    }
  };

  const handleExpire = async (id) => {
    try {
      await apiClient.notices.expire(id);
      toast.success("Notice expired successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to expire notice");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    try {
      await apiClient.notices.delete(id);
      toast.success("Notice deleted successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to delete notice");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "announcement":
        return "bg-blue-100 text-blue-800";
      case "reminder":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 bg-gray-50 min-h-screen p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Notices & Announcements
          </h1>
          <p className="text-gray-600 mt-1">
            Manage church notices and announcements
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-[#1e88b5]"
        >
          Create Notice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {notice.title}
              </h3>
              <div className="flex gap-1">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                    notice.type
                  )}`}
                >
                  {notice.type}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                    notice.priority
                  )}`}
                >
                  {notice.priority}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {notice.content}
            </p>
            <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
              <span>
                {notice.publishedAt
                  ? new Date(notice.publishedAt).toLocaleDateString()
                  : "Not published"}
              </span>
              <span
                className={`px-2 py-1 rounded-full ${
                  notice.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {notice.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex gap-2">
              {!notice.publishedAt && (
                <button
                  onClick={() => handlePublish(notice.id)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Publish
                </button>
              )}
              {notice.isActive && (
                <button
                  onClick={() => handleExpire(notice.id)}
                  className="text-orange-600 hover:text-orange-800 text-sm"
                >
                  Expire
                </button>
              )}
              <button
                onClick={() => handleDelete(notice.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create Notice</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Title"
                className="w-full p-2 border rounded mb-2"
                required
              />
              <textarea
                name="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Content"
                className="w-full p-2 border rounded mb-2"
                rows="5"
                required
              />
              <select
                name="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              >
                <option value="notice">Notice</option>
                <option value="announcement">Announcement</option>
                <option value="reminder">Reminder</option>
              </select>
              <select
                name="priority"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select
                name="targetAudience"
                value={formData.targetAudience}
                onChange={(e) =>
                  setFormData({ ...formData, targetAudience: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              >
                <option value="all">All</option>
                <option value="families">All Families</option>
                <option value="specific">Specific Families</option>
              </select>
              <input
                type="date"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={(e) =>
                  setFormData({ ...formData, expiresAt: e.target.value })
                }
                placeholder="Expires At (optional)"
                className="w-full p-2 border rounded mb-4"
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticesPage;


