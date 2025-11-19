// AdminDashboard.tsx (or .jsx)
"use client";
import { useState, useEffect } from "react";
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
  const [stats, setStats] = useState({
    totalMembers: 12450,
    activeParishes: 68,
    // newMembersThisMonth: 87,
    upcomingEvents: 12,
    tithesThisMonth: "KES 4,820,000",
    // attendanceLastSunday: 8920,
  });

  // Simulate live updates
  useEffect(() => {
    const timer = setInterval(() => {
      setStats((prev) => ({
        ...prev,

        tithesThisMonth: `KES ${(4.5 + Math.random() * 0.8).toFixed(1)}M`,
      }));
    }, 8000);
    return () => clearInterval(timer);
  }, []);

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
    ],
    datasets: [
      {
        label: "Total Registered Members",
        data: [
          10800, 11050, 11200, 11500, 11800, 11950, 12080, 12190, 12250, 12370,
          12450,
        ],
        borderColor: "#0D47A1",
        backgroundColor: "rgba(13, 71, 161, 0.1)",
        tension: 0.4,
      },
    ],
  };

  // Tithes & Offerings by Month (Bar Chart)
  const offeringsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Tithes & Offerings (KES Millions)",
        data: [3.8, 4.2, 5.1, 4.6, 4.9, 4.8],
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
        data: [2850, 5200, 3600, 800],
        backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"],
        hoverOffset: 8,
      },
    ],
  };

  // Top 5 Active Parishes in Kenya
  const topParishes = [
    { parish: "PCEA Lang'ata", members: 890, attendance: "92%" },
    { parish: "PCEA Thika Road", members: 820, attendance: "88%" },
    { parish: "PCEA St. Andrews", members: 780, attendance: "95%" },
    { parish: "PCEA Juja", members: 710, attendance: "85%" },
    { parish: "PCEA Kiambu", members: 690, attendance: "89%" },
  ];

  // Recent Activities (Church-specific)
  const recentActivities = [
    {
      id: 1,
      activity: "New Members Induction",
      parish: "Lang'ata",
      status: "Completed",
      date: "2025-11-17",
    },
    {
      id: 2,
      activity: "Youth Conference Registration",
      parish: "Nairobi West",
      status: "In Progress",
      date: "2025-11-18",
    },
    {
      id: 3,
      activity: "Christmas Cantata Rehearsal",
      parish: "St. Andrews",
      status: "Scheduled",
      date: "2025-11-20",
    },
    {
      id: 4,
      activity: "Mission Trip to Turkana",
      parish: "Mission Dept",
      status: "Planning",
      date: "2025-11-22",
    },
    {
      id: 5,
      activity: "Presbytery Meeting",
      parish: "HQ Karen",
      status: "Upcoming",
      date: "2025-11-25",
    },
  ];

  return (
    <div className="w-full lg:p-2 space-y-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          PCEA National Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Presbyterian Church of East Africa • Kenya
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5">
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
              <p className="text-sm text-gray-600">Active Parishes</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.activeParishes}
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
      <div className="grid grid-cols-1 lg:grid-cols-2  gap-6">
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
            {" "}
            {/* fixed height */}
            <Doughnut
              data={ageDistributionData}
              options={{
                responsive: true,
                maintainAspectRatio: false, // important
                plugins: { legend: { position: "right" } },
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Row: Top Parishes + Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Parishes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Top 5 Active Parishes
            </h3>
          </div>
          <div className="p-5">
            {topParishes.map((p, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-400">
                    #{i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{p.parish}</p>
                    <p className="text-sm text-gray-500">{p.members} members</p>
                  </div>
                </div>
                <span className="text-green-600 font-semibold">
                  {p.attendance}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Church Activities
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <tbody className="divide-y divide-gray-200">
                {recentActivities.map((act) => (
                  <tr key={act.id}>
                    <td className="px-5 py-4 text-sm text-gray-900 font-medium">
                      {act.activity}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {act.parish}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          act.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : act.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {act.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
