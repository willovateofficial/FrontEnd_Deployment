export function useAuth() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toLowerCase();
  const plan = localStorage.getItem("plan") || "free trial"; // 👈 Add this

  return {
    isAuthenticated: !!token,
    role,
    plan, // 👈 Include plan
    token,
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("plan"); // 👈 Clear plan also on logout
      window.location.href = "/login";
    },
  };
}
