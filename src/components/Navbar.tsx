import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FiUser, FiRotateCw, FiLogOut, FiGlobe, FiHeart, FiChevronDown} from "react-icons/fi";
import LogoWhite from "../assets/LogoWhite.svg";

const Navbar = () => {
    const navigate = useNavigate();
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const dropdownRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowUserDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="sticky top-0 z-50 max-w-full h-16 p-6 flex items-center shadow-md bg-white">
            <div className="flex-1 flex items-center">
                <img src={LogoWhite} alt="Logo" className="h-16" />
            </div>
            <div className="flex-2 flex items-center justify-center">
                <ul className="flex list-none space-x-6">
                    <li onClick={() => navigate("/")} className="cursor-pointer text-[#757575] font-semibold hover:text-[#429818]">Home</li>
                    <li onClick={() => navigate("/menu")} className="cursor-pointer text-[#757575] font-semibold hover:text-[#429818]">Menu</li>
                    <li onClick={() => navigate("/feedback")} className="cursor-pointer text-[#757575] font-semibold hover:text-[#429818]">Feedback</li>
                    <li onClick={() => navigate("/about-us")} className="cursor-pointer text-[#757575] font-semibold hover:text-[#429818]">About Us</li>
                </ul>
            </div>
            <div className="flex-1 flex items-center justify-end">
                {true ? (
                    // <div className="flex space-x-4">
                    //     <button
                    //         onClick={() => navigate('/login')}
                    //         className="cursor-pointer px-6 py-2 rounded-[10px] font-semibold border-2 border-[#429818] text-[#429818] hover:border-[#3E7B27] hover:text-[#3E7B27] transition-colors"
                    //     >
                    //         Login
                    //     </button>
                    //     <button
                    //         onClick={() => navigate('/register')}
                    //         className="cursor-pointer px-6 py-2 rounded-[10px] font-semibold bg-[#429818] text-white hover:bg-[#3E7B27] transition-colors"
                    //     >
                    //         Register
                    //     </button>
                    // </div>
                    <div>
                        <button
                            onClick={() => navigate('/sign-in')}
                            className="cursor-pointer px-6 py-2 rounded-[10px] font-semibold bg-[#429818] text-white hover:bg-[#3E7B27] transition-colors"
                        >
                            Sign In
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center space-x-4">
                        <button className="cursor-pointer bg-[#F0F0F0] p-2 rounded-full transition-colors group hover:bg-[#DDF4E7]">
                            {/* <svg width="17" height="17" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M15.5 4.54545C15.5 2.58758 13.8674 1 11.8546 1C10.3488 1 9.05611 1.88715 8.5 3.15327C7.94389 1.88715 6.65122 1 5.14622 1C3.13178 1 1.5 2.58758 1.5 4.54545C1.5 10.2339 8.5 14 8.5 14C8.5 14 15.5 10.2339 15.5 4.54545Z"
                                    stroke="#3A4038"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-colors group-hover:stroke-[#386641]"
                                />
                            </svg> */}
                            <FiHeart className="transition-colors group-hover:stroke-[#386641]" />
                        </button>
                        <button className="cursor-pointer bg-[#F0F0F0] p-2 rounded-full transition-colors group hover:bg-[#DDF4E7]">
                            {/* <svg width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path 
                                    d="M17.7084 10.5C17.7084 8.45561 16.8963 6.49497 15.4507 5.04938C14.0051 3.60378 12.0445 2.79166 10.0001 2.79166M17.7084 10.5H2.29175M17.7084 10.5C17.7084 12.5444 16.8963 14.505 15.4507 15.9506C14.0051 17.3962 12.0445 18.2083 10.0001 18.2083M10.0001 2.79166C7.9557 2.79166 5.99506 3.60378 4.54947 5.04938C3.10387 6.49497 2.29175 8.45561 2.29175 10.5M10.0001 2.79166C9.58341 2.79166 6.66675 6.24249 6.66675 10.5C6.66675 14.7575 9.58341 18.2083 10.0001 18.2083M10.0001 2.79166C10.4167 2.79166 13.3334 6.24249 13.3334 10.5C13.3334 14.7575 10.4167 18.2083 10.0001 18.2083M2.29175 10.5C2.29175 12.5444 3.10387 14.505 4.54947 15.9506C5.99506 17.3962 7.9557 18.2083 10.0001 18.2083" 
                                    stroke="#3A4038"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-colors group-hover:stroke-[#386641]"
                                />
                            </svg> */}
                            <FiGlobe className="transition-colors group-hover:stroke-[#386641]" />
                        </button>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-[#3E7E1F] flex items-center justify-center text-white font-semibold text-lg">U</div>
                            <div className="relative flex items-center">
                                <button ref={dropdownRef} onClick={() => setShowUserDropdown((prev) => !prev)} className="cursor-pointer flex items-center justify-center h-8">
                                    <FiChevronDown className="align-middle" />
                                </button>
                                {showUserDropdown && (
                                    <div className="absolute right-0 top-8 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden">
                                        <div className="flex flex-col divide-y divide-gray-100">
                                            <button
                                                onClick={() => {
                                                    navigate('/profile');
                                                    setShowUserDropdown(false);
                                                }}
                                                className="flex items-center gap-3 px-5 py-3 text-[#222] hover:bg-[#F7F7F7] transition-colors text-base font-medium focus:outline-none"
                                            >
                                                <span className="bg-[#EAF6E7] p-2 rounded-full"><FiUser size={18} className="text-[#429818]" /></span>
                                                <span>Profile</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    navigate('/profile');
                                                    setShowUserDropdown(false);
                                                }}
                                                className="flex items-center gap-3 px-5 py-3 text-[#222] hover:bg-[#F7F7F7] transition-colors text-base font-medium focus:outline-none"
                                            >
                                                <span className="bg-[#EAF6E7] p-2 rounded-full"><FiRotateCw size={18} className="text-[#429818]" /></span>
                                                <span>History</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    navigate('/profile');
                                                    setShowUserDropdown(false);
                                                }}
                                                className="flex items-center gap-3 px-5 py-3 text-[#D32F2F] hover:bg-[#FFF0F0] transition-colors text-base font-medium focus:outline-none"
                                            >
                                                <span className="bg-[#FDEAEA] p-2 rounded-full"><FiLogOut size={18} className="text-[#D32F2F]" /></span>
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;