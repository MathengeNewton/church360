"use client";
import { useState, useEffect } from "react";
import { apiClient } from "../../../../lib/api";
import { toast } from "react-toastify";
import UserSearch from "../../../../components/UserSearch";
import FamilyTree from "../../../../components/FamilyTree";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export default function FamiliesPage() {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [editingFamily, setEditingFamily] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    primaryMember: null,
    spouse: null,
    offsprings: [],
  });
  const [newOffspring, setNewOffspring] = useState({
    user: null,
    relationship: "",
  });

  useEffect(() => {
    loadFamilies();
    loadDistricts();
  }, []);

  const loadDistricts = async () => {
    try {
      const response = await apiClient.districts.getAll();
      setDistricts(response.data || []);
    } catch (error) {
      console.error("Error loading districts:", error);
    }
  };

  const loadFamilies = async () => {
    try {
      setLoading(true);
      const response = await apiClient.families.getAll();
      setFamilies(response.data || []);
    } catch (error) {
      console.error("Error loading families:", error);
      toast.error("Failed to load families");
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (familyId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(familyId)) {
      newExpanded.delete(familyId);
    } else {
      newExpanded.add(familyId);
    }
    setExpandedRows(newExpanded);
  };

  const handleCreate = () => {
    setEditingFamily(null);
    setFormData({
      name: "",
      address: "",
      primaryMember: null,
      spouse: null,
      offsprings: [],
    });
    setNewOffspring({ user: null, relationship: "" });
    setShowModal(true);
  };

  const handleEdit = (family) => {
    setEditingFamily(family);
    const primaryMember = family.members?.find(
      (m) => m.role === "PRIMARY_MEMBER"
    );
    const spouse = family.members?.find((m) => m.role === "SPOUSE");
    const offsprings = family.members?.filter((m) => m.role === "OFFSPRING");

    setFormData({
      name: family.name || "",
      address: family.address || "",
      primaryMember: primaryMember?.user || null,
      spouse: spouse?.user || null,
      offsprings: offsprings.map((o) => ({
        user: o.user,
        relationship: o.relationship || "",
      })),
    });
    setNewOffspring({ user: null, relationship: "" });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this family? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await apiClient.families.delete(id);
      toast.success("Family deleted successfully");
      loadFamilies();
    } catch (error) {
      console.error("Error deleting family:", error);
      toast.error(error.response?.data?.message || "Failed to delete family");
    }
  };

  const handleAddOffspring = () => {
    if (!newOffspring.user) {
      toast.error("Please select a user for the offspring");
      return;
    }
    setFormData({
      ...formData,
      offsprings: [...formData.offsprings, { ...newOffspring }],
    });
    setNewOffspring({ user: null, relationship: "" });
  };

  const handleRemoveOffspring = (index) => {
    setFormData({
      ...formData,
      offsprings: formData.offsprings.filter((_, i) => i !== index),
    });
  };

  const buildFamilyPayload = () => {
    const payload = {
      name: formData.name,
      address: formData.address || undefined,
      primaryMember: formData.primaryMember?.id
        ? { userId: formData.primaryMember.id }
        : null,
      spouse: formData.spouse
        ? formData.spouse.id
          ? {
              userId: formData.spouse.id,
              relationship: formData.spouse.relationship || "spouse",
            }
          : null
        : undefined,
      offsprings: formData.offsprings
        .map((offspring) =>
          offspring.user?.id
            ? {
                userId: offspring.user.id,
                relationship: offspring.relationship || "child",
              }
            : null
        )
        .filter(Boolean),
    };

    if (!formData.primaryMember?.id && formData.primaryMember) {
      toast.error("Please select an existing user or create one first");
      return null;
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.primaryMember) {
      toast.error("Primary member is required");
      return;
    }

    const payload = buildFamilyPayload();
    if (!payload) return;

    try {
      if (editingFamily) {
        await apiClient.families.update(editingFamily.id, payload);
        toast.success("Family updated successfully");
      } else {
        await apiClient.families.create(payload);
        toast.success("Family created successfully");
      }
      setShowModal(false);
      loadFamilies();
    } catch (error) {
      console.error("Error saving family:", error);
      toast.error(error.response?.data?.message || "Failed to save family");
    }
  };

  const filteredFamilies = families.filter((family) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      family.name?.toLowerCase().includes(query) ||
      family.members?.some((m) =>
        m.user?.username?.toLowerCase().includes(query) ||
        m.user?.email?.toLowerCase().includes(query)
      )
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading families...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Families Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage PCEA welfare family structures
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-[#1e88b5] transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Create Family
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search families by name or member..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
        />
      </div>

      {/* Families Table */}
      {filteredFamilies.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Families Found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? "Try adjusting your search query"
              : "Start by creating your first family"}
          </p>
          {!searchQuery && (
            <button
              onClick={handleCreate}
              className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-[#1e88b5] transition-colors inline-flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Create Your First Family
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                  {/* Expand column */}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Family Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFamilies.map((family) => {
                const isExpanded = expandedRows.has(family.id);
                const primaryMember = family.members?.find(
                  (m) => m.role === "PRIMARY_MEMBER"
                );
                const spouse = family.members?.find((m) => m.role === "SPOUSE");
                const offsprings = family.members?.filter(
                  (m) => m.role === "OFFSPRING"
                );

                return (
                  <>
                    <tr
                      key={family.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleRow(family.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isExpanded ? (
                          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {family.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {family.address || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <FamilyTree family={family} compact={true} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleEdit(family)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(family.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 bg-gray-50">
                          <div className="py-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">
                              Family Tree
                            </h4>
                            <FamilyTree family={family} compact={false} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingFamily ? "Edit Family" : "Create New Family"}
                </h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Family Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-900 focus:border-blue-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-900 focus:border-blue-900"
                    />
                  </div>
                </div>

                {/* Primary Member */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Member (Head of Household) *
                  </label>
                  <UserSearch
                    value={formData.primaryMember?.id}
                    onChange={(userId) => {
                      if (userId) {
                        apiClient.users.getById(userId).then((res) => {
                          setFormData({
                            ...formData,
                            primaryMember: res.data,
                          });
                        });
                      } else {
                        setFormData({ ...formData, primaryMember: null });
                      }
                    }}
                    onSelectUser={(user) => {
                      setFormData({ ...formData, primaryMember: user });
                    }}
                    placeholder="Search for primary member..."
                    districts={districts}
                  />
                </div>

                {/* Spouse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spouse (Optional)
                  </label>
                  <UserSearch
                    value={formData.spouse?.id}
                    onChange={(userId) => {
                      if (userId) {
                        apiClient.users.getById(userId).then((res) => {
                          setFormData({ ...formData, spouse: res.data });
                        });
                      } else {
                        setFormData({ ...formData, spouse: null });
                      }
                    }}
                    onSelectUser={(user) => {
                      setFormData({ ...formData, spouse: user });
                    }}
                    placeholder="Search for spouse..."
                    districts={districts}
                  />
                </div>

                {/* Offsprings */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Offsprings (Children/Dependents)
                  </label>
                  {formData.offsprings.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {formData.offsprings.map((offspring, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium">
                              {offspring.user?.username}
                            </p>
                            {offspring.relationship && (
                              <p className="text-sm text-gray-500">
                                ({offspring.relationship})
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveOffspring(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <UserSearch
                        value={newOffspring.user?.id}
                        onSelectUser={(user) => {
                          setNewOffspring({ ...newOffspring, user });
                        }}
                        placeholder="Search for offspring..."
                        districts={districts}
                      />
                    </div>
                    <input
                      type="text"
                      value={newOffspring.relationship}
                      onChange={(e) =>
                        setNewOffspring({
                          ...newOffspring,
                          relationship: e.target.value,
                        })
                      }
                      placeholder="Relationship (e.g., son, daughter)"
                      className="w-48 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-900 focus:border-blue-900"
                    />
                    <button
                      type="button"
                      onClick={handleAddOffspring}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-[#1e88b5]"
                >
                  {editingFamily ? "Update Family" : "Create Family"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
