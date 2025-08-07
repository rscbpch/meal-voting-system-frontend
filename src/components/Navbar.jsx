import { useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import LogoWhite from "../assets/LogoWhite.png"
// import { FaUser } from "react-icons/fa";

const Navbar = ({ isAuthenticated = false }) => {
    const navigate = useNavigate();

    if (!isAuthenticated) {
        return (
            <div className="max-w-full h-16 p-6 flex items-center justify-between">
                <div>
                    <img src={LogoWhite} alt="Logo" className="h-16" />
                </div>
                <div className="flex space-x-4">
                    <button 
                        onClick={() => navigate('/login')} 
                        className="px-6 py-2 text-[#429818] border border-[#429818] rounded-full hover:bg-[#429818] hover:text-white transition-colors font-semibold"
                    >
                        Login
                    </button>
                    <button 
                        onClick={() => navigate('/register')} 
                        className="px-6 py-2 bg-[#429818] text-white rounded-full hover:bg-[#386641] transition-colors font-semibold"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-full h-16 p-6 flex items-center justify-between">
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
            <div>
                <FiUser size={24} className="cursor-pointer text-[#429818] hover:text-[#386641]"/>
                {/* <FaUser size={24} className="cursor-pointer text-[#429818] hover:text-[#386641]"/> */}
            </div>
        </div>
    );
};

export default Navbar;