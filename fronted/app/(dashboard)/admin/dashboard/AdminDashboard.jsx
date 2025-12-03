// app/(dashboard)/admin/dashboard/page.jsx
// Updated for single parish: PCEA Lang'ata
// Scaled down numbers, replaced activeParishes with totalRegions
// Replaced Top 5 Active Parishes with Top 5 Regions by Members
// Removed parish from recentActivities, updated dates
// Added Line chart for membership growth
// Aesthetics remain the same

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
    totalMembers: 2050,
    totalRegions: 5,
    upcomingEvents: 5,
    tithesThisMonth: "KES 482,000",
  });

  // Simulate live updates
  useEffect(() => {
    const timer = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        tithesThisMonth: `KES ${(0.45 + Math.random() * 0.08).toFixed(1)}M`,
      }));
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Membership Growth Over Time (Line Chart) - scaled down
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
          2050,
        ],
        borderColor: "#0D47A1",
        backgroundColor: "rgba(13, 71, 161, 0.1)",
        tension: 0.4,
      },
    ],
  };

  // Tithes & Offerings by Month (Bar Chart) - scaled down
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

  // Members by Age Group (Doughnut Chart) - scaled down
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

  // Top 5 Regions by Members
  const topRegions = [
    { region: "Nairobi CBD", members: 600, attendance: "95%" },
    { region: "Ruiru", members: 500, attendance: "92%" },
    { region: "Kiambu", members: 400, attendance: "89%" },
    { region: "Mombasa Road", members: 300, attendance: "88%" },
    { region: "Thika Road", members: 250, attendance: "85%" },
  ];

  // Recent Activities (updated dates, no parish)
  const recentActivities = [
    {
      id: 1,
      activity: "New Members Induction",
      status: "Completed",
      date: "2025-11-17",
    },
    {
      id: 2,
      activity: "Youth Conference Registration",
      status: "In Progress",
      date: "2025-11-18",
    },
    {
      id: 3,
      activity: "Christmas Cantata Rehearsal",
      status: "Scheduled",
      date: "2025-12-10",
    },
    {
      id: 4,
      activity: "Mission Trip to Turkana",
      status: "Planning",
      date: "2025-12-15",
    },
    {
      id: 5,
      activity: "Presbytery Meeting",
      status: "Upcoming",
      date: "2025-12-20",
    },
  ];

  return (
    <div className="w-full lg:p-2 space-y-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          PCEA CBD Admin Dashboard
        </h1>
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
              <p className="text-sm text-gray-600">Total Regions</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalRegions}
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

      {/* Charts Row - added membership growth */}
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

      {/* Bottom Row: Top Regions + Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Regions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Top 5 Regions by Members
            </h3>
          </div>
          <div className="p-5">
            {topRegions.map((r, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-400">
                    #{i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{r.region}</p>
                    <p className="text-sm text-gray-500">{r.members} members</p>
                  </div>
                </div>
                <span className="text-green-600 font-semibold">
                  {r.attendance}
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
                      {act.date}
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
