import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import WelcomeLogo from '../../assets/WelcomeLogo.png';
import AuthService from '../../services/authService';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token');
            
            console.log('Verification token from URL:', token);
            console.log('Token length:', token?.length);
            
            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link. Please check your email for the correct link.');
                return;
            }

            try {
                setStatus('verifying');
                console.log('Attempting to verify token...');
                
                const result = await AuthService.verifyEmail(token);
                console.log('Verification successful:', result);
                
                setStatus('success');
                setMessage(result.message || 'Email verified successfully! You can now log in to your account.');
                
            } catch (error) {
                console.error('Verification error details:', {
                    message: error.message,
                    error: error
                });
                
                setStatus('error');
                
                const errorMessage = error.message.toLowerCase();
                
                if (errorMessage.includes('verification successful') || 
                    errorMessage.includes('email verified') ||
                    errorMessage.includes('successfully')) {
                    setStatus('success');
                    setMessage('Email verified successfully! You can now log in to your account.');
                } else if (errorMessage.includes('expired')) {
                    setMessage('Your verification link has expired. Please register again or request a new verification email to continue.');
                } else if (errorMessage.includes('invalid') || errorMessage.includes('not found')) {
                    setMessage('This verification link is invalid. Please check your email for the correct link or register again.');
                } else if (errorMessage.includes('already verified') || errorMessage.includes('already been verified')) {
                    setStatus('success'); 
                    setMessage('Your email has already been verified! You can now log in to your account.');
                } else {
                    setMessage('Verification failed. The link may be expired or invalid. Please try registering again.');
                }
            }
        };

        verifyEmail();
    }, [searchParams]);

    const handleGoToLogin = () => {
        navigate('/login');
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const handleRegisterAgain = () => {
        navigate('/register');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center gap-6">
            <img 
                src={WelcomeLogo}
                alt="Welcome Logo"
                className="w-140 object-contain mr-6"
            />
            <div className="w-140 rounded-3xl shadow-md bg-white p-6 flex items-center justify-center">
                <div className="w-full m-10">
                    <div className="text-center">
                        {status === 'verifying' && (
                            <>
                                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#429818] mx-auto mb-6"></div>
                                <h2 className="text-2xl font-bold mb-4 font-title">Verifying Email...</h2>
                                <p className="text-gray-600 text-lg">Please wait while we verify your email address.</p>
                            </>
                        )}
                        {status === 'success' && (
                            <>
                                <h2 className="text-2xl font-bold mb-4 text-green-600 font-title">Email Verified!</h2>
                                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-[10px] text-sm">
                                    {message}
                                </div>
                                <div className="space-y-3">
                                    <button 
                                        onClick={handleGoToLogin}
                                        className="main-button w-full font-title"
                                    >
                                        Go to Login
                                    </button>
                                    <button 
                                        onClick={handleGoHome}
                                        className="w-full py-2 px-4 border border-gray-300 rounded-[10px] text-gray-600 hover:bg-gray-50 transition-colors font-normal"
                                    >
                                        Back to Home
                                    </button>
                                </div>
                            </>
                        )}
                        {status === 'error' && (
                            <>
                                <h2 className="text-2xl font-bold mb-4 text-red-600 font-title">Verification Failed</h2>
                                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-[10px] text-sm">
                                    {message}
                                </div>
                                <div className="space-y-3">
                                    <button 
                                        onClick={handleRegisterAgain}
                                        className="main-button w-full font-title"
                                    >
                                        Register Again
                                    </button>
                                    <button 
                                        onClick={handleGoToLogin}
                                        className="w-full py-2 px-4 border border-gray-300 rounded-[10px] text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Try Login
                                    </button>
                                    <button 
                                        onClick={handleGoHome}
                                        className="w-full py-2 px-4 border border-gray-300 rounded-[10px] text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Back to Home
                                    </button>
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-sm">
                                        Having trouble? You can also{' '}
                                        <span 
                                            onClick={handleGoToLogin}
                                            className="text-[#429818] hover:underline cursor-pointer"
                                        >
                                            try logging in
                                        </span>
                                        {' '}to resend verification email.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;