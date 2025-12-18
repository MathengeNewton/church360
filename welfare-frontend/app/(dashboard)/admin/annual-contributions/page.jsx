"use client";
import { useState, useEffect } from "react";
import { apiClient } from "../../../../lib/api";
import { toast } from "react-toastify";

const AnnualContributionsPage = () => {
  const [contributions, setContributions] = useState([]);
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCarryoverModal, setShowCarryoverModal] = useState(false);
  const [formData, setFormData] = useState({
    familyId: "",
    year: new Date().getFullYear(),
    annualAmount: "",
    carriedOverAmount: 0,
  });
  const [carryoverData, setCarryoverData] = useState({
    familyId: "",
    fromYear: new Date().getFullYear() - 1,
    toYear: new Date().getFullYear(),
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const currentYear = new Date().getFullYear();
      const [contributionsRes, familiesRes] = await Promise.all([
        apiClient.annualContributions.getAll(),
        apiClient.families.getAll(),
      ]);
      // Filter to only show current year contributions
      const currentYearContributions = (contributionsRes.data || []).filter(
        (c) => c.year === currentYear
      );
      setContributions(currentYearContributions);
      setFamilies(familiesRes.data || []);
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      familyId: "",
      year: new Date().getFullYear(),
      annualAmount: "",
      carriedOverAmount: 0,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.annualContributions.create({
        familyId: parseInt(formData.familyId),
        year: parseInt(formData.year),
        annualAmount: parseFloat(formData.annualAmount),
        carriedOverAmount: parseFloat(formData.carriedOverAmount) || 0,
      });
      toast.success("Annual contribution created successfully");
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create contribution");
    }
  };

  const handleCarryover = async (e) => {
    e.preventDefault();
    try {
      await apiClient.annualContributions.carryOver({
        familyId: parseInt(carryoverData.familyId),
        fromYear: parseInt(carryoverData.fromYear),
        toYear: parseInt(carryoverData.toYear),
      });
      toast.success("Debt carried over successfully");
      setShowCarryoverModal(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to carry over debt");
    }
  };

  const getFamilyName = (familyId) => {
    const family = families.find((f) => f.id === familyId);
    return family?.name || `Family ${familyId}`;
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
            Annual Contributions
          </h1>
          <p className="text-gray-600 mt-1">
            Manage annual recurrent contributions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCarryoverModal(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
          >
            Carry Over Debt
          </button>
          <button
            onClick={handleCreate}
            className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-[#1e88b5]"
          >
            Create Annual Contribution
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Family
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Annual Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Monthly Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Carried Over
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contributions.map((contrib) => (
                <tr key={contrib.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getFamilyName(contrib.familyId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contrib.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    KES {Number(contrib.annualAmount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    KES {Number(contrib.monthlyAmount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    KES {Number(contrib.totalPaid).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    KES {Number(contrib.carriedOverAmount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        contrib.status === "active"
                          ? "bg-green-100 text-green-800"
                          : contrib.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {contrib.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Create Annual Contribution
            </h3>
            <form onSubmit={handleSubmit}>
              <select
                name="familyId"
                value={formData.familyId}
                onChange={(e) =>
                  setFormData({ ...formData, familyId: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
                required
              >
                <option value="">Select Family</option>
                {families.map((family) => (
                  <option key={family.id} value={family.id}>
                    {family.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                placeholder="Year"
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="number"
                name="annualAmount"
                value={formData.annualAmount}
                onChange={(e) =>
                  setFormData({ ...formData, annualAmount: e.target.value })
                }
                placeholder="Annual Amount"
                className="w-full p-2 border rounded mb-2"
                required
                step="0.01"
              />
              <input
                type="number"
                name="carriedOverAmount"
                value={formData.carriedOverAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    carriedOverAmount: e.target.value,
                  })
                }
                placeholder="Carried Over Amount (optional)"
                className="w-full p-2 border rounded mb-4"
                step="0.01"
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

      {/* Carryover Modal */}
      {showCarryoverModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Carry Over Debt</h3>
            <form onSubmit={handleCarryover}>
              <select
                name="familyId"
                value={carryoverData.familyId}
                onChange={(e) =>
                  setCarryoverData({ ...carryoverData, familyId: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
                required
              >
                <option value="">Select Family</option>
                {families.map((family) => (
                  <option key={family.id} value={family.id}>
                    {family.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="fromYear"
                value={carryoverData.fromYear}
                onChange={(e) =>
                  setCarryoverData({ ...carryoverData, fromYear: e.target.value })
                }
                placeholder="From Year"
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="number"
                name="toYear"
                value={carryoverData.toYear}
                onChange={(e) =>
                  setCarryoverData({ ...carryoverData, toYear: e.target.value })
                }
                placeholder="To Year"
                className="w-full p-2 border rounded mb-4"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCarryoverModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 text-white px-4 py-2 rounded"
                >
                  Carry Over
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnualContributionsPage;


