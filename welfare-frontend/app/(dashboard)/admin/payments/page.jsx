"use client";
import { useState, useEffect } from "react";
import { apiClient } from "../../../../lib/api";
import { toast } from "react-toastify";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

export default function PaymentsPage() {
  const [families, setFamilies] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [familySearch, setFamilySearch] = useState("");
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "cash",
    reference: "",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [familiesRes, paymentsRes] = await Promise.all([
        apiClient.families.getAll(),
        apiClient.payments.getAll(),
      ]);
      setFamilies(familiesRes.data || []);
      setPayments(paymentsRes.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const filteredFamilies = families.filter((family) => {
    if (!familySearch) return false;
    const query = familySearch.toLowerCase();
    return family.name?.toLowerCase().includes(query);
  });

  const handleFamilySelect = (family) => {
    setSelectedFamily(family);
    setFamilySearch(family.name);
    
    // Get primary member and spouse for user selection
    const primaryMember = family.members?.find(
      (m) => m.role === "PRIMARY_MEMBER"
    );
    const spouse = family.members?.find((m) => m.role === "SPOUSE");
    
    // Set primary member as default selected user
    if (primaryMember) {
      setSelectedUser(primaryMember.user);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFamily) {
      toast.error("Please select a family");
      return;
    }

    if (!selectedUser) {
      toast.error("Please select a user (primary member or spouse)");
      return;
    }

    // Verify selected user is primary member or spouse
    const isPrimaryMember = selectedFamily.members?.some(
      (m) => m.user.id === selectedUser.id && m.role === "PRIMARY_MEMBER"
    );
    const isSpouse = selectedFamily.members?.some(
      (m) => m.user.id === selectedUser.id && m.role === "SPOUSE"
    );

    if (!isPrimaryMember && !isSpouse) {
      toast.error("Selected user must be the primary member or spouse");
      return;
    }

    try {
      const payload = {
        familyId: selectedFamily.id,
        userId: selectedUser.id,
        amount: parseFloat(formData.amount),
        paymentDate: formData.paymentDate,
        paymentMethod: formData.paymentMethod,
        reference: formData.reference || undefined,
        notes: formData.notes || undefined,
      };

      await apiClient.payments.create(payload);
      toast.success("Payment recorded and distributed successfully!");
      
      // Reset form
      setSelectedFamily(null);
      setSelectedUser(null);
      setFamilySearch("");
      setFormData({
        amount: "",
        paymentDate: new Date().toISOString().split("T")[0],
        paymentMethod: "cash",
        reference: "",
        notes: "",
      });
      setShowPaymentModal(false);
      
      // Reload data
      loadData();
    } catch (error) {
      console.error("Error creating payment:", error);
      toast.error(
        error.response?.data?.message || "Failed to record payment"
      );
    }
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      cash: "Cash",
      mpesa: "M-Pesa",
      bank: "Bank Transfer",
      cheque: "Cheque",
    };
    return labels[method] || method;
  };

  const getStatusBadge = (status) => {
    const badges = {
      distributed: "bg-green-100 text-green-800",
      partial: "bg-yellow-100 text-yellow-800",
      undistributed: "bg-gray-100 text-gray-800",
    };
    return badges[status] || badges.undistributed;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Payments
          </h1>
          <p className="text-gray-600 mt-1">
            Record payments and distribute to monthly contributions
          </p>
        </div>
        <button
          onClick={() => setShowPaymentModal(true)}
          className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-[#1e88b5] transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Record Payment
        </button>
      </div>

      {/* Payments List */}
      {payments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <CurrencyDollarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Payments Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start by recording your first payment
          </p>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-[#1e88b5] transition-colors inline-flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Record Payment
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Family
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distributed
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.family?.name || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    KES {Number(payment.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getPaymentMethodLabel(payment.paymentMethod)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    KES {Number(payment.distributedAmount || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Record Payment
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Payment will be automatically distributed to monthly contributions chronologically
                </p>
              </div>
              <div className="p-6 space-y-6">
                {/* Family Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Family *
                  </label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={familySearch}
                      onChange={(e) => {
                        setFamilySearch(e.target.value);
                        if (!e.target.value) {
                          setSelectedFamily(null);
                          setSelectedUser(null);
                        }
                      }}
                      placeholder="Type family name to search..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-900 focus:border-blue-900"
                      required
                    />
                  </div>
                  {familySearch && filteredFamilies.length > 0 && (
                    <div className="mt-2 border border-gray-200 rounded-md shadow-lg bg-white max-h-48 overflow-y-auto">
                      {filteredFamilies.map((family) => (
                        <button
                          key={family.id}
                          type="button"
                          onClick={() => handleFamilySelect(family)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                        >
                          <p className="font-medium text-gray-900">{family.name}</p>
                          {family.address && (
                            <p className="text-sm text-gray-500">{family.address}</p>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedFamily && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm font-medium text-blue-900">
                        Selected: {selectedFamily.name}
                      </p>
                    </div>
                  )}
                </div>

                {/* User Selection */}
                {selectedFamily && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paying Member (Primary Member or Spouse) *
                    </label>
                    <select
                      value={selectedUser?.id || ""}
                      onChange={(e) => {
                        const userId = parseInt(e.target.value);
                        const member = selectedFamily.members?.find(
                          (m) => m.user.id === userId
                        );
                        if (member && (member.role === "PRIMARY_MEMBER" || member.role === "SPOUSE")) {
                          setSelectedUser(member.user);
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-900 focus:border-blue-900"
                      required
                    >
                      <option value="">Select paying member</option>
                      {selectedFamily.members
                        ?.filter(
                          (m) =>
                            m.role === "PRIMARY_MEMBER" || m.role === "SPOUSE"
                        )
                        .map((member) => (
                          <option key={member.user.id} value={member.user.id}>
                            {member.user.username} (
                            {member.role === "PRIMARY_MEMBER"
                              ? "Primary Member"
                              : "Spouse"}
                            )
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (KES) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-900 focus:border-blue-900"
                    placeholder="0.00"
                    required
                  />
                </div>

                {/* Payment Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-900 focus:border-blue-900"
                    required
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentMethod: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-900 focus:border-blue-900"
                    required
                  >
                    <option value="cash">Cash</option>
                    <option value="mpesa">M-Pesa</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>

                {/* Reference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reference Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={(e) =>
                      setFormData({ ...formData, reference: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-900 focus:border-blue-900"
                    placeholder="e.g., MPESA123456"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-900 focus:border-blue-900"
                    placeholder="Additional notes about this payment"
                  />
                </div>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedFamily(null);
                    setSelectedUser(null);
                    setFamilySearch("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-[#1e88b5]"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
