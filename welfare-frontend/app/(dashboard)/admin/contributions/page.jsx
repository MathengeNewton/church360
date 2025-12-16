"use client";
import { useState, useEffect } from "react";
import { apiClient } from "../../../../lib/api";
import { toast } from "react-toastify";

const ContributionsPage = () => {
  const [monthlyContributions, setMonthlyContributions] = useState([]);
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFamily, setFilterFamily] = useState("all");

  useEffect(() => {
    loadData();
  }, [filterStatus, filterFamily]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [monthlyRes, familiesRes] = await Promise.all([
        apiClient.monthlyContributions.getAll(
          filterFamily !== "all" ? { familyId: filterFamily } : {}
        ),
        apiClient.families.getAll(),
      ]);

      let filtered = monthlyRes.data;
      if (filterStatus !== "all") {
        filtered = filtered.filter((mc) => mc.status === filterStatus);
      }

      setMonthlyContributions(filtered);
      setFamilies(familiesRes.data);
    } catch (error) {
      toast.error("Failed to load contributions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getFamilyName = (annualContributionId) => {
    // We'd need to load annual contributions to get family name
    // For now, just show the ID
    return `Annual Contribution ${annualContributionId}`;
  };

  const getMonthName = (month) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month - 1] || month;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
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
            Monthly Contributions
          </h1>
          <p className="text-gray-600 mt-1">
            View monthly contribution status and payments
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={filterFamily}
            onChange={(e) => setFilterFamily(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="all">All Families</option>
            {families.map((family) => (
              <option key={family.id} value={family.id}>
                {family.name}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Month/Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Expected Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Paid Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyContributions.map((contrib) => {
                const remaining =
                  Number(contrib.expectedAmount) - Number(contrib.paidAmount);
                return (
                  <tr key={contrib.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getMonthName(contrib.month)} {contrib.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      KES {Number(contrib.expectedAmount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      KES {Number(contrib.paidAmount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      KES {remaining.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(contrib.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          contrib.status
                        )}`}
                      >
                        {contrib.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContributionsPage;
