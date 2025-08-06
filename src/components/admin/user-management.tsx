import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "../../config";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  createdAt: string;
}

const baseURL = baseUrl;

const roles = ["Manager", "Staff"];
const PAGE_SIZE = 8;

type FormMode = "add" | "edit";

const UserManagement: React.FC<{}> = () => {
  const businessId = localStorage.getItem("businessId");

  const currentUserRole = localStorage.getItem("role") || "Staff";
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [page, setPage] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("add");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
  });

  // Delete confirmation dialog state
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<User | null>(null);

  const getToken = () => localStorage.getItem("token") || "";

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();

      const res = await fetch(`${baseURL}/api/business/${businessId}/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch users");
      }
      const data = await res.json();
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter and paginate users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Open add user drawer
  const openAddUser = () => {
    setFormMode("add");
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
      phone: "",
    });
    setDrawerOpen(true);
  };

  // Open edit user drawer, prefill form
  const openEditUser = (user: User) => {
    setFormMode("edit");
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // leave blank for security
      role: user.role,
      phone: user.phone || "",
    });
    setDrawerOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (formMode === "add" && formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!roles.includes(formData.role)) {
      toast.error("Please select a valid role");
      return;
    }

    try {
      let url = "";
      let method = "";

      if (formMode === "add") {
        url = `${baseURL}/api/business/${businessId}/add-user`;
        method = "POST";
      } else if (formMode === "edit" && editingUser) {
        url = `${baseURL}/api/users/${editingUser.id}`;
        method = "PUT";
      }

      const payload: any = { ...formData };
      if (formMode === "edit" && !payload.password) {
        delete payload.password;
      }

      const token = getToken();

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save user");
      }

      toast.success(
        `User ${formMode === "add" ? "added" : "updated"} successfully`
      );
      setDrawerOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Error occurred");
    }
  };

  // Open confirmation dialog
  const handleDeleteClick = (user: User) => {
    if (user.role === "owner") {
      toast.error("Cannot delete Owner");
      return;
    }
    setConfirmDeleteUser(user);
  };

  // Confirm delete action
  const handleDeleteConfirmed = async () => {
    if (!confirmDeleteUser) return;

    try {
      const token = getToken();
      const res = await fetch(`${baseURL}/api/users/${confirmDeleteUser.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete user");
      }

      toast.success("User deleted successfully");
      setConfirmDeleteUser(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  // Cancel delete
  const handleDeleteCancel = () => {
    setConfirmDeleteUser(null);
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8 -mt-4 -mb-10">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-orange-900">
          User Management
        </h1>
        <button
          onClick={openAddUser}
          className="bg-orange-600 text-white font-semibold rounded-lg px-4 py-2 sm:px-6 sm:py-3 hover:bg-orange-700 transition w-full sm:w-auto"
        >
          + Add User
        </button>
      </header>

      {/* Filters */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4 sm:mb-6 gap-3">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="flex-grow rounded-lg border border-orange-300 px-3 py-2 sm:px-4 sm:py-3 placeholder-orange-400 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-orange-300 transition text-sm sm:text-base"
        />

        <select
          aria-label="Filter by Role"
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-48 rounded-lg border border-orange-300 px-3 py-2 sm:px-4 sm:py-3 bg-white focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-orange-300 transition text-sm sm:text-base"
        >
          <option value="">Filter by Role</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg sm:rounded-xl shadow overflow-x-auto relative">
        {loading ? (
          <div className="p-6 text-center text-orange-600">
            Loading users...
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600 font-semibold">
            {error}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-6 text-center text-orange-500">No users found.</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block">
              <table className="min-w-full divide-y divide-orange-200">
                <thead className="bg-orange-600 text-white">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">
                      Name
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">
                      Email
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">
                      Role
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">
                      Phone
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">
                      Created At
                    </th>
                    {(currentUserRole === "owner" ||
                      currentUserRole === "manager") && (
                      <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-200">
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-orange-50 transition">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base">
                        {user.name}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base">
                        {user.email}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap capitalize text-sm sm:text-base">
                        {user.role}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base">
                        {user.phone || "-"}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-orange-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      {(currentUserRole === "owner" ||
                        currentUserRole === "manager") && (
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center space-x-2 sm:space-x-3 text-sm sm:text-base">
                          <button
                            onClick={() => openEditUser(user)}
                            disabled={user.role === "owner"}
                            title={
                              user.role === "owner"
                                ? "Cannot edit Owner"
                                : "Edit user"
                            }
                            className={`font-semibold ${
                              user.role === "owner"
                                ? "text-orange-300 cursor-not-allowed"
                                : "text-orange-600 hover:text-orange-900"
                            }`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className={`font-semibold ${
                              user.role === "owner"
                                ? "text-orange-300 cursor-not-allowed"
                                : "text-red-600 hover:text-red-900"
                            }`}
                            disabled={user.role === "owner"}
                            title={
                              user.role === "owner"
                                ? "Cannot delete Owner"
                                : "Delete user"
                            }
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-3 p-2">
              {paginatedUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white border border-orange-200 rounded-lg shadow-sm p-4 hover:bg-orange-50 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-orange-900 text-sm">
                      {user.name}
                    </h3>
                    {(currentUserRole === "owner" ||
                      currentUserRole === "manager") && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditUser(user)}
                          disabled={user.role === "owner"}
                          title={
                            user.role === "owner"
                              ? "Cannot edit Owner"
                              : "Edit user"
                          }
                          className={`text-xs ${
                            user.role === "owner"
                              ? "text-orange-300 cursor-not-allowed"
                              : "text-orange-600 hover:text-orange-900"
                          }`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className={`text-xs ${
                            user.role === "owner"
                              ? "text-orange-300 cursor-not-allowed"
                              : "text-red-600 hover:text-red-900"
                          }`}
                          disabled={user.role === "owner"}
                          title={
                            user.role === "owner"
                              ? "Cannot delete Owner"
                              : "Delete user"
                          }
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-orange-600 font-medium">
                        Email:
                      </span>
                      <p className="truncate">{user.email}</p>
                    </div>
                    <div>
                      <span className="text-orange-600 font-medium">Role:</span>
                      <p className="capitalize">{user.role}</p>
                    </div>
                    <div>
                      <span className="text-orange-600 font-medium">
                        Phone:
                      </span>
                      <p>{user.phone || "-"}</p>
                    </div>
                    <div>
                      <span className="text-orange-600 font-medium">
                        Created:
                      </span>
                      <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center sm:justify-center sm:space-x-4 p-3 sm:p-4 mt-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-2 sm:px-3 py-1 rounded border border-orange-300 hover:bg-orange-100 disabled:opacity-50 text-xs sm:text-sm"
              >
                Previous
              </button>
              <span className="px-2 sm:px-3 py-1 font-semibold text-xs sm:text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-2 sm:px-3 py-1 rounded border border-orange-300 hover:bg-orange-100 disabled:opacity-50 text-xs sm:text-sm"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Right drawer panel for Add/Edit */}
        {drawerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50">
            <div className="bg-white w-full sm:max-w-md h-full p-4 sm:p-6 md:p-8 overflow-auto shadow-2xl rounded-l-lg sm:rounded-l-3xl relative">
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute top-2 right-4 sm:top-4 sm:right-6 text-orange-400 hover:text-orange-600 font-bold text-2xl sm:text-3xl leading-none"
                aria-label="Close form"
              >
                &times;
              </button>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-4 sm:mb-6 text-orange-900">
                {formMode === "add" ? "Add New User" : "Edit User"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-orange-700 mb-1">
                    Full Name <span className="text-orange-600">*</span>
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full rounded-lg border border-orange-300 px-3 py-2 sm:px-4 sm:py-3 placeholder-orange-400 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-orange-300 transition text-xs sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-orange-700 mb-1">
                    Email Address <span className="text-orange-600">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="owner@gmail.com"
                    className="w-full rounded-lg border border-orange-300 px-3 py-2 sm:px-4 sm:py-3 placeholder-orange-400 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-orange-300 transition text-xs sm:text-sm"
                    required
                    disabled={formMode === "edit"}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-orange-700 mb-1">
                    Password{" "}
                    {formMode === "add" ? (
                      <span className="text-orange-600">*</span>
                    ) : (
                      <span className="text-orange-400">
                        (leave blank to keep)
                      </span>
                    )}
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={
                      formMode === "add"
                        ? "At least 6 characters"
                        : "New password (optional)"
                    }
                    className="w-full rounded-lg border border-orange-300 px-3 py-2 sm:px-4 sm:py-3 placeholder-orange-400 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-orange-300 transition text-xs sm:text-sm"
                    required={formMode === "add"}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-orange-700 mb-1">
                    Role <span className="text-orange-600">*</span>
                  </label>
                  <select
                    name="role"
                    aria-label="Select user role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-orange-300 px-3 py-2 sm:px-4 sm:py-3 bg-white focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-orange-300 transition text-xs sm:text-sm"
                    required
                    disabled={editingUser?.role === "owner"}
                  >
                    <option value="" disabled>
                      Select role
                    </option>
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-orange-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91"
                    className="w-full rounded-lg border border-orange-300 px-3 py-2 sm:px-4 sm:py-3 placeholder-orange-400 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-orange-300 transition text-xs sm:text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 sm:py-3 rounded-lg bg-orange-600 text-white font-bold text-sm sm:text-base hover:bg-orange-700 transition"
                >
                  {formMode === "add" ? "Add User" : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Confirm Delete Modal */}
        {confirmDeleteUser && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-orange-900">
                Confirm Delete
              </h3>
              <p className="mb-4 sm:mb-6 text-orange-800 text-sm sm:text-base">
                Are you sure you want to delete user{" "}
                <strong>{confirmDeleteUser.name}</strong>? This action cannot be
                undone.
              </p>
              <div className="flex justify-end space-x-2 sm:space-x-4">
                <button
                  onClick={handleDeleteCancel}
                  className="px-3 py-1 sm:px-4 sm:py-2 rounded bg-orange-200 hover:bg-orange-300 transition text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirmed}
                  className="px-3 py-1 sm:px-4 sm:py-2 rounded bg-red-600 text-white hover:bg-red-700 transition text-xs sm:text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Container */}
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </div>
  );
};

export default UserManagement;
