import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    handleGoogleLogin,
    handleMicrosoftLogin,
} from "../../services/authService";
import LogoWhite from "../../assets/LogoWhite-removebg.svg";
import PageTransition from "../../components/PageTransition";

const Callback = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState<string>(
        "Processing authentication..."
    );
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const provider = urlParams.get("provider");

        console.log("Callback received:", {
            token: token ? "present" : "missing",
            provider,
        });

        if (token && provider) {
            const handleLogin = async () => {
                try {
                    setStatus(`Completing ${provider} login...`);
                    console.log("Starting login process for:", provider);

                    let user;
                    if (provider === "google") {
                        user = await handleGoogleLogin(token);
                    } else if (provider === "microsoft") {
                        user = await handleMicrosoftLogin(token);
                    }

                    if (user) {
                        console.log("Login successful, user:", user);
                        setStatus("Login successful! Redirecting...");
                        setTimeout(() => navigate("/"), 1000); // Small delay to show success
                    } else {
                        throw new Error("No user data received");
                    }
                } catch (err: any) {
                    console.error(`${provider} login failed:`, err);
                    setError(err.message || "Authentication failed");
                    setStatus("Login failed");

                    // Wait a bit before redirecting to show the error
                    setTimeout(() => {
                        navigate("/sign-in?error=auth_failed");
                    }, 2000);
                }
            };

            handleLogin();
        } else {
            console.error("Missing token or provider:", {
                token: !!token,
                provider,
            });
            setError("Invalid callback parameters");
            setStatus("Invalid callback");
            setTimeout(() => {
                navigate("/sign-in?error=invalid_callback");
            }, 2000);
        }
    }, [navigate]);

    return (
        <PageTransition>
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#d9f2e3] via-[#f0fdf4] to-white animate-gradient-move">
                {/* Logo */}
                <div className="h-30 w-40 mb-8">
                    <img
                        src={LogoWhite}
                        alt="Logo"
                        className="h-full w-full object-cover mx-auto"
                    />
                </div>

                {/* Status Card */}
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-12 py-14 flex flex-col items-center">
                    <div className="text-center">
                        {!error ? (
                            <>
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#429818] mx-auto mb-4"></div>
                                <h2 className="title-font text-xl font-bold text-gray-800 mb-2">
                                    Completing Sign In
                                </h2>
                                <p className="font-normal text-gray-600">
                                    {status}
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="rounded-full h-12 w-12 border-2 border-red-500 mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-red-500 text-2xl">
                                        ✕
                                    </span>
                                </div>
                                <h2 className="title-font text-xl font-bold text-red-600 mb-2">
                                    Authentication Failed
                                </h2>
                                <p className="font-normal text-red-600">
                                    {error}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Callback;
