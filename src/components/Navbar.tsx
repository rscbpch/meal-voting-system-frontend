import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
    FiUser,
    FiRotateCw,
    FiLogOut,
    FiGlobe,
    FiHeart,
    FiChevronDown,
    FiLogIn,
} from "react-icons/fi";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { TbHistoryToggle } from "react-icons/tb";
import LogoWhite from "../assets/LogoWhite-removebg.svg";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const navigate = useNavigate();
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { isEng, setIsEng } = useLanguage();
    const [hover, setHover] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated);
    const buttonTextWidth = "w-7";
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowUserDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        logout();
        setIsLoggedIn(false);
        setShowUserDropdown(false);
        navigate("/");
    };

    const getInitials = (name?: string): string => {
        if (!name) return "U"; // fallback if no name

        const parts = name.trim().split(" ");
        let initials = parts[0].charAt(0).toUpperCase();

        if (parts.length > 1) {
            initials += parts[parts.length - 1].charAt(0).toUpperCase();
        }

        return initials;
    };

    return (
        <nav className="sticky top-0 z-50 max-w-full h-16 p-3 flex items-center shadow-md shadow-gray-200 bg-white">
            <div className="flex-1 flex items-center">
                <div className="h-20 w-20">
                    <img
                        src={LogoWhite}
                        alt="Logo"
                        className="h-full w-full object-cover mx-auto"
                    />
                </div>
            </div>
            <div className="hidden lg:flex items-center space-x-8">
                <Link
                    to="/"
                    className={`font-semibold transition-colors cursor-pointer ${
                        location.pathname === "/"
                            ? "text-[#3E7B27]"
                            : "text-gray-700 hover:text-[#3E7B27]"
                    }`}
                >
                    Home
                </Link>
                <Link
                    to="/shop"
                    className={`font-semibold transition-colors cursor-pointer ${
                        location.pathname === "/shop" ||
                        location.pathname.startsWith("/menu")
                            ? "text-[#3E7B27]"
                            : "text-gray-700 hover:text-[#3E7B27]"
                    }`}
                >
                    Menu
                </Link>
                <Link
                    to="/about"
                    className={`font-semibold transition-colors cursor-pointer ${
                        location.pathname === "/feedback"
                            ? "text-[#3E7B27]"
                            : "text-gray-700 hover:text-[#3E7B27]"
                    }`}
                >
                    Feedback
                </Link>
                <Link
                    to="/contact"
                    className={`font-semibold transition-colors cursor-pointer ${
                        location.pathname === "/about-us"
                            ? "text-[#429818]"
                            : "text-gray-700 hover:text-[#3E7B27]"
                    }`}
                >
                    About us
                </Link>
            </div>
            <div className="flex-1 flex items-center justify-end">
                <div className="flex items-center space-x-4">
                    {/* <button className="cursor-pointer bg-[#F0F0F0] p-2 rounded-full transition-colors group hover:bg-[#DDF4E7]"> */}

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => console.log(user?.displayName)}
                            className="p-2 hover:bg-[#DDF4E7] rounded-full transition-all group duration-300 ease-in-out transform hover:scale-110 cursor-pointer hidden lg:block"
                        >
                            <FiHeart
                                size={20}
                                className="transition-colors group-hover:stroke-[#386641]"
                            />
                        </button>
                        {/* <div>
                            <button className="p-2 hover:bg-[#DDF4E7] rounded-full transition-all group duration-300 ease-in-out transform hover:scale-110 cursor-pointer hidden lg:block">
                                <FiGlobe
                                    size={20}
                                    className="transition-colors group-hover:stroke-[#386641]"
                                />
                            </button>
                            
                        </div> */}
                        <div
                            className="relative inline-block"
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                        >
                            {/* Globe Button */}
                            <button className="flex items-center gap-2 p-2 hover:bg-[#DDF4E7] rounded-2xl transition-all group duration-300 ease-in-out transform hover:scale-110 cursor-pointer">
                                <FiGlobe
                                    size={20}
                                    className="transition-colors group-hover:stroke-[#386641] "
                                />
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.span
                                        key={isEng ? "ENG" : "KH"}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.2 }}
                                        className={`text-sm font-medium ${buttonTextWidth} flex justify-center ${
                                            isEng
                                                ? "font-semibold"
                                                : "khmer-font-content"
                                        }`}
                                    >
                                        {isEng ? "ENG" : "ខ្មែរ"}
                                    </motion.span>
                                </AnimatePresence>
                            </button>

                            {/* Dropdown on hover */}
                            <div
                                className={`absolute right-0 top-8 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-20 transform transition-all duration-200 origin-top ${
                                    hover
                                        ? "opacity-100 scale-100 translate-y-0"
                                        : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                                }`}
                            >
                                <div className="flex flex-col divide-y divide-gray-100">
                                    <button
                                        onClick={() => setIsEng(true)}
                                        className={`px-4 py-3 text-left w-full font-medium ${
                                            isEng
                                                ? "bg-[#EAF6E7] font-semibold text-[#3E7B27]"
                                                : "hover:text-[#3E7B27]"
                                        }`}
                                    >
                                        English
                                    </button>
                                    <button
                                        onClick={() => setIsEng(false)}
                                        className={`px-4 py-3 text-left w-full khmer-font-content ${
                                            !isEng
                                                ? "bg-[#F7F7F7] font-medium text-[#3E7B27]"
                                                : "hover:text-[#3E7B27]"
                                        }`}
                                    >
                                        ខ្មែរ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="flex items-center bg-[#DDF4E7] space-x-2"> */}

                    {/* display dropdown */}
                    {isLoggedIn ? (
                        <div
                            onMouseEnter={() => setShowUserDropdown(true)}
                            onMouseLeave={() => setShowUserDropdown(false)}
                            className="hidden lg:flex items-center bg-[#DDF4E7] space-x-2 px-2 py-1 text-gray-700 rounded-3xl transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                        >
                            <div className="w-7 h-7 rounded-full bg-[#3E7E1F] flex items-center justify-center text-white font-semibold text-xs">
                                {getInitials(user?.displayName || "U")}
                            </div>

                            <div className="relative flex items-center">
                                <button className="cursor-pointer flex items-center justify-center h-8">
                                    <FiChevronDown
                                        className={`align-middle transform transition-transform duration-300 ${
                                            showUserDropdown ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {showUserDropdown && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute right-0 top-8 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden"
                                    >
                                        <div className="flex flex-col divide-y divide-gray-100">
                                            <button
                                                onClick={() => {
                                                    setShowUserDropdown(false);
                                                    navigate("/user/profile");
                                                }}
                                                className="flex items-center gap-3 px-5 py-3 text-[#222] hover:bg-[#F7F7F7] transition-colors text-base font-medium focus:outline-none"
                                            >
                                                <span className="bg-[#EAF6E7] p-2 rounded-full">
                                                    <FiUser
                                                        size={18}
                                                        className="text-[#429818]"
                                                    />
                                                </span>
                                                <span>Profile</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowUserDropdown(false);
                                                    console.log("clicked");
                                                }}
                                                className="flex items-center gap-3 px-5 py-3 text-[#222] hover:bg-[#F7F7F7] transition-colors text-base font-medium focus:outline-none"
                                            >
                                                <span className="bg-[#EAF6E7] p-2 rounded-full">
                                                    <FiRotateCw
                                                        size={18}
                                                        className="text-[#429818]"
                                                    />
                                                </span>
                                                <span>History</span>
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                disabled={isLoggingOut}
                                                className="flex items-center gap-3 px-5 py-3 text-[#D32F2F] hover:bg-[#FFF0F0] transition-colors text-base font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoggingOut ? (
                                                    <div className="flex items-center space-x-2">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                                                        <span>
                                                            Signing out...
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className="bg-[#FDEAEA] p-2 rounded-full flex items-center justify-center">
                                                            <FiLogOut
                                                                size={18}
                                                                className="text-[#D32F2F]"
                                                            />
                                                        </span>
                                                        <span>Logout</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <button
                                onClick={() => navigate("/sign-in")}
                                className="hidden lg:flex cursor-pointer px-6 py-2 rounded-[10px] font-semibold bg-[#429818] text-white hover:bg-[#3E7B27] transition-colors"
                            >
                                Sign In
                            </button>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden focus:outline-none p-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 cursor-pointer group hover:bg-[#EAF6E7]"
                        title="Menu"
                    >
                        <svg
                            className="w-7 h-7 stroke-gray-700 transition-colors duration-300 group-hover:stroke-[#3E7B27]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="lg:hidden fixed top-0 right-0 h-full w-80 bg-gray-50 shadow-xl z-50"
                    >
                        {/* Menu content here */}
                        <div className="lg:hidden fixed top-0 right-0 h-full w-80 bg-gray-50 shadow-xl z-50 transform transition-all duration-500 ease-out animate-slideInRightSlow">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                                <h2 className="text-xl font-bold text-gray-600">
                                    Menu
                                </h2>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-6 overflow-y-auto h-full bg-gray-50 pb-32">
                                {/* Navigation Links */}
                                <div className="space-y-1">
                                    <Link
                                        to="/"
                                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                                            location.pathname === "/"
                                                ? "text-[#3E7B27] bg-[#EAF6E7] font-semibold"
                                                : "text-gray-700 hover:text-[#3E7B27] hover:bg-blue-50 font-medium"
                                        }`}
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                            />
                                        </svg>
                                        <span>Home</span>
                                    </Link>

                                    <Link
                                        to="/menu"
                                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                                            location.pathname === "/menu"
                                                ? "text-[#3E7B27] bg-[#EAF6E7] font-semibold"
                                                : "text-gray-700 hover:text-[#3E7B27] hover:bg-[#EAF6E7] font-medium"
                                        }`}
                                    >
                                        <HiOutlineMenuAlt2 className="w-5 h-5" />
                                        <span>Menu</span>
                                    </Link>

                                    <Link
                                        to="/feedback"
                                        className={`flex items-center space-x-3 p-3 font-medium transition-colors rounded-lg cursor-pointer ${
                                            location.pathname === "/feedback"
                                                ? "text-[#3E7B27] bg-[#EAF6E7] font-semibold"
                                                : "text-gray-700 hover:text-[#3E7B27] hover:bg-[#EAF6E7] font-medium"
                                        }`}
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span>Feedback</span>
                                    </Link>

                                    <Link
                                        to="/about"
                                        className={`flex items-center space-x-3 p-3 font-medium transition-colors rounded-lg cursor-pointer ${
                                            location.pathname === "/about"
                                                ? "text-[#3E7B27] bg-[#EAF6E7] font-semibold"
                                                : "text-gray-700 hover:text-[#3E7B27] hover:bg-[#EAF6E7] font-medium"
                                        }`}
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span>About Us</span>
                                    </Link>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                        Activity
                                    </h3>
                                    <div className="space-y-1">
                                        <Link
                                            to="/wishlist"
                                            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                                                location.pathname ===
                                                "/wishlist"
                                                    ? "text-[#3E7B27] bg-[#EAF6E7] font-semibold"
                                                    : "text-gray-700 hover:text-[#3E7B27] hover:bg-[#EAF6E7] font-medium"
                                            }`}
                                        >
                                            <FiHeart size={20} />
                                            <span>Wishlist</span>
                                        </Link>
                                        <Link
                                            to="/history"
                                            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                                                location.pathname === "/history"
                                                    ? "text-[#3E7B27] bg-[#EAF6E7] font-semibold"
                                                    : "text-gray-700 hover:text-[#3E7B27] hover:bg-[#EAF6E7] font-medium"
                                            }`}
                                        >
                                            <TbHistoryToggle size={22} />
                                            <span>History</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Account Section - Moved Down */}
                                <div className="border-t border-gray-200 pt-4">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                        Account
                                    </h3>

                                    {/* User Info - Show when authenticated */}
                                    {isAuthenticated && user && (
                                        <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-[#3E7E1F] flex items-center justify-center text-white font-semibold">
                                                    {getInitials(
                                                        user?.displayName || "U"
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {user.displayName}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-1 font-medium">
                                        {isAuthenticated ? (
                                            <>
                                                <Link
                                                    to="/user/profile"
                                                    className="flex items-center space-x-3 p-3 text-gray-700 hover:text-[#3E7B27] hover:bg-[#EAF6E7] rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <FiUser size={20} />
                                                    <span>Profile</span>
                                                </Link>

                                                <button
                                                    onClick={handleLogout}
                                                    disabled={isLoggingOut}
                                                    className="flex items-center space-x-3 p-3 text-gray-700 hover:text-[#3E7B27] hover:bg-[#EAF6E7] rounded-lg transition-colors cursor-pointer w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isLoggingOut ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#3E7B27] border-t-transparent"></div>
                                                            <span>
                                                                Logging out...
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg
                                                                className="w-5 h-5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                                />
                                                            </svg>
                                                            <span>Logout</span>
                                                        </>
                                                    )}
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    to="/sign-in"
                                                    className="flex items-center space-x-3 p-3 text-gray-700 hover:text-[#3E7B27] hover:bg-[#EAF6E7] rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <FiLogIn size={20} />
                                                    <span>Sign In</span>
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
