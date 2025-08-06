import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "../config";

interface Plan {
  name: string;
  features: string;
  expiresAt: string;
  paymentProofUrl?: string;
  status: string;
}

interface Business {
  id: number;
  name: string;
  plan: Plan | null;
}

interface User {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  business: Business | null;
}

const baseURL = baseUrl;

const AdminInterface: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [statusMap, setStatusMap] = useState<{ [email: string]: string }>({});
  const [loading, setLoading] = useState<{ [email: string]: boolean }>({});

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found.");
          toast.error("No token found. Please login again.");
          return;
        }

        const response = await axios.get(`${baseURL}/api/admin/all-users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const usersData = response.data.users || [];
        setUsers(usersData);

        // ✅ Show toast only once, if users exist
        if (usersData.length > 0) {
          toast.success("Users data loaded successfully!", {
            toastId: "user-load-success",
          });
        }

        const initialStatus: { [email: string]: string } = {};
        (response.data.users || []).forEach((u: User) => {
          // Map backend status to our three options
          const planStatus = u.business?.plan?.status || "pending";
          let mappedStatus = "pending";

          if (planStatus === "active") {
            mappedStatus = "verified";
          } else if (planStatus === "expired" || planStatus === "cancelled") {
            mappedStatus = "unverified";
          } else {
            mappedStatus = "pending";
          }

          initialStatus[u.email] = mappedStatus;
        });
        setStatusMap(initialStatus);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        const errorMessage =
          err.response?.data?.error || "Failed to fetch users";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    };

    fetchAllUsers();
  }, []);

  const handleStatusChange = async (email: string, newStatus: string) => {
    const user = users.find((u) => u.email === email);
    const businessId = user?.business?.id;
    const currentStatus = statusMap[email];

    // Prevent re-verification of already verified subscriptions
    if (currentStatus === "verified" && newStatus === "verified") {
      toast.warning(
        "⚠️ Yeh plan already verified hai! Dobara verify nahi kar sakte."
      );
      return;
    }

    // Use toast notification instead of window.confirm
    if (currentStatus === "verified" && newStatus === "pending") {
      // Create a custom notification with warning
      toast.warning(
        "Verified subscription ko pending karna user ke service access ko affect karega!",
        {
          autoClose: 1000,
        }
      );

      // For now, we'll continue with the operation
      // In a real app, you might want to implement a custom confirmation dialog
    }

    const token = localStorage.getItem("token");
    if (!businessId || !token) {
      toast.error("Business ID or token not found!");
      return;
    }

    // Map our status to backend status
    let backendStatus = "pending";
    if (newStatus === "verified") {
      backendStatus = "active";
    } else if (newStatus === "unverified") {
      backendStatus = "expired";
    } else {
      backendStatus = "pending";
    }

    // Set loading state for this specific user
    setLoading((prev) => ({ ...prev, [email]: true }));

    try {
      await axios.patch(
        `${baseURL}/api/plan/${businessId}/status`,
        {
          status: backendStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update status map only if request is successful
      setStatusMap((prev) => ({ ...prev, [email]: newStatus }));

      // Show success message
      if (newStatus === "verified") {
        toast.success("Plan successfully verified!");
      } else if (newStatus === "unverified") {
        toast.error("Plan marked as unverified");
      } else {
        toast.info("Plan status updated to pending");
      }
    } catch (err: any) {
      console.error("Error updating status:", err);

      // Handle specific error for already verified plans
      if (
        err.response?.status === 400 &&
        err.response?.data?.error === "Plan already verified"
      ) {
        toast.warning(
          "⚠️ Plan already verified hai! Dobara verify nahi kar sakte."
        );
      } else {
        toast.error("Status update failed. Please try again.");
      }

      // Revert the status change in UI
      // Don't update statusMap if there's an error
    } finally {
      setLoading((prev) => ({ ...prev, [email]: false }));
    }
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-orange-600 bg-yellow-100";
      case "unverified":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const isStatusChangeDisabled = (email: string, targetStatus: string) => {
    const currentStatus = statusMap[email];
    const isLoading = loading[email];

    // Disable if currently loading
    if (isLoading) return true;

    // Disable "verified" option if already verified
    if (currentStatus === "verified" && targetStatus === "verified")
      return true;

    return false;
  };

  // Show error notification instead of returning error paragraph
  if (error) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen -mt-4 -mb-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Admin - User Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage user subscriptions and verify payments
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
          >
            Retry
          </button>
        </div>

        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 bg-gray-100 min-h-screen -mt-4 -mb-10">
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Admin - User Management
        </h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          Manage user subscriptions and verify payments
        </p>
      </div>

      {/* Table (Scrollable on small screens) */}
      {/* DESKTOP: Table layout */}
      <div className="hidden md:block">
        <table className="w-full text-sm bg-white rounded-lg shadow border border-gray-200">
          <thead className="bg-white border-t-4 border-orange-500">
            <tr className="text-left text-gray-800 font-semibold text-xs md:text-sm">
              {[
                "Name",
                "Email",
                "Phone",
                "Address",
                "Business ID",
                "Business Name",
                "Plan",
                "Features",
                "Expires At",
                "Payment Proof",
                "Status",
              ].map((heading) => (
                <th key={heading} className="px-4 py-2 border-b">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => {
                const business = user.business;
                const plan = business?.plan;
                const status = statusMap[user.email] || "pending";
                const isUserLoading = loading[user.email];
                const statusClasses = getStatusClasses(status);
                const isExpired = plan?.expiresAt
                  ? new Date(plan.expiresAt) < new Date()
                  : false;

                return (
                  <tr key={user.email} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b">{user.name}</td>
                    <td className="px-4 py-3 border-b">{user.email}</td>
                    <td className="px-4 py-3 border-b">{user.phone || "-"}</td>
                    <td className="px-4 py-3 border-b">
                      {user.address || "-"}
                    </td>
                    <td className="px-4 py-3 border-b text-xs">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {business?.id || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b">
                      {business?.name || "-"}
                    </td>
                    <td className="px-4 py-3 border-b text-xs">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {plan?.name || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b">
                      {plan?.features || "-"}
                    </td>
                    <td className="px-4 py-3 border-b">
                      {plan?.expiresAt ? (
                        <div>
                          <span
                            className={
                              isExpired ? "text-red-600 font-semibold" : ""
                            }
                          >
                            {new Date(plan.expiresAt).toLocaleDateString()}
                          </span>
                          {isExpired && (
                            <div className="text-xs text-red-500">Expired</div>
                          )}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3 border-b text-xs">
                      {plan?.paymentProofUrl ? (
                        <a
                          href={plan.paymentProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded"
                        >
                          View Proof
                        </a>
                      ) : (
                        <span className="text-gray-400">Not Uploaded</span>
                      )}
                    </td>
                    <td className="px-4 py-3 border-b">
                      <div className="flex items-center space-x-2">
                        <select
                          aria-label="Change plan status"
                          value={status}
                          onChange={(e) =>
                            handleStatusChange(user.email, e.target.value)
                          }
                          disabled={isUserLoading}
                          className={`px-2 py-1 rounded border border-gray-300 font-semibold min-w-[100px] text-xs ${statusClasses} ${
                            isUserLoading
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option
                            value="verified"
                            disabled={isStatusChangeDisabled(
                              user.email,
                              "verified"
                            )}
                          >
                            {status === "verified" ? "✓ Verified" : "Verify"}
                          </option>
                          <option value="unverified">Unverified</option>
                        </select>
                        {isUserLoading && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                        )}
                        {status === "verified" && (
                          <span className="text-green-600 text-xs">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={11} className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE: Stacked cards */}
      <div className="md:hidden space-y-4">
        {users.map((user) => {
          const business = user.business;
          const plan = business?.plan;
          const status = statusMap[user.email] || "pending";
          const isUserLoading = loading[user.email];
          const statusClasses = getStatusClasses(status);
          const isExpired = plan?.expiresAt
            ? new Date(plan.expiresAt) < new Date()
            : false;

          return (
            <div key={user.email} className="bg-white shadow rounded-lg p-4">
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">
                📞 {user.phone || "-"} | 🏠 {user.address || "-"}
              </p>
              <div className="text-xs text-gray-600 mt-1">
                <p>💼 Business ID: {business?.id || "-"}</p>
                <p>🏢 Name: {business?.name || "-"}</p>
                <p>📦 Plan: {plan?.name || "-"}</p>
                <p>📝 Features: {plan?.features || "-"}</p>
                <p>
                  ⏰ Expiry:{" "}
                  {plan?.expiresAt ? (
                    <span
                      className={isExpired ? "text-red-600 font-semibold" : ""}
                    >
                      {new Date(plan.expiresAt).toLocaleDateString()}
                    </span>
                  ) : (
                    "-"
                  )}
                </p>
                <p>
                  📄 Proof:{" "}
                  {plan?.paymentProofUrl ? (
                    <a
                      href={plan.paymentProofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  ) : (
                    "Not Uploaded"
                  )}
                </p>
              </div>

              <div className="mt-3 flex items-center space-x-2">
                <select
                  aria-label="Change plan status"
                  value={status}
                  onChange={(e) =>
                    handleStatusChange(user.email, e.target.value)
                  }
                  disabled={isUserLoading}
                  className={`px-2 py-1 rounded border border-gray-300 font-semibold w-full ${statusClasses} ${
                    isUserLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option
                    value="verified"
                    disabled={isStatusChangeDisabled(user.email, "verified")}
                  >
                    {status === "verified" ? "✓ Verified" : "Verify"}
                  </option>
                  <option value="unverified">Unverified</option>
                </select>

                {isUserLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.length, color: "blue" },
          {
            label: "Verified Plans",
            value: users.filter((u) => statusMap[u.email] === "verified")
              .length,
            color: "green",
          },
          {
            label: "Pending Plans",
            value: users.filter((u) => statusMap[u.email] === "pending").length,
            color: "yellow",
          },
          {
            label: "Unverified Plans",
            value: users.filter((u) => statusMap[u.email] === "unverified")
              .length,
            color: "red",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-4 rounded-lg shadow text-center"
          >
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className={`text-2xl font-bold text-${stat.color}-600`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AdminInterface;
