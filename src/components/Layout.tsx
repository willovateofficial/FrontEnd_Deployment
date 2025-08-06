import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./footer";
import { useAuth } from "../hooks/use-auth";

const Layout: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, role } = useAuth();

  const hideHeaderRoutes = ["/register", "/login"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  const isCustomerPage =
    location.pathname.startsWith("/track-order") ||
    (location.pathname.startsWith("/restaurant") && !isAuthenticated);

  // Check if sidebar should be shown
  const shouldShowSidebar =
    isAuthenticated &&
    role != null &&
    ["owner", "manager", "staff"].includes(role.toLowerCase()) &&
    !isCustomerPage;

  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideHeader && <Navbar />}

      {/* Main content with conditional padding for sidebar */}
      <main
        className={`flex-grow pt-20 ${shouldShowSidebar ? "md:pl-16" : ""}`}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
