import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/auth/Login";
import SignupPage from "./pages/auth/SignUp";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <div>
            <nav><Navbar isAuthenticated={isAuthenticated}/></nav>

            <Routes>
                <Route path="/" element={<Homepage />}/>
                <Route path="/login" element={<LoginPage />}/>
                <Route path="/signup" element={<SignupPage />}/>
            </Routes>
        </div>
    );
};

export default App;