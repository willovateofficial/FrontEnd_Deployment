import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/user/Home";
import Layout from "./components/Layout";
import CategoryPage from "./components/CategoryPage";
import GenerateBarcodePage from "./components/generate-barcode";
import QrRedirect from "./components/QrRedirect";
import Register from "./components/Register";
import AdminInterface from "./components/AdminInterface";
import Login from "./components/login";
import AddEditDish from "./components/add-edit-dish";
import MainMenuPage from "./components/main-menu";
import MainHome from "./components/main-home";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ProtectedRoute } from "./components/common/protected-route";
import PaymentButton from "./components/payment";
import Unauthorized from "./pages/unauthorized";
import TermsAndConditions from "./components/policy/terms-and-conditions";
import PrivacyPolicy from "./components/policy/privacy-policy";
import CancellationPolicy from "./components/policy/cancellation-policy";
import UserManagement from "./components/admin/user-management";
import OrderList from "./components/Order-List";
import OrderDetails from "./components/Order-Detail";
import PlanCheckoutPage from "./components/PlanCheckoutPage";
import Dashboard from "./components/Dashboard";
import TrackOrder from "./components/user/TrackOrder";
import BillPage from "./components/BillPage";
import BillPrintExample from "./components/BillPrintExample";
import CreateRestro from "./components/createrestro";
import SuccessPage from "./components/SuccessPage";
import HowItWorks from "./components/HowItWorks";
import Benefits from "./components/Benefits";
import AboutUs from "./components/AboutUs";
import PlansPage from "./components/PlansPage";
import AdminProfile from "./components/AdminProfile";
import PaymentWaitingPage from "./components/PaymentWaitingPage";
import FAQ from "./components/faq";
import InventoryPage from "./components/InventoryPage";
import TableView from "./components/TableView";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import PendingVerification from "./components/pendingVerification";

import ForgotPassword from "./components/forgotPassword";

import AddCouponPage from "./components/AddCouponPage";

import DemoVideoPage from "./components/DemoVideoPage";     

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<MainHome />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/benefits" element={<Benefits />} />
          <Route path="/plan-section" element={<PlansPage />} />
          <Route path="/demo" element={<DemoVideoPage />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/restaurant" element={<Home />} />
          <Route path="/restaurant/:name" element={<CategoryPage />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* QR Code redirect */}
          <Route path="/r/:data" element={<QrRedirect />} />
          <Route path="/inventory" element={<InventoryPage />} />
        </Route>

        <Route path="/payment-waiting" element={<PaymentWaitingPage />}></Route>

        {/* <Route path="/pending-verification" element={<PendingVerification />} /> */}

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/" element={<Layout />}>
          <Route
            path="/barcode"
            element={
              <ProtectedRoute
                allowedRoles={["owner", "manager", "admin", "user"]}
              >
                <GenerateBarcodePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tables"
            element={
              <ProtectedRoute allowedRoles={["owner", "manager", "staff"]}>
                <TableView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-profile"
            element={
              <ProtectedRoute
                allowedRoles={["owner", "manager", "admin", "superadmin"]}
              >
                <AdminProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-edit-dish"
            element={
              <ProtectedRoute allowedRoles={["owner", "manager", "admin"]}>
                <AddEditDish />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-menu-list"
            element={
              <ProtectedRoute
                allowedRoles={["owner", "manager", "admin", "user"]}
              >
                <MainMenuPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute allowedRoles={["admin", "user", "owner"]}>
                <PaymentButton />
              </ProtectedRoute>
            }
          />

          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route
            path="/plancheckoutpage"
            element={
              <ProtectedRoute allowedRoles={["admin", "user", "owner"]}>
                <PlanCheckoutPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sucesspage"
            element={
              <ProtectedRoute allowedRoles={["admin", "user", "owner"]}>
                <SuccessPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-list"
            element={
              <ProtectedRoute
                allowedRoles={["staff", "owner", "manager", "admin"]}
              >
                <OrderList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-details/:orderId"
            element={
              <ProtectedRoute
                allowedRoles={["staff", "owner", "manager", "admin"]}
              >
                <OrderDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bill/:orderId"
            element={
              <ProtectedRoute
                allowedRoles={["staff", "owner", "manager", "admin"]}
              >
                <BillPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bill-print-example"
            element={
              <ProtectedRoute
                allowedRoles={["staff", "owner", "manager", "admin"]}
              >
                <BillPrintExample />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["owner", "manager", "admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-coupon"
            element={
              <ProtectedRoute allowedRoles={["owner", "manager", "admin"]}>
                <AddCouponPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/t&c"
            element={
              <ProtectedRoute allowedRoles={["admin", "user", "owner"]}>
                <TermsAndConditions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/privacy-policy"
            element={
              <ProtectedRoute allowedRoles={["admin", "user", "owner"]}>
                <PrivacyPolicy />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cancellation-policy"
            element={
              <ProtectedRoute allowedRoles={["admin", "user", "owner"]}>
                <CancellationPolicy />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-resto"
            element={
              <ProtectedRoute allowedRoles={["owner", "manager", "admin"]}>
                <CreateRestro />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-management"
            element={
              <ProtectedRoute allowedRoles={["owner", "manager", "admin"]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["superadmin"]}>
                <AdminInterface />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
