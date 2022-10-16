import { AuthProvider } from "./contexts/authContext";
import { Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";

const HomePage = React.lazy(() => import("./page/HomePage"));
const NotFoundPage = React.lazy(() => import("./page/NotFoundPage"));
const SignInPage = React.lazy(() => import("./page/SignInPage"));
const SignUpPage = React.lazy(() => import("./page/SignUpPage"));
const VerifyPage = React.lazy(() => import("./page/VerifyPage"));
const ResetPasswordPage = React.lazy(() => import("./page/ResetPasswordPage"));
const ForgotPasswordPage = React.lazy(() =>
  import("./page/ForgotPasswordPage")
);

function App() {
  return (
    <>
      <AuthProvider>
        <Suspense>
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="sign-in" element={<SignInPage />}></Route>
            <Route path="sign-up" element={<SignUpPage />}></Route>
            <Route path="verify" element={<VerifyPage />}></Route>
            <Route
              path="reset-password"
              element={<ResetPasswordPage />}
            ></Route>
            <Route
              path="forgot-password"
              element={<ForgotPasswordPage />}
            ></Route>
            <Route path="*" element={<NotFoundPage />}></Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </>
  );
}

export default App;
