import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PrivateRoute from "./components/PrivateRoute";
import Homepage from "./pages/Homepage";
import SignIn from "./pages/auth/SignIn";
import StaffLogin from "./pages/auth/StaffLogin";
import Callback from "./pages/auth/Callback";
import SetupAccount from "./pages/auth/SetupAccount";
import Profile from "./pages/voter/Profile";
import Dashboard from "./pages/staff/Dashboard";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Feedback from "./pages/voter/Feedback";

const AppRoutes = () => {
    const location = useLocation();
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // or a spinner
    }

    const role = user?.role;

    return (
        <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
                {/* Homepage: redirect based on role */}
                <Route
                    path="/"
                    element={
                        role === "staff" ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <Homepage />
                        )
                    }
                />

                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/staff-login" element={<StaffLogin />} />
                <Route path="/auth/callback" element={<Callback />} />
                <Route path="/setup-account" element={<SetupAccount />} />

                {/* Private routes */}
                <Route
                    path="/user/profile"
                    element={
                        <PrivateRoute allowedRoles={["voter"]}>
                            <Profile />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute allowedRoles={["staff"]}>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route path="/feedback" element={<Feedback />} />

                
            </Routes>
        </AnimatePresence>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <LanguageProvider>
                <AppRoutes />
            </LanguageProvider>
        </AuthProvider>
    );
};

export default App;
