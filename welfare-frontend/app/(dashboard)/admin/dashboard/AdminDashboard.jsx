// Welfare Admin Dashboard
// Focused on welfare organization metrics: families, contributions, payments, distributions

"use client";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { apiClient } from "../../../../lib/api";
import { toast } from "react-toastify";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const WelfareAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalFamilies: 0,
    totalAnnualContributions: 0,
    totalPaymentsReceived: 0,
    undistributedPayments: 0,
    overdueContributions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [paymentTrends, setPaymentTrends] = useState([]);
  const [contributionStatus, setContributionStatus] = useState({
    paid: 0,
    partial: 0,
    pending: 0,
    overdue: 0,
  });
  const [recentPayments, setRecentPayments] = useState([]);
  const [familiesWithOverdue, setFamiliesWithOverdue] = useState([]);

  useEffect(() => {
    loadDashboardData();
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load all data in parallel
      const [
        familiesRes,
        annualContributionsRes,
        paymentsRes,
        undistributedPaymentsRes,
        overdueContributionsRes,
        monthlyContributionsRes,
      ] = await Promise.all([
        apiClient.families.getAll().catch(() => ({ data: [] })),
        apiClient.annualContributions.getAll().catch(() => ({ data: [] })),
        apiClient.payments.getAll().catch(() => ({ data: [] })),
        apiClient.payments.getUndistributed().catch(() => ({ data: [] })),
        apiClient.monthlyContributions.getOverdue().catch(() => ({ data: [] })),
        apiClient.monthlyContributions.getAll().catch(() => ({ data: [] })),
      ]);

      const families = familiesRes.data || [];
      const annualContributions = annualContributionsRes.data || [];
      const payments = paymentsRes.data || [];
      const undistributedPayments = undistributedPaymentsRes.data || [];
      const overdueContributions = overdueContributionsRes.data || [];
      const monthlyContributions = monthlyContributionsRes.data || [];

      // Calculate stats
      const totalAnnualAmount = annualContributions.reduce(
        (sum, ac) => sum + Number(ac.annualAmount || 0),
        0
      );
      const totalPaymentsAmount = payments.reduce(
        (sum, p) => sum + Number(p.amount || 0),
        0
      );
      const totalUndistributed = undistributedPayments.reduce(
        (sum, p) => sum + (Number(p.amount || 0) - Number(p.distributedAmount || 0)),
        0
      );

      // Calculate contribution status
      const statusCounts = {
        paid: 0,
        partial: 0,
        pending: 0,
        overdue: 0,
      };
      monthlyContributions.forEach((mc) => {
        statusCounts[mc.status] = (statusCounts[mc.status] || 0) + 1;
      });

      // Get recent payments (last 10)
      const recentPaymentsList = payments
        .sort(
          (a, b) =>
            new Date(b.paymentDate) - new Date(a.paymentDate)
        )
        .slice(0, 10);

      // Recent distributions removed (no longer using campaigns)

      // Get families with overdue contributions
      const familyOverdueMap = new Map();
      overdueContributions.forEach((oc) => {
        // We'd need to get family info from annual contribution
        // For now, group by annual contribution
        const key = oc.annualContributionId;
        if (!familyOverdueMap.has(key)) {
          familyOverdueMap.set(key, {
            annualContributionId: key,
            overdueCount: 0,
            totalOverdue: 0,
          });
        }
        const entry = familyOverdueMap.get(key);
        entry.overdueCount += 1;
        entry.totalOverdue +=
          Number(oc.expectedAmount || 0) - Number(oc.paidAmount || 0);
      });

      // Payment trends (last 6 months)
      const now = new Date();
      const last6Months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthPayments = payments.filter((p) => {
          const paymentDate = new Date(p.paymentDate);
          return (
            paymentDate.getMonth() === date.getMonth() &&
            paymentDate.getFullYear() === date.getFullYear()
          );
        });
        const total = monthPayments.reduce(
          (sum, p) => sum + Number(p.amount || 0),
          0
        );
        last6Months.push({
          month: date.toLocaleDateString("en-US", { month: "short" }),
          amount: total,
        });
      }

      setStats({
        totalFamilies: families.length,
        totalAnnualContributions: totalAnnualAmount,
        totalPaymentsReceived: totalPaymentsAmount,
        undistributedPayments: totalUndistributed,
        overdueContributions: overdueContributions.length,
      });

      setPaymentTrends(last6Months);
      setContributionStatus(statusCounts);
      setRecentPayments(recentPaymentsList);
      setFamiliesWithOverdue(Array.from(familyOverdueMap.values()).slice(0, 5));
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Payment Trends Chart (Line Chart)
  const paymentTrendsData = {
    labels: paymentTrends.map((t) => t.month),
    datasets: [
      {
        label: "Payments Received (KES)",
        data: paymentTrends.map((t) => t.amount),
        borderColor: "#0D47A1",
        backgroundColor: "rgba(13, 71, 161, 0.1)",
        tension: 0.4,
      },
    ],
  };

  // Contribution Status Chart (Doughnut)
  const contributionStatusData = {
    labels: ["Paid", "Partial", "Pending", "Overdue"],
    datasets: [
      {
        data: [
          contributionStatus.paid,
          contributionStatus.partial,
          contributionStatus.pending,
          contributionStatus.overdue,
        ],
        backgroundColor: ["#10b981", "#f59e0b", "#3b82f6", "#ef4444"],
        hoverOffset: 8,
      },
    ],
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="w-full lg:p-2 space-y-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Welcome, Welfare Admin
        </h1>
        <p className="text-gray-600 mt-1">
          Manage welfare contributions, payments, and distributions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Families</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalFamilies.toLocaleString()}
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
              <p className="text-sm text-gray-600">Annual Contributions</p>
              <p className="text-2xl font-bold text-gray-900">
                KES {(stats.totalAnnualContributions / 1000).toFixed(1)}K
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Payments Received</p>
              <p className="text-2xl font-bold text-[#0D47A1]">
                KES {(stats.totalPaymentsReceived / 1000).toFixed(1)}K
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
              <p className="text-sm text-gray-600">Undistributed</p>
              <p className="text-2xl font-bold text-orange-600">
                KES {(stats.undistributedPayments / 1000).toFixed(1)}K
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.overdueContributions}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg
                className="w-7 h-7 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
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
            Payment Trends (Last 6 Months)
          </h3>
          <Line
            data={paymentTrendsData}
            options={{ responsive: true, maintainAspectRatio: true }}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Contribution Status
          </h3>
          <div className="h-64">
            <Doughnut
              data={contributionStatusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "right" } },
              }}
            />
          </div>
        </div>

      </div>

      {/* Bottom Row: Recent Payments + Families with Overdue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Payments
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <tbody className="divide-y divide-gray-200">
                {recentPayments.slice(0, 5).map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-5 py-4 text-sm text-gray-900">
                      Payment #{payment.id}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      KES {Number(payment.amount).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.status === "distributed"
                            ? "bg-green-100 text-green-800"
                            : payment.status === "partial"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentPayments.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-5 py-4 text-center text-gray-500">
                      No payments recorded yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Families with Overdue Contributions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Families with Overdue Contributions
            </h3>
          </div>
          <div className="p-5">
            {familiesWithOverdue.length > 0 ? (
              familiesWithOverdue.map((family, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-400">
                      #{i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        Family {family.annualContributionId}
                      </p>
                      <p className="text-sm text-gray-500">
                        {family.overdueCount} overdue months
                      </p>
                    </div>
                  </div>
                  <span className="text-red-600 font-semibold">
                    KES {family.totalOverdue.toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No overdue contributions
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/admin/annual-contributions"
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-center"
          >
            <p className="font-semibold text-blue-900">Create Annual Contribution</p>
          </a>
          <a
            href="/admin/payments"
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition text-center"
          >
            <p className="font-semibold text-green-900">Record Payment</p>
          </a>
          <a
            href="/admin/notices"
            className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-center"
          >
            <p className="font-semibold text-purple-900">Create Notice</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default WelfareAdminDashboard;
