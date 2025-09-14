import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LogoWhite from "../../assets/LogoWhite-removebg.svg";
import API from "../../services/axios";
import PageTransition from "../../components/PageTransition";
import Loading from "../../components/Loading";
import { useAuth } from "../../context/AuthContext";

const SetupAccount = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [generation, setGeneration] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [showCloseButtons, setShowCloseButtons] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
                setFocusedIndex(-1);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isDropdownOpen) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                setIsDropdownOpen(true);
                setFocusedIndex(0);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setFocusedIndex(prev => 
                    prev < generationOptions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedIndex(prev => 
                    prev > 0 ? prev - 1 : generationOptions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (focusedIndex >= 0 && focusedIndex < generationOptions.length) {
                    const selectedGen = generationOptions[focusedIndex];
                    setGeneration(selectedGen.generation.toString());
                    setIsDropdownOpen(false);
                    setFocusedIndex(-1);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsDropdownOpen(false);
                setFocusedIndex(-1);
                break;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate that generation is selected for Complete Setup
        if (!generation) {
            setError("Please select your generation or click 'Skip for Now' to continue without selecting a generation.");
            return;
        }

        setLoading(true);
        setShowCloseButtons(false);
        setError(null);

        // Show close buttons after 3 seconds
        setTimeout(() => {
            setShowCloseButtons(true);
        }, 3000);

        try {
            await API.post("/auth/setup-graduation", {skip: true});

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
            setShowCloseButtons(false);
        }
    };

    const handleSkip = async () => {
        setLoading(true);
        setShowCloseButtons(false);
        setError(null);

        // Show close buttons after 3 seconds
        setTimeout(() => {
            setShowCloseButtons(true);
        }, 3000);

        try {
            // Skip generation selection
            await API.post("/auth/setup-graduation", {});

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
            setShowCloseButtons(false);
        }
    };

    // Calculate generation options based on backend logic
    // Backend: const calculateGraduationDate = (generationNumber: number): Date => {
    //   const graduationYear = generationNumber + 2017;
    //   return new Date(graduationYear, 11, 1); // December 1st
    // };
    
    const currentYear = new Date().getFullYear();
    
    // Calculate which generations are currently studying
    // Always maintain exactly 4 generations in the dropdown
    const getCurrentStudyingGenerations = () => {
        const generations = [];
        
        // Calculate the current graduating generation
        const graduatingGen = currentYear - 2017;
        
        // Always show exactly 4 generations: graduating + 3 more
        // This ensures we always have 4 generations in the dropdown
        for (let i = 0; i < 4; i++) {
            const gen = graduatingGen + i;
            const graduationYear = gen + 2017;
            
            // Only include if the generation has started studying (graduation year >= current year)
            if (graduationYear >= currentYear) {
                generations.push({
                    generation: gen
                });
            }
        }
        
        return generations;
    };

    const generationOptions = getCurrentStudyingGenerations();

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
                <div className="w-[calc(100%-2rem)] max-w-md bg-white rounded-2xl shadow-xl px-6 sm:px-12 py-14 flex flex-col items-center sm:w-full sm:mx-0">
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
                                Generation <span className="text-gray-500 text-xs">(Optional)</span>
                            </label>
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    onKeyDown={handleKeyDown}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#429818] focus:border-[#429818] bg-white text-left flex justify-between items-center transition-all duration-200 hover:border-[#429818] hover:shadow-md"
                                >
                                    <span className={generation ? "text-gray-900" : "text-gray-500"}>
                                        {generation 
                                            ? `Generation ${generation}` 
                                            : "Select your generation"
                                        }
                                    </span>
                                    <svg
                                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                                            isDropdownOpen ? "rotate-180" : ""
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                                
                                {isDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto animate-dropdown-enter">
                                        {generationOptions.map((item, index) => (
                                            <button
                                                key={item.generation}
                                                type="button"
                                                onClick={() => {
                                                    setGeneration(item.generation.toString());
                                                    setIsDropdownOpen(false);
                                                    setFocusedIndex(-1);
                                                }}
                                                className={`w-full px-3 py-2 text-left transition-colors duration-150 first:rounded-t-md last:rounded-b-md focus:outline-none ${
                                                    index === focusedIndex 
                                                        ? "bg-[#429818] text-white" 
                                                        : "hover:bg-[#429818] hover:text-white"
                                                }`}
                                            >
                                                <span className="font-medium">
                                                    Generation {item.generation}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#429818] text-white py-2 px-4 rounded-md hover:bg-[#3E7B27] focus:outline-none focus:ring-2 focus:ring-[#429818] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Complete Setup
                            </button>
                            
                            <button
                                type="button"
                                onClick={handleSkip}
                                disabled={loading}
                                className="w-full text-[#429818] py-2 px-4 rounded-md hover:text-[#3E7B27] focus:outline-none focus:ring-2 focus:ring-[#429818] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Skip for Now
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Loading Popup */}
            {loading && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-12 flex flex-col items-center space-y-8 min-w-[300px] relative">
                        {/* Cross Button - Only show when not actively loading */}
                        {showCloseButtons && (
                            <button
                                onClick={() => {
                                    setLoading(false);
                                    setShowCloseButtons(false);
                                }}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}

                        <Loading size={80} />
                        <p className="text-gray-700 font-medium text-lg">Setting up your account...</p>

                        {/* Cancel Button - Only show when not actively loading */}
                        {showCloseButtons && (
                            <button
                                onClick={() => {
                                    setLoading(false);
                                    setShowCloseButtons(false);
                                }}
                                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            )}
        </PageTransition>
    );
};

export default SetupAccount;
