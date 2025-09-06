import { FaFacebookF, FaInstagramSquare, FaTiktok } from "react-icons/fa";
import { FiMail, FiPhone, } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";

const Footer = () => {
    return (
        <footer className="w-full bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 text-[12px] md:text-sm">
                <div className="md:hidden text-center">
                    <p className="text-2xl font-extrabold text-[#429818] mb-2"><span className="khmer-font">បាយ</span>-Canteen</p>
                    <nav className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-[12px] leading-none mb-6 text-[#949494]">
                        <a href="/" className="px-1">Home</a>
                        <span className="text-gray-300">|</span>
                        <a href="/menu" className="px-1">Today's menu</a>
                        <span className="text-gray-300">|</span>
                        <a href="/feedback" className="px-1">Feedback</a>
                        <span className="text-gray-300">|</span>
                        <a href="/about-us" className="px-1">About us</a>
                        <span className="text-gray-300">|</span>
                        <a href="mailto:mealvoting@gmail.com" className="px-1">mealvoting@gmail.com</a>
                        <span className="text-gray-300">|</span>
                        <a href="tel:+85512345678" className="px-1">+855 12 345 678</a>
                    </nav>
                    <div className="text-[16px] flex justify-center gap-3 mb-3 text-[#797979]">
                        <a href="#" aria-label="facebook" className="hover:text-gray-600"><FaFacebookF /></a>
                        <a href="#" aria-label="instagram" className="hover:text-gray-600"><FaInstagramSquare /></a>
                        <a href="#" aria-label="tiktok" className="hover:text-gray-600"><FaTiktok /></a>
                    </div>
                </div>

                <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
                    <div className="md:col-span-2">
                        <p className="text-2xl font-extrabold text-[#429818] mb-2"><span className="khmer-font">បាយ</span>-Canteen</p>
                        <p className="w-full lg:max-w-md">Vote daily on your preferred meals and help the canteen prepare exactly what’s in demand; fresher, tastier, and waste-free.</p>
                        <div className="mt-4 flex items-center gap-3 text-[#747474]">
                            <a href="#" aria-label="facebook" className="hover:text-gray-700"><FaFacebookF /></a>
                            <a href="#" aria-label="instagram" className="hover:text-gray-700"><FaInstagramSquare /></a>
                            <a href="#" aria-label="tiktok" className="hover:text-gray-700"><FaTiktok /></a>
                        </div>
                    </div>
                    <div>
                        <p className="text-lg font-semibold mb-4">Quick Link</p>
                        <ul className="space-y-1">
                            <li><a href="/" className="hover:text-gray-900 hover:underline transition">Home</a></li>
                            <li><a href="/menu" className="hover:text-gray-900 hover:underline transition">Today's menu</a></li>
                            <li><a href="/feedback" className="hover:text-gray-900 hover:underline transition">Feedback</a></li>
                            <li><a href="about-us" className="hover:text-gray-900 hover:underline transition">About us</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-lg font-semibold mb-4">Contact info</p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3">
                                <FiMail />
                                <a href="mailto:mealvoting@gmail.com" className="hover:text-gray-900 hover:underline transition">mealvoting@gmail.com</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <FiPhone />
                                <a href="tel:+85512345678" className="hover:text-gray-900 hover:underline transition">+855 12 345 678</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <GrLocation />
                                <span>Phnom Penh, Cambodia</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <hr className="my-6 border-t border-gray-200 hidden md:block" />
                <div className="flex flex-col leading-none text-[10px] md:flex-row md:text-sm items-center justify-between text-[#949494] gap-1">
                    <div className="text-center md:text-left">© 2025 <span className="khmer-font">បាយ</span>-Canteen. All rights reserved</div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-gray-700 hover:underline transition">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-700 hover:underline transition">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;