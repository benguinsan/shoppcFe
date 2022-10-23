import { Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import Header from "./components/header/Header";
import Navbar from "./components/navbar/Navbar";
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
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="sign-in" element={<SignInPage />}></Route>
          <Route path="sign-up" element={<SignUpPage />}></Route>
          <Route path="verify" element={<VerifyPage />}></Route>
          <Route path="reset-password" element={<ResetPasswordPage />}></Route>
          <Route
            path="forgot-password"
            element={<ForgotPasswordPage />}
          ></Route>
          <Route element={<DashboardLayout />}>
            <Route path="/account" element={<UserAccount />}></Route>
            <Route path="/account/orders" element={<UserOrder />}></Route>
            <Route path="/account/address" element={<UserAddress />}></Route>
          </Route>
          <Route path="*" element={<NotFoundPage />}></Route>
        </Routes>
        <Footer />
      </Suspense>
    </>
  );
}

export default App;
