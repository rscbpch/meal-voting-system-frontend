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
import Menu from "./pages/MenuPage";
import Wishlist from "./pages/voter/Wishlist";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Feedback from "./pages/voter/Feedback";
import MenuManagement from "./pages/staff/MenuManagement";
import FoodForVoter from "./pages/staff/FoodForVoter";
import AboutUs from "./pages/AboutUs";
import HistoryPage from "./pages/voter/HistoryPage";

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

                <Route path="/menu" element={<Menu />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/staff-login" element={<StaffLogin />} />
                <Route path="/auth/callback" element={<Callback />} />
                <Route path="/setup-account" element={<SetupAccount />} />
                <Route path="/about-us" element={<AboutUs />} />

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
                    path="/history" 
                    element={
                        <PrivateRoute allowedRoles={["voter"]}>
                            <HistoryPage />
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

                <Route
                    path="/menu-management"
                    element={
                        <PrivateRoute allowedRoles={["staff"]}>
                            <MenuManagement />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/food"
                    element={
                        <PrivateRoute allowedRoles={["staff"]}>
                            <FoodForVoter />
                        </PrivateRoute>
                    }
                />

                
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
