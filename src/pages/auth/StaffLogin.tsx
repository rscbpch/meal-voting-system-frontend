import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LogoWhite from "../../assets/LogoWhite-removebg.svg";
import { FiMail, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import PageTransition from "../../components/PageTransition";
import type { StaffLoginData } from "../../services/authService";
import { login } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const StaffLogin = () => {
    const navigate = useNavigate();
    const { login: loginToContext } = useAuth();
    const [formData, setFormData] = useState<StaffLoginData>({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(""); // clear error while typing
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.email.trim() || !formData.password.trim()) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const loggedInUser = await login(formData); // call API
            const token = localStorage.getItem("token") || "";
            // Update context to refresh UI immediately
            loginToContext(loggedInUser, token, loggedInUser?.role);
            navigate("/dashboard"); // redirect after login
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#d9f2e3] via-[#f0fdf4] to-white animate-gradient-move pt-16 pb-16">
                {/* Back Button */}
                <div className="absolute top-2 left-2 px-10 pt-6">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center bg-white px-4 py-4 rounded-lg shadow-md text-[#429818] hover:text-[#3E7B27] hover:shadow-lg transition-all duration-200"
                    >
                        <FiArrowLeft className="h-5 w-5" strokeWidth={3} />
                    </button>
                </div>

                {/* Logo */}
                <div className="h-30 w-40">
                    <img
                        src={LogoWhite}
                        alt="Logo"
                        className="h-full w-full object-cover mx-auto"
                    />
                </div>

                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-12 py-14 flex flex-col items-center">
                    <div className="text-center mb-8">
                        <h2 className="title-font text-2xl font-bold text-gray-800 mb-2">
                            Welcome back
                        </h2>
                        <p className="font-normal text-gray-600">
                            Login as Canteen staff to manage your dashboard
                        </p>
                    </div>

                    {/* Login Form */}
                    <form className="w-full space-y-6" onSubmit={handleSubmit}>
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email address
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    onChange={handleChange}
                                    value={formData.email}
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#429818] focus:border-[#429818] sm:text-sm"
                                    placeholder="Enter your email"
                                />
                                <FiMail className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    onChange={handleChange}
                                    value={formData.password}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#429818] focus:border-[#429818] sm:text-sm"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <FiEyeOff className="h-4 w-4" />
                                    ) : (
                                        <FiEye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#429818] hover:bg-[#3E7B27] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </PageTransition>
    );
};

export default StaffLogin;