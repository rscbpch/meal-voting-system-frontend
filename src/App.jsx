import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();

    const hideNavbar = ['/login', '/register'].includes(location.pathname);

    return (
        <div>
            {!hideNavbar && <nav><Navbar isAuthenticated={isAuthenticated}/></nav>}

            <Routes>
                <Route path="/" element={<Homepage />}/>
                <Route path="/login" element={<LoginPage />}/>
                <Route path="/register" element={<RegisterPage />}/>
            </Routes>
        </div>
    );
};

export default App;