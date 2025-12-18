"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { apiClient } from "../../../../lib/api";
import { toast } from "react-toastify";

const CampaignsPage = () => {
  const searchParams = useSearchParams();
  const paymentIdParam = searchParams?.get("paymentId") || null;

  const [campaigns, setCampaigns] = useState([]);
  const [payments, setPayments] = useState([]);
  const [monthlyContributions, setMonthlyContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    paymentId: paymentIdParam || "",
    familyId: "",
    distributions: [],
  });

  useEffect(() => {
    loadData();
    if (paymentIdParam) {
      setShowModal(true);
      loadPaymentData(paymentIdParam);
    }
  }, [paymentIdParam]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [campaignsRes, paymentsRes] = await Promise.all([
        apiClient.campaigns.getAll(),
        apiClient.payments.getUndistributed(),
      ]);
      setCampaigns(campaignsRes.data);
      setPayments(paymentsRes.data);
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentData = async (paymentId) => {
    try {
      const payment = await apiClient.payments.getOne(paymentId);
      setSelectedPayment(payment.data);
      setFormData((prev) => ({
        ...prev,
        paymentId: paymentId,
        familyId: payment.data.familyId,
      }));

      // Load unpaid monthly contributions for this family
      const monthlyRes = await apiClient.monthlyContributions.getAll({
        familyId: payment.data.familyId,
      });
      const unpaid = monthlyRes.data.filter(
        (mc) => Number(mc.paidAmount) < Number(mc.expectedAmount)
      );
      setMonthlyContributions(unpaid);
    } catch (error) {
      toast.error("Failed to load payment data");
      console.error(error);
    }
  };

  const handleCreate = () => {
    setFormData({
      name: "",
      description: "",
      paymentId: "",
      familyId: "",
      distributions: [],
    });
    setSelectedPayment(null);
    setShowModal(true);
  };

  const handlePaymentSelect = async (paymentId) => {
    await loadPaymentData(paymentId);
  };

  const handleAddDistribution = () => {
    setFormData((prev) => ({
      ...prev,
      distributions: [
        ...prev.distributions,
        { monthlyContributionId: "", amount: "" },
      ],
    }));
  };

  const handleDistributionChange = (index, field, value) => {
    setFormData((prev) => {
      const newDistributions = [...prev.distributions];
      newDistributions[index] = {
        ...newDistributions[index],
        [field]: value,
      };
      return { ...prev, distributions: newDistributions };
    });
  };

  const handleRemoveDistribution = (index) => {
    setFormData((prev) => ({
      ...prev,
      distributions: prev.distributions.filter((_, i) => i !== index),
    }));
  };

  const handleAutoDistribute = async () => {
    if (!selectedPayment) {
      toast.error("Please select a payment first");
      return;
    }
    try {
      await apiClient.campaigns.autoDistribute({
        paymentId: parseInt(selectedPayment.id),
      });
      toast.success("Payment auto-distributed successfully");
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to auto-distribute payment"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPayment) {
      toast.error("Please select a payment");
      return;
    }
    if (formData.distributions.length === 0) {
      toast.error("Please add at least one distribution");
      return;
    }

    try {
      await apiClient.campaigns.create({
        name: formData.name || `Distribution - Payment ${selectedPayment.id}`,
        description: formData.description,
        paymentId: parseInt(selectedPayment.id),
        familyId: parseInt(selectedPayment.familyId),
        distributions: formData.distributions.map((d) => ({
          monthlyContributionId: parseInt(d.monthlyContributionId),
          amount: parseFloat(d.amount),
        })),
      });
      toast.success("Campaign created successfully");
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create campaign"
      );
    }
  };

  const getRemainingAmount = (payment) => {
    if (!payment) return 0;
    return Number(payment.amount) - Number(payment.distributedAmount);
  };

  const getTotalDistributionAmount = () => {
    return formData.distributions.reduce(
      (sum, d) => sum + (parseFloat(d.amount) || 0),
      0
    );
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
            Campaigns (Payment Distribution)
          </h1>
          <p className="text-gray-600 mt-1">
            Distribute payments to monthly contributions
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-[#1e88b5]"
        >
          Create Distribution
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Campaign Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Distributed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{campaign.paymentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    KES {Number(campaign.totalDistributed).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(campaign.distributionDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        campaign.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribution Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              Create Distribution Campaign
            </h3>

            {/* Payment Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Select Payment
              </label>
              <select
                value={selectedPayment?.id || ""}
                onChange={(e) => handlePaymentSelect(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select a payment</option>
                {payments.map((payment) => (
                  <option key={payment.id} value={payment.id}>
                    Payment #{payment.id} - KES{" "}
                    {Number(payment.amount).toLocaleString()} (Remaining: KES{" "}
                    {getRemainingAmount(payment).toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {selectedPayment && (
              <>
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm">
                    <strong>Payment Amount:</strong> KES{" "}
                    {Number(selectedPayment.amount).toLocaleString()}
                  </p>
                  <p className="text-sm">
                    <strong>Already Distributed:</strong> KES{" "}
                    {Number(selectedPayment.distributedAmount).toLocaleString()}
                  </p>
                  <p className="text-sm font-semibold text-blue-900">
                    <strong>Remaining:</strong> KES{" "}
                    {getRemainingAmount(selectedPayment).toLocaleString()}
                  </p>
                </div>

                <div className="mb-4 flex gap-2">
                  <button
                    type="button"
                    onClick={handleAutoDistribute}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Auto-Distribute (Oldest First)
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Campaign Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., January Distribution"
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Manual Distribution
                    </label>
                    <button
                      type="button"
                      onClick={handleAddDistribution}
                      className="mb-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add Distribution
                    </button>

                    {formData.distributions.map((dist, index) => (
                      <div
                        key={index}
                        className="flex gap-2 mb-2 items-end"
                      >
                        <select
                          value={dist.monthlyContributionId}
                          onChange={(e) =>
                            handleDistributionChange(
                              index,
                              "monthlyContributionId",
                              e.target.value
                            )
                          }
                          className="flex-1 p-2 border rounded"
                          required
                        >
                          <option value="">Select Month</option>
                          {monthlyContributions.map((mc) => {
                            const remaining =
                              Number(mc.expectedAmount) - Number(mc.paidAmount);
                            return (
                              <option key={mc.id} value={mc.id}>
                                {mc.month}/{mc.year} - Expected: KES{" "}
                                {Number(mc.expectedAmount).toLocaleString()},
                                Paid: KES{" "}
                                {Number(mc.paidAmount).toLocaleString()},
                                Remaining: KES {remaining.toLocaleString()}
                              </option>
                            );
                          })}
                        </select>
                        <input
                          type="number"
                          value={dist.amount}
                          onChange={(e) =>
                            handleDistributionChange(
                              index,
                              "amount",
                              e.target.value
                            )
                          }
                          placeholder="Amount"
                          className="w-32 p-2 border rounded"
                          required
                          step="0.01"
                          min="0.01"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveDistribution(index)}
                          className="text-red-600 hover:text-red-800 px-2"
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <p className="text-sm">
                        <strong>Total Distribution:</strong> KES{" "}
                        {getTotalDistributionAmount().toLocaleString()}
                      </p>
                      <p className="text-sm">
                        <strong>Remaining:</strong> KES{" "}
                        {(
                          getRemainingAmount(selectedPayment) -
                          getTotalDistributionAmount()
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

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
                      Create Distribution
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignsPage;
