import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import LogoWhite from "../assets/LogoWhite.png";
import AuthService from "../services/authService";

const Navbar = ({ isAuthenticated = false, setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            console.log('Logging out user...');
            
            await AuthService.logout();
            setShowUserDropdown(false);

            if (setIsAuthenticated) setIsAuthenticated(false);
            console.log('Logout successful.');

            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            if (setIsAuthenticated) setIsAuthenticated(false);
            navigate('/');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="sticky top-0 z-50 max-w-full h-16 p-6 flex items-center justify-between shadow-md bg-white">
                <div>
                    <img src={LogoWhite} alt="Logo" className="h-16" />
                </div>
                <div className="flex space-x-4">
                    <button 
                        onClick={() => navigate('/login')} 
                        className="main-border-button font-title"
                    >
                        Login
                    </button>
                    <button 
                        onClick={() => navigate('/register')} 
                        className="main-button font-normal"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="sticky top-0 z-50 max-w-full h-16 p-6 flex items-center justify-between shadow-md bg-white">
            <div>
                <img src={LogoWhite} alt="Logo" className="h-16" />
            </div>
            <div>
                <ul className=" flex list-none space-x-6">
                    <li onClick={() => navigate('/')} className="cursor-pointer main-text-w-hover font-title font-semibold">Home</li>
                    <li onClick={() => navigate('/menu')} className="cursor-pointer main-text-w-hover font-title font-semibold">Today's Menu</li>
                    <li onClick={() => navigate('/wishlist')} className="cursor-pointer main-text-w-hover font-title font-semibold">Wishlist</li>
                    <li onClick={() => navigate('/history')} className="cursor-pointer main-text-w-hover font-title font-semibold">History</li>
                </ul>
            </div>
            <div className="relative" ref={dropdownRef}>
                <FiUser 
                    size={24} 
                    className="cursor-pointer main-text-w-hover"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                />
                
                {showUserDropdown && (
                    <div className="absolute right-0 top-8 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                        <button
                            onClick={() => {
                                console.log('Change password...');
                                setShowUserDropdown(false);
                            }}
                            className="option-button w-full text-left flex items-center gap-2 font-normal"
                        >
                            <FiSettings size={16} />
                            Settings
                        </button>
                        <button
                            onClick={handleLogout}
                            className="option-button w-full text-left flex items-center gap-2 font-normal"
                        >
                            <FiLogOut size={16} />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;