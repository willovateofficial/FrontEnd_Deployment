import React, { useState, useEffect, useMemo } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { IconType } from "react-icons";
import { MdTableRestaurant } from "react-icons/md";
import {
  FaBars,
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
  FaUserFriends,
} from "react-icons/fa";
import { useAuth } from "../hooks/use-auth";
import { useRef } from "react";
import { baseUrl } from "../config";

// Types
interface NavItem {
  name: string;
  path: string;
}

interface IconMap {
  [key: string]: IconType;
}

// Navbar.tsx – inside component props
interface NavbarProps {
  onSidebarToggle?: (isOpen: boolean) => void;
}

// Icon mapping for sidebar
const getNavIcon = (name: string): IconType => {
  const iconMap: IconMap = {
    MainHome: FaHome,
    Dashboard: FaTachometerAlt,
    "Create Resto": FaPlusCircle,
    "Manage Restaurant": FaStore,
    "Order List": FaList,
    "Manage Tables": MdTableRestaurant,
    "Menu Management": FaUtensils,
    "Inventory Management": FaBoxes,
    "Generate QR Code": FaQrcode,
    "Staff Management": FaUserFriends,
    "Customer Management": FaUsers,
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
  };
  return iconMap[name] || FaHome;
};

const ownerDashboardNav: NavItem[] = [
  { name: "Home", path: "/main" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Manage Restaurant", path: "/restaurant" },
  { name: "Orders", path: "/order-list" },
  { name: "Manage Tables", path: "/tables" },
  { name: "Menu Management", path: "/admin-menu-list" },
  { name: "Inventory Management", path: "/inventory" },
  { name: "Generate QR Code", path: "/barcode" },
  { name: "Staff Management", path: "/user-management" },
  { name: "Customer Management", path: "/customer-list" },
  { name: "Create Resto", path: "/create-resto" },
];

const managerNav: NavItem[] = [
  { name: "Home", path: "/main" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Manage Restaurant", path: "/restaurant" },
  { name: "Orders", path: "/order-list" },
  { name: "Manage Tables", path: "/tables" },
  { name: "Menu Management", path: "/admin-menu-list" },
  { name: "Inventory Management", path: "/inventory" },
  { name: "Generate QR Code", path: "/barcode" },
  { name: "Customer Management", path: "/customer-list" },
  { name: "Create Resto", path: "/create-resto" },
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

const baseURL = baseUrl;

const Navbar: React.FC<NavbarProps> = ({ onSidebarToggle }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [fullSidebarOpen, setFullSidebarOpen] = useState(false);
  const fullSidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role, logout } = useAuth();

  const [businessName, setBusinessName] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [sidestripItems, setSideStripItems] = useState<NavItem[]>([]);

  const isCustomerPage = useMemo(() => {
    // Treat /track-order as a customer page **only if NOT authenticated**
    if (!isAuthenticated && location.pathname.startsWith("/track-order")) {
      return true;
    }

    return location.pathname.startsWith("/restaurant") && !isAuthenticated;
  }, [location.pathname, isAuthenticated]);

  // When toggling sidebar
  const toggleSidebar = () => {
    setFullSidebarOpen((prev) => {
      const newState = !prev;
      onSidebarToggle?.(newState); // pass state to Layout
      return newState;
    });
  };

  const isCustomerLoggedIn = Boolean(localStorage.getItem("customerToken"));

  // Check if sidebar should be shown
  const shouldShowSideStrip = useMemo(() => {
    const excludedPaths = ["/main"]; // ❌ strip not shown on these
    const currentPath = location.pathname;

    return (
      isAuthenticated &&
      role != null &&
      ["owner", "manager", "staff"].includes(role.toLowerCase()) &&
      !isCustomerPage &&
      !excludedPaths.includes(currentPath)
    );
  }, [isAuthenticated, role, isCustomerPage, location.pathname]);

  useEffect(() => {
    const fetchLogoFromBackend = async () => {
      const businessId = localStorage.getItem("businessId");
      const showLogoRoutes = [
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
        "/tables",
        "/customer-list",
      ];

      const isMatchingRoute = showLogoRoutes.some(
        (path) =>
          location.pathname === path || location.pathname.startsWith(path + "/")
      );

      if (businessId && isMatchingRoute) {
        try {
          const response = await fetch(
            `${baseURL}/api/business/${businessId}`
          );
          if (!response.ok) throw new Error("Failed to fetch business");

          const data = await response.json();
          setBusinessName(data.name || null);
          setLogoUrl(data.logoUrl || null);
        } catch (error) {
          console.error("Error fetching logo:", error);
          setLogoUrl(null);
        }
      } else {
        setLogoUrl(null);
      }
    };

    fetchLogoFromBackend();
  }, [location.pathname]);

  useEffect(() => {
    const planStatus = localStorage.getItem("plan_status");
    const normalizedRole = role?.toLowerCase();
    const isCustomerLoggedIn = Boolean(localStorage.getItem("customerToken"));

    if (isCustomerLoggedIn) {
      // ✅ Force limited nav for logged-in customers
      setNavItems(restaurantNav);
      setSideStripItems([]);
    } else if (isAuthenticated) {
      if (normalizedRole === "superadmin") {
        setNavItems(superadminNav);
        setSideStripItems([]);
      } else if (planStatus === "active") {
        if (normalizedRole === "owner") {
          setNavItems([]);
          setSideStripItems(ownerDashboardNav);
        } else if (normalizedRole === "manager") {
          setNavItems([]);
          setSideStripItems(managerNav);
        } else if (normalizedRole === "staff") {
          setNavItems([]);
          setSideStripItems(staffNav);
        }
      } else {
        setNavItems(publicHomeNav);
        setSideStripItems([]);
      }
    } else if (isCustomerPage) {
      setNavItems(restaurantNav);
      setSideStripItems([]);
    } else {
      setNavItems(publicHomeNav);
      setSideStripItems([]);
    }
  }, [isAuthenticated, role, location.pathname, isCustomerPage]);

  useEffect(() => {
    const handleOpenCustomerLogin = () => {
      // Show modal logic here
      console.log("Open customer login modal");
    };

    window.addEventListener("open-customer-login", handleOpenCustomerLogin);

    return () => {
      window.removeEventListener(
        "open-customer-login",
        handleOpenCustomerLogin
      );
    };
  }, []);

  const handleLogout = () => {
    const isCustomer = Boolean(localStorage.getItem("customerToken"));

    if (isCustomer) {
      localStorage.removeItem("customerToken");
      navigate("/restaurant");
      setTimeout(() => {
        const event = new Event("customer-logged-out");
        window.dispatchEvent(event);
      }, 100);
    } else {
      logout();
      localStorage.removeItem("ownerHeaderEnabled");
      navigate("/login");
    }
  };

  if (isAuthenticated && !role) {
    console.warn("Authenticated user with undefined role");
    return null;
  }

  return (
    <>
      {/* Sidebar for desktop */}
      {shouldShowSideStrip && (
        <div className="fixed left-0 top-[64px] h-[calc(100vh-64px)] w-16 bg-[#0e1129] text-white z-40 hidden md:flex flex-col py-4 shadow-lg">
          <div className="flex flex-col space-y-2 flex-1 px-2">
            {sidestripItems.map(({ name, path }) => {
              const IconComponent = getNavIcon(name);
              return (
                <div key={name} className="relative group">
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `flex items-center justify-center h-11 w-12 rounded-lg transition-all duration-200 hover:bg-[#F4A300] hover:text-black cursor-pointer ${
                        isActive ? "bg-[#F4A300] text-black" : "text-white"
                      }`
                    }
                  >
                    <div className="relative">
                      <IconComponent size={20} />
                    </div>
                  </NavLink>

                  {/* Tooltip */}
                  <div className="absolute  ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 -top-0.5 transform -translate-y-1/2 cursor-pointer">
                    {name}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav className="bg-[#010320] text-white px-8 py-1 fixed top-0 left-0 right-0 z-50 shadow w-full">
        <div className="max-w-8xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {shouldShowSideStrip && (
              <button
                onClick={toggleSidebar}
                className="hidden md:inline-block text-white mr-2 -ml-2 focus:outline-none"
                title="Menu"
              >
                {fullSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            )}

            <img
              src={logoUrl || "/Willovate_Resto Logo.png"}
              alt={businessName || "WillovateRestro Logo"}
              className="h-14 w-auto object-contain"
            />
          </div>

          {/* Desktop navigation - only show if no sidebar */}
          {!shouldShowSideStrip && (
            <div className="hidden md:flex flex-1 justify-center space-x-6 text-[18px] font-medium flex-wrap">
              {navItems.map(({ name, path }) => (
                <NavLink
                  key={name}
                  to={path}
                  className={({ isActive }) =>
                    `transition hover:text-[#F4A300] ${
                      isActive ? "text-[#F4A300] font-semibold" : ""
                    }`
                  }
                >
                  {name}
                </NavLink>
              ))}
            </div>
          )}

          {/* Full Sidebar (desktop only) */}
          {fullSidebarOpen && shouldShowSideStrip && (
            <div
              ref={fullSidebarRef}
              className={`fixed top-[64px] left-16 h-[calc(100vh-64px)] z-[999] hidden md:flex flex-col justify-start py-4 bg-[#0e1129] transition-transform duration-300 ease-in-out ${
                fullSidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
              style={{ width: "200px" }}
            >
              <div className="flex flex-col space-y-2">
                {sidestripItems.map(({ name, path }) => (
                  <NavLink
                    key={name}
                    to={path}
                    className={({ isActive }) =>
                      `h-11 flex items-center pl-3 pr-2 rounded-md transition-all text-left cursor-pointer
                    ${
                      isActive
                        ? "bg-[#F4A300] text-black font-semibold"
                        : "text-white hover:bg-[#F4A300] hover:text-black"
                    }`
                    }
                  >
                    {name}
                  </NavLink>
                ))}
              </div>
            </div>
          )}

          {/* Right side - Profile and Login/Logout */}
          <div className="hidden md:flex items-center gap-4 whitespace-nowrap">
            {isAuthenticated || isCustomerLoggedIn ? (
              <>
                {isAuthenticated ? (
                  <div
                    className="flex items-center gap-2 cursor-pointer text-sm"
                    onClick={() => navigate("/admin-profile")}
                  >
                    <FaUserCircle size={18} />
                    <span>Role: {role}</span>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-2 cursor-pointer text-sm"
                    onClick={() => navigate("/cus-profile")}
                  >
                    <FaUserCircle size={18} />
                    <span>My Profile</span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-4 py-1.5 rounded-full text-white font-semibold cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              !isAuthenticated &&
              !isCustomerLoggedIn &&
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
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#010320] text-white px-4 pt-4 pb-6 space-y-3 rounded-b-lg">
            {(navItems.length > 0 ? navItems : sidestripItems).map(
              ({ name, path }) => (
                <NavLink
                  key={name}
                  to={path}
                  className={({ isActive }) =>
                    `block py-2 px-2 rounded hover:bg-[#F4A300] hover:text-black cursor-pointer ${
                      isActive ? "bg-[#F4A300] text-black" : ""
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {name}
                </NavLink>
              )
            )}

            <hr className="border-gray-600 my-2" />

            {isAuthenticated || isCustomerLoggedIn ? (
              <div className="flex flex-col items-start gap-3 px-4 py-2">
                {isAuthenticated ? (
                  <div
                    className="flex items-center gap-2 cursor-pointer text-sm"
                    onClick={() => navigate("/admin-profile")}
                  >
                    <FaUserCircle size={18} />
                    <span>Role: {role}</span>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-2 cursor-pointer text-sm"
                    onClick={() => navigate("/cus-profile")}
                  >
                    <FaUserCircle size={18} />
                    <span>My Profile</span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-4 py-1.5 rounded-full text-white font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              !isAuthenticated &&
              !isCustomerLoggedIn &&
              !isCustomerPage && (
                <div className="px-4 py-2">
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-[#F4A300] text-black font-semibold py-2 px-4 rounded-full"
                  >
                    Login / Signup
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
