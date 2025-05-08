import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ChatStream from "./components/chat/ChatStream";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import InformationDetailOrder from "./module/UserProfile/InformationDetailOrder";
import UpdatePassword from "./module/UserProfile/UpdatePassword";
import UserAccount from "./module/UserProfile/UserAccount";
import UserAddress from "./module/UserProfile/UserAddress";
import UserOrder from "./module/UserProfile/UserOrder";
import CartPage from "./module/cart/CartPage";
import DashboardLayout from "./module/dashboard/DashboardLayout";
import PaymentBank from "./module/payment/PaymentBank";
import PaymentCash from "./module/payment/PaymentCash";
import PaymentPage from "./module/payment/PaymentPage";
import ForgotPasswordPage from "./page/ForgotPasswordPage";
import HomePage from "./page/HomePage";
import NotFoundPage from "./page/NotFoundPage";
import ProductDetail from "./page/ProductDetail";
import ProductFilterPage from "./page/ProductFilterPage";
import ResetPasswordPage from "./page/ResetPasswordPage";
import SignInPage from "./page/SignInPage";
import SignUpPage from "./page/SignUpPage";
import VerifyPage from "./page/VerifyPage";
import { key } from "./utils/constants/key";

// import admin
import AdminLayout from "./components/admin/layoutAdmin";
import Categories from "./page/admin/category/category";
import CreateCategory from "./page/admin/category/create";
import EditCategory from "./page/admin/category/edit";
import Dashboard from "./page/admin/dashboard";
import CreateImport from "./page/admin/imports/create";
import Imports from "./page/admin/imports/imports";
import Orders from "./page/admin/order/orders";
import ProductCreate from "./page/admin/product/create";
import ProductEdit from "./page/admin/product/edit";
import Products from "./page/admin/product/products";
import Warranties from "./page/admin/warranty/warranties";

function App() {
  return (
    <>
      <PayPalScriptProvider
        options={{
          "client-id": key.ClientId,
        }}
      >
        <Routes>
          {/* Admin routes */}
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="product/create" element={<ProductCreate />} />
            <Route path="product/update" element={<ProductEdit />} />
            <Route path="categories" element={<Categories />} />
            <Route path="category/create" element={<CreateCategory />} />
            <Route path="category/update" element={<EditCategory />} />
            <Route path="orders" element={<Orders />} />
            <Route path="warranties" element={<Warranties />} />
            <Route path="imports" element={<Navigate to="imports-list" replace />} />
            <Route path="imports-list" element={<Imports />} />
            <Route path="imports-create" element={<CreateImport />} />
          </Route>

          {/* Public and authenticated user routes */}
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/sign-in" element={<SignInPage />} />
                  <Route path="/sign-up" element={<SignUpPage />} />
                  <Route path="/verify" element={<VerifyPage />} />
                  <Route
                    path="/reset-password/:token"
                    element={<ResetPasswordPage />}
                  />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                  />

                  <Route element={<DashboardLayout />}>
                    <Route path="/account" element={<UserAccount />} />
                    <Route path="/account/orders" element={<UserOrder />} />
                    <Route
                      path="/account/orders/:id"
                      element={<InformationDetailOrder />}
                    />
                    <Route path="/account/address" element={<UserAddress />} />
                    <Route path="/account/chat" element={<ChatStream />} />
                    <Route
                      path="/account/reset-password"
                      element={<UpdatePassword />}
                    />
                  </Route>

                  <Route path="/:slug/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<PaymentPage />} />
                  <Route path="/product" element={<ProductFilterPage />} />
                  <Route path="/payment-cash" element={<PaymentCash />} />
                  <Route path="/payment-bank" element={<PaymentBank />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
      </PayPalScriptProvider>
    </>
  );
}

export default App;
