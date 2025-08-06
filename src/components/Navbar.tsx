import React, { useState, useEffect, useMemo } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { IconType } from "react-icons";
import {
  FaAlignJustify, // Replaced FaBars with FaAlignJustify
  FaTimes,
  FaUserCircle,
  FaTachometerAlt,
  FaPlusCircle,
  FaStore,
  FaList,
  FaUtensils,
  FaBoxes,
  FaQrcode,
  FaUsers,
  FaHome,
  FaQuestionCircle,
  FaInfoCircle,
  FaClipboardList,
  FaSearch,
  FaBars,
} from "react-icons/fa";
import clsx from "clsx";
import { useAuth } from "../hooks/use-auth";

// Hardcoded routes (no separate constants file)
const SHOW_LOGO_ROUTES = [
  "/restaurant",
  "/dashboard",
  "/create-resto",
  "/order-list",
  "/admin-menu-list",
  "/barcode",
  "/inventory",
  "/user-management",
  "/add-edit-dish",
  "/track-order",
  "/admin-profile",
  "/order-details",
  "/bill",
  "/admin",
];
const PUBLIC_ROUTES = ["/register", "/login"];
const CUSTOMER_ROUTES = ["/track-order", "/restaurant"];

// Types
interface NavItem {
  name: string;
  path: string;
}

interface IconMap {
  [key: string]: IconType;
}

// Icon mapping
const iconMap: IconMap = {
  Dashboard: FaTachometerAlt,
  "Create Resto": FaPlusCircle,
  "Restaurant Page": FaStore,
  "Order List": FaList,
  "Set Menu": FaUtensils,
  Inventory: FaBoxes,
  "Generate Barcode": FaQrcode,
  "User Management": FaUsers,
  Orders: FaClipboardList,
  "Take Orders": FaStore,
  Home: FaHome,
  Plans: FaClipboardList,
  Working: FaInfoCircle,
  "About Us": FaInfoCircle,
  FAQ: FaQuestionCircle,
  Menu: FaUtensils,
  "Track Order": FaSearch,
  AdminInterface: FaUsers,
  Default: FaHome,
};

const getNavIcon = (name: string): IconType => iconMap[name] || iconMap.Default;

// Navigation items
const ownerDashboardNav: NavItem[] = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Create Your Resto", path: "/create-resto" },
  { name: "Restaurant Page", path: "/restaurant" },
  { name: "Order List", path: "/order-list" },
  { name: "Set Your Menu", path: "/admin-menu-list" },
  { name: "Manage Inventory", path: "/inventory" },
  { name: "Generate QR Code", path: "/barcode" },
  { name: "User Management", path: "/user-management" },
];

const managerNav: NavItem[] = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Create Your Resto", path: "/create-resto" },
  { name: "Restaurant Page", path: "/restaurant" },
  { name: "Order List", path: "/order-list" },
  { name: "Set Menu", path: "/admin-menu-list" },
  { name: "Manage Inventory", path: "/inventory" },
  { name: "Generate QR Code", path: "/barcode" },
];

const staffNav: NavItem[] = [
  { name: "Orders", path: "/order-list" },
  { name: "Take Orders", path: "/restaurant" },
];

const publicHomeNav: NavItem[] = [
  { name: "Home", path: "/" },
  { name: "Plans", path: "/plan-section" },
  { name: "Working", path: "/how-it-works" },
  { name: "About Us", path: "/about" },
  { name: "FAQ", path: "/faq" },
];

const restaurantNav: NavItem[] = [
  { name: "Menu", path: "/restaurant" },
  { name: "Track Order", path: "/track-order" },
];

