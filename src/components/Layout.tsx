import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./footer";
import { useAuth } from "../hooks/use-auth";

const Layout: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, role } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024); // ✅ Desktop check

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const hideNavbarRoutes = ["/register", "/login"];
  const shouldHideNavbar = hideNavbarRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const normalizedRole = role ? role.toLowerCase() : "";

  const isCustomerPage =
    location.pathname.startsWith("/track-order") ||
    (location.pathname.startsWith("/restaurant") && !isAuthenticated);

  const shouldShowSidebar =
    isAuthenticated &&
    ["owner", "manager", "staff"].includes(normalizedRole) &&
    !isCustomerPage &&
    !location.pathname.startsWith("/main");

  // ✅ Apply padding shift only for desktop & only when not on /main
  const basePadding = isDesktop && shouldShowSidebar ? 64 : 0;

  const fullSidebarWidth =
    isDesktop && isSidebarOpen && location.pathname !== "/main" // 👈 /main me toggle width na add karo
      ? 200
      : 0;

  const totalShift = basePadding + fullSidebarWidth;

  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideNavbar && (
        <Navbar onSidebarToggle={(isOpen) => setIsSidebarOpen(isOpen)} />
      )}

      <main
        className="flex-grow pt-20 transition-all duration-300"
        style={{
          paddingLeft: `${totalShift}px`,
        }}
      >
        <Outlet />
      </main>

      <div
        className="transition-all duration-300"
        style={{
          paddingLeft: `${totalShift}px`,
        }}
      >
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
