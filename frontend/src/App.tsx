import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/Layout";

// Pages
import { Home } from "./pages/Home";
import Features from "@/pages/Features";
import Profile from "@/pages/Profile";
import MyUrls from "@/pages/MyUrls";
import { SignIn } from "./pages/Signin";
import { SignUp } from "./pages/SignUp";
import { OTPPage } from "./pages/InputOTP";
import { Toaster } from "react-hot-toast";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 3000 }}
      />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-urls" element={<MyUrls />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/otp" element={<OTPPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
