import { Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import Header from "./components/header/Header";
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
// const HomePage = React.lazy(() => import("./page/HomePage"));
// const NotFoundPage = React.lazy(() => import("./page/NotFoundPage"));
// const SignInPage = React.lazy(() => import("./page/SignInPage"));
// const SignUpPage = React.lazy(() => import("./page/SignUpPage"));
// const VerifyPage = React.lazy(() => import("./page/VerifyPage"));
// const ResetPasswordPage = React.lazy(() => import("./page/ResetPasswordPage"));
// const ForgotPasswordPage = React.lazy(() =>
//   import("./page/ForgotPasswordPage")
// );
// const UserAccount = React.lazy(() =>
//   import("./module/UserProfile/UserAccount")
// );
// const UserOrder = React.lazy(() => import("./module/UserProfile/UserOrder"));
// const UserAddress = React.lazy(() =>
//   import("./module/UserProfile/UserAddress")
// );
// const DashboardLayout = React.lazy(() =>
//   import("./module/dashboard/DashboardLayout")
// );

function App() {
  return (
    <>
      <Suspense>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/sign-in" element={<SignInPage />}></Route>
          <Route path="/sign-up" element={<SignUpPage />}></Route>
          <Route path="/verify" element={<VerifyPage />}></Route>
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          ></Route>
          <Route
            path="/forgot-password"
            element={<ForgotPasswordPage />}
          ></Route>
          <Route element={<DashboardLayout />}>
            <Route path="/account" element={<UserAccount />}></Route>
            <Route path="/account/orders" element={<UserOrder />}></Route>
            <Route
              path="/account/orders/:id"
              element={<InformationDetailOrder />}
            ></Route>
            <Route path="/account/address" element={<UserAddress />}></Route>
            <Route
              path="/account/reset-password"
              element={<UpdatePassword />}
            ></Route>
          </Route>
          <Route element={<ProductDetail />} path="/:slug"></Route>
          <Route path="/cart" element={<CartPage />}></Route>
          <Route path="/checkout" element={<PaymentPage />}></Route>
          <Route path="/product" element={<ProductFilterPage />}></Route>
          <Route path="/payment-cash" element={<PaymentCash />}></Route>
          <Route path="/payment-bank" element={<PaymentBank />}></Route>
          <Route path="*" element={<NotFoundPage />}></Route>
        </Routes>
        <Footer />
      </Suspense>
    </>
  );
}

export default App;
