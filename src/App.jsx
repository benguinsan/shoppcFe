import { Routes, Route } from "react-router-dom";
import React from "react";
import Footer from "./components/footer/Footer";
import HomePage from "./page/HomePage";
import NotFoundPage from "./page/NotFoundPage";
import SignInPage from "./page/SignInPage";
import SignUpPage from "./page/SignUpPage";
import VerifyPage from "./page/VerifyPage";
import ResetPasswordPage from "./page/ResetPasswordPage";
import ForgotPasswordPage from "./page/ForgotPasswordPage";
import UserAccount from "./module/UserProfile/UserAccount";
import UserOrder from "./module/UserProfile/UserOrder";
import UserAddress from "./module/UserProfile/UserAddress";
import DashboardLayout from "./module/dashboard/DashboardLayout";
import ProductDetail from "./page/ProductDetail";
import UpdatePassword from "./module/UserProfile/UpdatePassword";
import CartPage from "./module/cart/CartPage";
import PaymentPage from "./module/payment/PaymentPage";
import ProductFilterPage from "./page/ProductFilterPage";
import PaymentCash from "./module/payment/PaymentCash";
import PaymentBank from "./module/payment/PaymentBank";
import InformationDetailOrder from "./module/UserProfile/InformationDetailOrder";
import Navbar from "./components/navbar/Navbar";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { key } from "./utils/constants/key";
import ChatStream from "./components/chat/ChatStream";

// import admin
import AdminLayout from "./components/admin/layoutAdmin";
import Dashboard from "./page/admin/dashboard";
import Products from "./page/admin/product/products";
import ProductCreate from "./page/admin/product/create";
import ProductEdit from "./page/admin/product/edit";
import ProductTypes from "./page/admin/category/category";
import Categories from "./page/admin/category/category";
import CreateCategory from "./page/admin/category/create";
import EditCategory from "./page/admin/category/edit";

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
