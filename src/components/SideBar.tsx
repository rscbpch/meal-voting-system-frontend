import { HomeIcon } from "@heroicons/react/24/outline";
import { FiLogOut } from "react-icons/fi";
import LogoWhite from "../assets/LogoWhite-removebg.svg";
import { useAuth } from "../context/AuthContext";
import { HiMenuAlt2 } from "react-icons/hi";
import { PiBowlFood } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

import { useState } from "react";

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const getInitials = (name?: string): string => {
        if (!name) return "U"; // fallback if no name

        const parts = name.trim().split(" ");
        let initials = parts[0].charAt(0).toUpperCase();

        if (parts.length > 1) {
            initials += parts[parts.length - 1].charAt(0).toUpperCase();
        }

        return initials;
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);

        // small delay to show spinner (optional)
        await new Promise((res) => setTimeout(res, 300));

        logout(); // clears user
        navigate("/");
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 h-screen fixed top-0 left-0 bg-white shadow-md flex flex-colw-64 bg-white shadow-md flex flex-col">
                {/* Header */}
                <div>
                    <div className="relative">
                        <div className="w-full flex items-center justify-between px-3 h-20">
                            <div className="flex items-center gap-3">
                                <div className="h-24 w-24">
                                    <img
                                        src={LogoWhite}
                                        alt="Logo"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                {/* <span className="font-medium"><span className="khmer-font">បាយ</span>-Canteen</span> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto font-medium flex flex-col">
                    <div className="flex flex-col gap-y-2 p-4 pt-2">
                        <a
                            href="/dashboard"
                            className={` relative flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 transition-all
                              ${
                                  location.pathname === "/dashboard"
                                      ? "bg-[#F0FFD8] pl-6" // padding-left adjusted for the border
                                      : "hover:bg-[#F6FFE8]"
                              }`}
                        >
                            {/* Left border with lighter shadow */}
                            {location.pathname === "/dashboard" && (
                                <span className="absolute left-0 top-0 h-full w-1 bg-[#429818] shadow-[1px_0_4px_rgba(62,123,39,0.2)] rounded-tr-md rounded-br-md"></span>
                            )}
                            <HomeIcon className="w-5 h-5 z-10" />
                            Dashboard
                        </a>
                        <a
                            href="/menu-management"
                            className={` relative flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 transition-all
                              ${
                                  location.pathname === "/menu-management"
                                      ? "bg-[#F0FFD8] pl-6" // padding-left adjusted for the border
                                      : "hover:bg-[#F6FFE8]"
                              }`}
                        >
                            {/* Left border with lighter shadow */}
                            {location.pathname === "/menu-management" && (
                                <span className="absolute left-0 top-0 h-full w-1 bg-[#429818] shadow-[1px_0_4px_rgba(62,123,39,0.2)] rounded-tr-md rounded-br-md"></span>
                            )}
                            <HiMenuAlt2 className="w-5 h-5 z-10" />
                            Menu Management
                        </a>
                        <a
                            href="/food"
                            className={` relative flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 transition-all
                              ${
                                  location.pathname === "/food"
                                      ? "bg-[#F0FFD8] pl-6" // padding-left adjusted for the border
                                      : "hover:bg-[#F6FFE8]"
                              }`}
                        >
                            {/* Left border with lighter shadow */}
                            {location.pathname === "/food" && (
                                <span className="absolute left-0 top-0 h-full w-1 bg-[#429818] shadow-[1px_0_4px_rgba(62,123,39,0.2)] rounded-tr-md rounded-br-md"></span>
                            )}
                            <PiBowlFood className="w-5 h-5 z-10" />
                            Food For Voters
                        </a>
                    </div>
                    <div className="mt-6 border-t border-gray-200  p-4 pt-2">
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="relative w-full flex items-center gap-2 px-3 py-2 rounded-md text-[#D32F2F] hover:bg-[#FFF0F0] text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoggingOut ? (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                                    <span>Signing out...</span>
                                </div>
                            ) : (
                                <>
                                    <FiLogOut
                                        size={18}
                                        className="text-[#D32F2F]"
                                    />
                                    <span>Logout</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                    <div className="relative">
                        <div className="w-full flex items-center justify-between px-3 py-2 rounded-md">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-[#3E7E1F] flex items-center justify-center text-white font-semibold text-lg">
                                    {getInitials(user?.displayName || "U")}
                                </div>
                                <div>
                                    <p className="text-md font-medium">
                                        {user?.displayName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;
