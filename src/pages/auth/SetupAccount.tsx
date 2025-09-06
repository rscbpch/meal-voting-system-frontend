import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoWhite from "../../assets/LogoWhite-removebg.svg";
import API from "../../services/axios";
import PageTransition from "../../components/PageTransition";
import { useAuth } from "../../context/AuthContext";

const SetupAccount = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [generation, setGeneration] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if we have the required parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const needsGraduation = urlParams.get("needs_graduation");
        const provider = urlParams.get("provider");

        if (!token || needsGraduation !== "true" || !provider) {
            navigate("/sign-in?error=invalid_setup");
            return;
        }

        // Set the token in localStorage
        localStorage.setItem("token", token);
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!generation) {
            setError("Please select your generation");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await API.post("/auth/setup-graduation", {
                generation: parseInt(generation),
            });

            // Fetch user profile to get role and update auth context immediately
            const response = await API.get("/user/profile");
            const user = response.data.data.user;

            if (user?.role) {
                localStorage.setItem("userRole", user.role);
            }

            const token = localStorage.getItem("token") || "";
            try {
                login(user, token, user?.role);
            } catch {}

            navigate("/");
        } catch (err: any) {
            console.error("Setup error:", err);
            setError(
                err.response?.data?.error ||
                    "Failed to setup account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // const generationOptions = Array.from({ length: 13 }, (_, i) => i + 8); // Generations 8-20
    const startYear = 2015; // Gen 1 starts in 2017
    const currentYear = new Date().getFullYear(); // e.g., 2025

    // Calculate total generations from start to current year
    const totalGenerations = currentYear - startYear + 1;

    const generationOptions = Array.from(
        { length: totalGenerations },
        (_, i) => {
            return {
                generation: i + 1, // Gen 1, 2, 3, ...
            };
        }
    );

    return (
        <PageTransition>
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#d9f2e3] via-[#f0fdf4] to-white animate-gradient-move pt-16 pb-16">
                {/* Logo */}
                <div className="h-30 w-40 mb-8">
                    <img
                        src={LogoWhite}
                        alt="Logo"
                        className="h-full w-full object-cover mx-auto"
                    />
                </div>

                {/* Setup Card */}
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-12 py-14 flex flex-col items-center">
                    <div className="text-center mb-8">
                        <h2 className="title-font text-2xl font-bold text-gray-800 mb-2">
                            Complete Your Profile
                        </h2>
                        <p className="font-normal text-gray-600">
                            Please provide your generation to complete the setup
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="w-full mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="mb-6">
                            <label
                                htmlFor="generation"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Generation
                            </label>
                            <select
                                id="generation"
                                value={generation}
                                onChange={(e) => setGeneration(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#429818] focus:border-[#429818]"
                                required
                            >
                                <option value="">Select your generation</option>
                                {generationOptions.map((item) => (
                                    <option
                                        key={item.generation}
                                        value={item.generation}
                                    >
                                        Generation {item.generation}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#429818] text-white py-2 px-4 rounded-md hover:bg-[#3E7B27] focus:outline-none focus:ring-2 focus:ring-[#429818] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? "Setting up..." : "Complete Setup"}
                        </button>
                    </form>
                </div>
            </div>
        </PageTransition>
    );
};

export default SetupAccount;
