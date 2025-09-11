import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-white text-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-[#429818] mb-4">
              <span className="khmer-font">បាយ</span>-Canteen
            </h3>
            <p className="text-[#747474] mb-6 max-w-md">
              Vote daily on your preferred meals and help the canteen prepare exactly what’s in demand —
              fresher, tastier, and waste-free.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#747474] hover:text-gray-700 transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-[#747474] hover:text-gray-700 transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-[#747474] hover:text-gray-700 transition-colors">
                <FaTiktok size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-[#747474] hover:text-[#429818] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-[#747474] hover:text-[#429818] transition-colors">
                  Today's Menu
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-[#747474] hover:text-[#429818] transition-colors">
                  Feedback
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-[#747474] hover:text-[#429818] transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FiMail className="text-[#429818]" size={16} />
                <a href="mailto:mealvoting@gmail.com" className="text-[#747474] hover:text-[#429818] transition-colors">
                  mealvoting@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FiPhone className="text-[#429818]" size={16} />
                <a href="tel:+85512345678" className="text-[#747474] hover:text-[#429818] transition-colors">
                  +855 12 345 678
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FiMapPin className="text-[#429818]" size={16} />
                <span className="text-[#747474]">Phnom Penh, Cambodia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#949494] text-sm">
            &copy; {new Date().getFullYear()} <span className="khmer-font">បាយ</span>-Canteen. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-[#949494] hover:text-[#429818] text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-[#949494] hover:text-[#429818] text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;