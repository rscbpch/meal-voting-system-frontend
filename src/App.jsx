import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import AuthService from "./services/authService";
import UserProfile from "./pages/UserProfile";
import VerifyEmail from "./pages/auth/VerifyEmail";


const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const hideNavbar = ['/login', '/register', '/verify-email'].includes(location.pathname);

    useEffect(() => {
        const checkAuth = () => {
            const authenticated = AuthService.isAuthenticated();
            setIsAuthenticated(authenticated);
            setLoading(false);
        };

        checkAuth();

        const handleStorageChange = () => {
            const authenticated = AuthService.isAuthenticated();
            setIsAuthenticated(authenticated);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const updateAuthState = (authStatus) => {
        console.log('Updating auth state to: ', authStatus);
        setIsAuthenticated(authStatus);

        if (!authStatus) {
            const token = localStorage.getItem('authToken');
            const userData = localStorage.getItem('userData');

            if (token || userData) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                console.log('Cleared remaining auth data.')
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg font-title">Loading...</div>
            </div>
        );
    }

    return (
        <div>
            {!hideNavbar && (
                <Navbar
                    isAuthenticated={isAuthenticated}
                    setIsAuthenticated={updateAuthState}
                />
            )}

            <Routes>
                <Route path="/" element={<Homepage isAuthenticated={isAuthenticated} setIsAuthenticated={updateAuthState} />}/>
                <Route path="/login" element={<LoginPage updateAuthState={updateAuthState}/>}/>
                <Route path="/register" element={<RegisterPage />}/>
                <Route path="/profile" element={<UserProfile />}/>
                <Route path="/verify-email" element={<VerifyEmail />}/>

            </Routes>
        </div>
    );
};

export default App;