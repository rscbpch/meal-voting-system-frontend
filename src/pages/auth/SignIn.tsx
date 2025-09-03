import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import LogoWhite from "../../assets/LogoWhite-removebg.svg";
import { useEffect, useState } from "react";
import PageTransition from "../../components/PageTransition";

const SignIn = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string>("");

    // Check for error messages in URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get("error");

        if (errorParam) {
            switch (errorParam) {
                case "auth_failed":
                    setError("Authentication failed. Please try again.");
                    break;
                case "invalid_callback":
                    setError(
                        "Invalid authentication callback. Please try again."
                    );
                    break;
                case "invalid_setup":
                    setError(
                        "Invalid account setup. Please try signing in again."
                    );
                    break;
                default:
                    setError("An error occurred during authentication.");
            }
        }
    }, []);

    return (
        <PageTransition>
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#d9f2e3] via-[#f0fdf4] to-white animate-gradient-move pt-16 pb-16">
                {/* Back Button */}
                <div className="absolute top-2 left-2">
                    <div className="px-10 pt-6">
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center bg-white px-4 py-4 rounded-lg shadow-md text-[#429818] hover:text-[#3E7B27] hover:shadow-lg transition-all duration-200"
                        >
                            <FiArrowLeft
                                className="h-5 w-5"
                                strokeWidth={3}
                            />
                        </button>
                    </div>
                </div>

                {/* Logo */}
                <div className="h-30 w-40">
                    <img
                        src={LogoWhite}
                        alt="Logo"
                        className="h-full w-full object-cover mx-auto"
                    />
                </div>

                {/* Card */}
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-12 py-14 flex flex-col items-center">
                    {/* Welcome Message */}
                    <div className="text-center mb-8">
                        <h2 className="title-font text-2xl font-bold text-gray-800 mb-2">
                            Welcome back
                        </h2>
                        <p className="font-normal text-gray-600">
                            Sign in to vote for your favorite food
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="w-full mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* OAuth Buttons */}
                    <div className="space-y-4 w-full">
                        {/* Google */}
                        <button
                            className="flex items-center justify-center gap-2 rounded-md text-sm font-medium shadow-sm px-4 py-3 w-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                            type="button"
                            onClick={() =>
                                (window.location.href =
                                    "http://localhost:3000/auth/google")
                            }
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="#4285F4"
                                    d="M23.49 12.27c0-.78-.07-1.52-.21-2.27H12v4.3h6.48c-.28 1.48-1.12 2.73-2.38 3.58v2.99h3.84c2.25-2.07 3.55-5.11 3.55-8.6z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.84-2.99c1.07.72-2.44 1.16-4.11 1.16-3.15 0-5.82-2.12-6.77-4.98H1.27v3.13C3.25 21.3 7.31 24 12 24z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.23 14.29c-.25-.72-.39-1.49-.39-2.29s.14-1.57.39-2.29V6.58H1.27A11.94 11.94 0 0 0 0 12c0 1.93.46 3.75 1.27 5.42l3.96-3.13z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 4.77c1.76 0 3.34.61 4.59 1.81l3.42-3.42C17.96 1.01 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.58l3.96 3.13C6.18 6.89 8.85 4.77 12 4.77z"
                                />
                            </svg>
                            Continue with Google
                        </button>

                        {/* Microsoft */}
                        <button
                            className="flex items-center justify-center gap-2 rounded-md text-sm font-medium shadow-sm px-4 py-3 w-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                            type="button"
                            onClick={() =>
                                (window.location.href =
                                    "http://localhost:3000/auth/microsoft")
                            }
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                            >
                                <path fill="#F25022" d="M1 1h10v10H1z" />
                                <path fill="#7FBA00" d="M13 1h10v10H13z" />
                                <path fill="#00A4EF" d="M1 13h10v10H1z" />
                                <path fill="#FFB900" d="M13 13h10v10H13z" />
                            </svg>
                            Continue with Microsoft
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative w-full my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                Or
                            </span>
                        </div>
                    </div>

                    {/* Staff Login */}
                    <p className="text-sm text-gray-600 font-medium">
                        Continue as{" "}
                        <button
                            onClick={() => navigate("/staff-login")}
                            className="text-[#429818] hover:text-[#3E7B27] underline-offset-2 hover:underline transition-all"
                        >
                            Canteen staff
                        </button>
                    </p>
                </div>
            </div>
        </PageTransition>
    );
};

export default SignIn;
