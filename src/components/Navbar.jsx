import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FiUser, FiLogOut, FiLock } from "react-icons/fi";
import LogoWhite from "../assets/LogoWhite.png"

const Navbar = ({ isAuthenticated = false }) => {
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

    const handleLogout = () => {
        console.log('Logging out...');
        setShowUserDropdown(false);
        navigate('/login');
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
                        className="cursor-pointer border-2 border-[#429818] font-['Quicksand'] text-[#429818] px-6 py-2 rounded-[10px] font-semibold hover:border-[#386641] hover:text-[#386641] transition-colors"
                    >
                        Login
                    </button>
                    <button 
                        onClick={() => navigate('/register')} 
                        className="cursor-pointer bg-[#429818] font-['Quicksand'] text-white px-6 py-2 rounded-[10px] font-semibold hover:bg-[#386641] transition-colors"
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
                    <li onClick={() => navigate('')} className="cursor-pointer text-[#429818] hover:text-[#386641] font-semibold">Home</li>
                    <li onClick={() => navigate('')} className="cursor-pointer text-[#429818] hover:text-[#386641] font-semibold">Today's Menu</li>
                    <li onClick={() => navigate('')} className="cursor-pointer text-[#429818] hover:text-[#386641] font-semibold">Wishlist</li>
                    <li onClick={() => navigate('')} className="cursor-pointer text-[#429818] hover:text-[#386641] font-semibold">History</li>
                </ul>
            </div>
            <div className="relative" ref={dropdownRef}>
                <FiUser 
                    size={24} 
                    className="cursor-pointer text-[#429818] hover:text-[#386641]"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                />
                
                {showUserDropdown && (
                    <div className="absolute right-0 top-8 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                        <button
                            onClick={() => {
                                console.log('Change password...');
                                setShowUserDropdown(false);
                            }}
                            className="cursor-pointer w-full text-left px-4 py-2 text-[#3A4038] hover:bg-gray-100 hover:text-[#429818] transition-colors flex items-center gap-2"
                        >
                            <FiLock size={16} />
                            Change Password
                        </button>
                        <button
                            onClick={handleLogout}
                            className="cursor-pointer w-full text-left px-4 py-2 text-[#3A4038] hover:bg-gray-100 hover:text-[#429818] transition-colors flex items-center gap-2"
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