const superadminNav: NavItem[] = [{ name: "AdminInterface", path: "/admin" }];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isLoadingLogo, setIsLoadingLogo] = useState<boolean>(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isFullSidebarOpen, setIsFullSidebarOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role, logout } = useAuth();

  const isCustomerPage = useMemo(
    () =>
      CUSTOMER_ROUTES.some((route) => location.pathname.startsWith(route)) &&
      !isAuthenticated,
    [location.pathname, isAuthenticated]
  );

  const shouldShowSidebar = useMemo(
    () =>
      isAuthenticated &&
      typeof role === "string" &&
      ["owner", "manager", "staff"].includes(role.toLowerCase()) &&
      !isCustomerPage,
    [isAuthenticated, role, isCustomerPage]
  );

  const navConfig = useMemo(() => {
    const planStatus = localStorage.getItem("plan_status");
    const normalizedRole = role?.toLowerCase();

    if (isAuthenticated) {
      if (normalizedRole === "superadmin") {
        return { navItems: superadminNav, sidebarItems: [] };
      } else if (planStatus === "active") {
        if (normalizedRole === "owner") {
          return { navItems: [], sidebarItems: ownerDashboardNav };
        } else if (normalizedRole === "manager") {
          return { navItems: [], sidebarItems: managerNav };
        } else if (normalizedRole === "staff") {
          return { navItems: [], sidebarItems: staffNav };
        }
      }
    }
    return {
      navItems: isCustomerPage ? restaurantNav : publicHomeNav,
      sidebarItems: [],
    };
  }, [isAuthenticated, role, isCustomerPage]);

  useEffect(() => {
    const fetchLogoFromBackend = async () => {
      const businessId = localStorage.getItem("businessId");
      const isMatchingRoute = SHOW_LOGO_ROUTES.some(
        (path) =>
          location.pathname === path || location.pathname.startsWith(path + "/")
      );

      if (businessId && isMatchingRoute) {
        setIsLoadingLogo(true);
        try {
          const response = await fetch(
            `http://localhost:4000/api/business/${businessId}`
          );
          if (!response.ok) throw new Error("Failed to fetch business");
          const data = await response.json();
          setBusinessName(data.name || null);
          setLogoUrl(data.logoUrl || null);
        } catch (error) {
          console.error("Error fetching logo:", error);
          setLogoError("Failed to load logo");
          setLogoUrl(null);
        } finally {
          setIsLoadingLogo(false);
        }
      } else {
        setLogoUrl(null);
      }
    };

    fetchLogoFromBackend();
  }, [location.pathname]);

  const handleLogout = () => {
    const isCustomer = Boolean(localStorage.getItem("customerToken"));
    if (isCustomer) {
      localStorage.removeItem("customerToken");
      logout();
      navigate("/restaurant");
    } else {
      logout();
      localStorage.removeItem("ownerHeaderEnabled");
      navigate("/login");
    }
    setMenuOpen(false);
    setIsFullSidebarOpen(false);
  };

  if (isAuthenticated && !role) {
    return <div>Error: User role not defined</div>;
  }

  return (
    <>
      {/* Sidestrip (existing sidebar with icons) - Always visible when shouldShowSidebar is true */}
      {shouldShowSidebar && (
        <div className="fixed left-0 top-[64px] h-[calc(100vh-64px)] w-16 bg-[#010320] text-white z-40 hidden md:flex flex-col py-4 shadow-lg">
          <div className="flex flex-col space-y-4 flex-1 px-2">
            {/* Hamburger icon to toggle full sidebar - Using FaAlignJustify */}
            <button
              onClick={() => setIsFullSidebarOpen(!isFullSidebarOpen)}
              className="flex items-center justify-center h-12 w-12 rounded-lg transition-all duration-200 hover:bg-[#F4A300] hover:text-black"
              aria-label={
                isFullSidebarOpen ? "Close full sidebar" : "Open full sidebar"
              }
            >
              <FaAlignJustify size={20} aria-hidden="true" />
            </button>
            {navConfig.sidebarItems.map(({ name, path }) => {
              const IconComponent = getNavIcon(name);
              return (
                <div key={name} className="relative group">
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      clsx(
                        "flex items-center justify-center h-12 w-12 rounded-lg transition-all duration-200 hover:bg-[#F4A300] hover:text-black",
                        { "bg-[#F4A300] text-black": isActive }
                      )
                    }
                    aria-label={`Navigate to ${name}`}
                  >
                    <IconComponent size={20} aria-hidden="true" />
                  </NavLink>
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 top-1/2 transform -translate-y-1/2">
                    {name}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Backdrop to close sidebar on outside click */}
      {shouldShowSidebar && isFullSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsFullSidebarOpen(false)}
          aria-label="Close sidebar by clicking outside"
        ></div>
      )}

      {/* Full Sidebar (new animated sidebar) - Slides in from right of sidestrip */}
      {shouldShowSidebar && isFullSidebarOpen && (
        <div
          className={clsx(
            "fixed left-16 top-[64px] h-[calc(100vh-64px)] w-64 bg-[#010320] text-white z-50 transform transition-transform duration-300 ease-in-out md:flex flex-col py-4 shadow-lg",
            isFullSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between px-4 mb-4">
            <span className="text-lg font-semibold">Menu</span>
            <button
              onClick={() => setIsFullSidebarOpen(false)}
              className="flex items-center justify-center h-10 w-10 rounded-lg hover:bg-[#F4A300] hover:text-black"
              aria-label="Close sidebar"
            >
              <FaTimes size={20} aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-col space-y-2 px-4">
            {navConfig.sidebarItems.map(({ name, path }) => {
              const IconComponent = getNavIcon(name);
              return (
                <NavLink
                  key={name}
                  to={path}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center gap-3 py-2 px-4 rounded-lg transition-all duration-200 hover:bg-[#F4A300] hover:text-black",
                      { "bg-[#F4A300] text-black": isActive }
                    )
                  }
                  onClick={() => setIsFullSidebarOpen(false)}
                  aria-label={`Navigate to ${name}`}
                >
                  <IconComponent size={20} aria-hidden="true" />
                  <span>{name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav className="bg-[#010320] text-white px-8 py-1 fixed top-0 left-0 right-0 z-50 shadow w-full">
        <div className="max-w-8xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {isLoadingLogo ? (
              <div>Loading logo...</div>
            ) : logoError ? (
              <div>Error loading logo</div>
            ) : (
              <img
                src={logoUrl || "/Willovate_Resto Logo.png"}
                alt={businessName || "WillovateRestro Logo"}
                className="h-14 w-auto object-contain"
              />
            )}
          </div>

          {/* Desktop navigation */}
          {!shouldShowSidebar && (
            <div className="hidden md:flex flex-1 justify-center space-x-6 text-[18px] font-medium flex-wrap">
              {navConfig.navItems.map(({ name, path }) => (
                <NavLink
                  key={name}
                  to={path}
                  className={({ isActive }) =>
                    clsx("transition hover:text-[#F4A300]", {
                      "text-[#F4A300] font-semibold": isActive,
                    })
                  }
                  aria-label={`Navigate to ${name}`}
                >
                  {name}
                </NavLink>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4 whitespace-nowrap">
            {isAuthenticated ? (
              <>
                <div
                  className="flex items-center gap-2 cursor-pointer text-sm"
                  onClick={() => navigate("/admin-profile")}
                  aria-label="View profile"
                >
                  <FaUserCircle size={18} aria-hidden="true" />
                  <span>Role: {role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-4 py-1.5 rounded-full text-white font-semibold"
                >
                  Logout
                </button>
              </>
            ) : isCustomerPage &&
              Boolean(localStorage.getItem("customerToken")) ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-1.5 rounded-full text-white font-semibold"
              >
                Logout
              </button>
            ) : (
              !isCustomerPage && (
                <button
                  onClick={() => navigate("/login")}
                  className="bg-[#F4A300] text-black font-semibold py-2 px-4 rounded-full"
                >
                  Login / Signup
                </button>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#010320] text-white px-4 pt-4 pb-6 space-y-3 rounded-b-lg">
            {(navConfig.navItems.length > 0
              ? navConfig.navItems
              : navConfig.sidebarItems
            ).map(({ name, path }) => (
              <NavLink
                key={name}
                to={path}
                className={({ isActive }) =>
                  clsx(
                    "block py-2 px-2 rounded hover:bg-[#F4A300] hover:text-black",
                    { "bg-[#F4A300] text-black": isActive }
                  )
                }
                onClick={() => setMenuOpen(false)}
                aria-label={`Navigate to ${name}`}
              >
                {name}
              </NavLink>
            ))}
            <hr className="border-gray-600 my-2" />
            {isAuthenticated ? (
              <>
                <div
                  className="flex items-center gap-2 text-sm text-gray-300 mb-2 cursor-pointer"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/admin-profile");
                  }}
                  aria-label="View profile"
                >
                  <FaUserCircle size={16} aria-hidden="true" />
                  <span>Role: {role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white font-semibold py-2 rounded-full"
                >
                  Logout
                </button>
              </>
            ) : isCustomerPage &&
              Boolean(localStorage.getItem("customerToken")) ? (
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white font-semibold py-2 rounded-full"
              >
                Logout
              </button>
            ) : (
              !isCustomerPage && (
                <button
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                  className="w-full bg-[#F4A300] text-black font-semibold py-2 rounded-full"
                >
                  Login / Signup
                </button>
              )
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
