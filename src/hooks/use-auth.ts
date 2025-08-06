export function useAuth() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toLowerCase(); // ✅ normalize

  return {
    isAuthenticated: !!token,
    role,
    token,
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    },
  };
}
