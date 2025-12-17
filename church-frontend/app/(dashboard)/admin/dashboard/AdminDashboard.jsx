"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "../../../../lib/api";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboardPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalDistricts: 0,
    totalSermons: 0,
    publishedSermons: 0,
    totalAnnouncements: 0,
    activeAnnouncements: 0,
    upcomingEvents: 0,
    tithesThisMonth: "KES 482,000",
  });
  const [recentSermons, setRecentSermons] = useState([]);
  const [activeAnnouncements, setActiveAnnouncements] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load districts
      const districtsRes = await apiClient.districts.getAll();
      const districts = districtsRes.data || [];
      const totalDistricts = districts.length;
      const totalMembers = districts.reduce((sum, d) => sum + (d.memberCount || 0), 0);

      // Load sermons
      const sermonsRes = await apiClient.sermons.getAll();
      const sermons = sermonsRes.data || [];
      const totalSermons = sermons.length;
      const publishedSermons = sermons.filter((s) => s.isPublished).length;
      const recentSermonsList = sermons
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      // Load announcements
      const announcementsRes = await apiClient.announcements.getActive();
      const announcements = announcementsRes.data || [];
      const totalAnnouncementsRes = await apiClient.announcements.getAll();
      const allAnnouncements = totalAnnouncementsRes.data || [];
      const activeAnnouncementsList = announcements.slice(0, 5);

      setStats({
        totalMembers,
        totalDistricts,
        totalSermons,
        publishedSermons,
        totalAnnouncements: allAnnouncements.length,
        activeAnnouncements: announcements.length,
        upcomingEvents: 5,
        tithesThisMonth: "KES 482,000",
      });
      setRecentSermons(recentSermonsList);
      setActiveAnnouncements(activeAnnouncementsList);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Membership Growth Over Time (Line Chart)
  const membershipGrowthData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Total Registered Members",
        data: [
          1800, 1850, 1870, 1900, 1930, 1950, 1970, 1990, 2000, 2020, 2040,
          stats.totalMembers || 2050,
        ],
        borderColor: "#0D47A1",
        backgroundColor: "rgba(13, 71, 161, 0.1)",
        tension: 0.4,
      },
    ],
  };

  // Tithes & Offerings by Month (Bar Chart)
  const offeringsData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
    ],
    datasets: [
      {
        label: "Tithes & Offerings (KES Thousands)",
        data: [380, 420, 510, 460, 490, 480, 450, 470, 500, 490, 482],
        backgroundColor: "#0D47A1",
      },
    ],
  };

  // Members by Age Group (Doughnut Chart)
  const ageDistributionData = {
    labels: [
      "Children (0-12)",
      "Youth (13-35)",
      "Adults (36-60)",
      "Seniors (60+)",
    ],
    datasets: [
      {
        data: [450, 800, 600, 200],
        backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"],
        hoverOffset: 8,
      },
    ],
  };

  if (loading) {
    return (
      <div className="w-full lg:p-2 space-y-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="w-full lg:p-2 space-y-8 bg-gray-50 min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            PCEA Church Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/admin/sermons")}
            className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-[#1e88b5] transition-colors text-sm"
          >
            Create Sermon
          </button>
          <button
            onClick={() => router.push("/admin/announcements")}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            Create Announcement
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-5">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalMembers.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg
                className="w-7 h-7 text-[#0D47A1]"
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
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Districts</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalDistricts}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg
                className="w-7 h-7 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-4m-6 0H5"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sermons</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.publishedSermons}/{stats.totalSermons}
              </p>
              <p className="text-xs text-gray-500">Published/Total</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg
                className="w-7 h-7 text-purple-600"
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
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Announcements</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.activeAnnouncements}/{stats.totalAnnouncements}
              </p>
              <p className="text-xs text-gray-500">Active/Total</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg
                className="w-7 h-7 text-yellow-600"
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
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tithes This Month</p>
              <p className="text-2xl font-bold text-[#0D47A1]">
                {stats.tithesThisMonth}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg
                className="w-7 h-7 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.upcomingEvents}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <svg
                className="w-7 h-7 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Membership Growth (2025)
          </h3>
          <Line data={membershipGrowthData} options={{ responsive: true }} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Tithes & Offerings (2025)
          </h3>
          <Bar data={offeringsData} options={{ responsive: true }} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Members by Age Group
          </h3>
          <div className="h-64">
            <Doughnut
              data={ageDistributionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "right" } },
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Sermons + Active Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sermons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Sermons
            </h3>
            <button
              onClick={() => router.push("/admin/sermons")}
              className="text-sm text-blue-900 hover:text-blue-700"
            >
              View All →
            </button>
          </div>
          <div className="p-5">
            {recentSermons.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                No sermons yet. Create your first sermon!
              </p>
            ) : (
              recentSermons.map((sermon) => (
                <div
                  key={sermon.id}
                  className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{sermon.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {sermon.preacher && (
                        <p className="text-sm text-gray-500">
                          {sermon.preacher}
                        </p>
                      )}
                      {sermon.sermonDate && (
                        <p className="text-sm text-gray-500">
                          • {new Date(sermon.sermonDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {sermon.bibleVerses && sermon.bibleVerses.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {sermon.bibleVerses.slice(0, 2).map((verse, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded"
                          >
                            {verse}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      sermon.isPublished
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {sermon.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Announcements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Active Announcements
            </h3>
            <button
              onClick={() => router.push("/admin/announcements")}
              className="text-sm text-blue-900 hover:text-blue-700"
            >
              View All →
            </button>
          </div>
          <div className="p-5">
            {activeAnnouncements.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                No active announcements. Create one now!
              </p>
            ) : (
              activeAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">
                        {announcement.title}
                      </p>
                      <span
                        className={`px-2 py-0.5 text-xs rounded ${
                          announcement.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : announcement.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {announcement.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {announcement.content}
                    </p>
                    {announcement.publishedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Published:{" "}
                        {new Date(announcement.publishedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {announcement.isMobileAppVisible && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded ml-2">
                      Mobile
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
