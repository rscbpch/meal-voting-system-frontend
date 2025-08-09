import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeLogo from '../assets/WelcomeLogo.png';
import AuthService from '../services/authService';

const LoginRegisterForm = ({ mode, updateAuthState }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [needsVerification, setNeedsVerification] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const schoolDomain = '@student.cadt.edu.kh';

        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address.';
        }
        
        if (!email.toLowerCase().endsWith(schoolDomain.toLowerCase())) {
            return 'Please use your school email address (@student.cadt.edu.kh).';
        }
        
        return null;
    };

    const validatePassword = (password) => {
        if (password.length < 6) {
            return 'Password must be at least 6 characters long.';
        }
        return null;
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        
        // Clear password mismatch error if passwords now match
        if (password && value && password === value && error.includes('password')) {
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (mode === 'login') {
                if (!email || !password) {
                    setError('Please enter both email and password.');
                    setLoading(false);
                    return;
                }

                const emailError = validateEmail(email);
                if (emailError) {
                    setError(emailError);
                    setLoading(false);
                    return;
                }

                const response = await AuthService.login(email, password);
                setSuccess('Login successful! Redirecting...');

                console.log('LoginForm: Login successful, calling updateAuthState(true)'); // Debug log
                if (updateAuthState) {
                    updateAuthState(true);
                    console.log('LoginForm: updateAuthState called'); // Debug log
                }
                
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                if (!email || !password || !confirmPassword) {
                    setError('Please fill in all required fields.');
                    setLoading(false);
                    return;
                }

                const emailError = validateEmail(email);
                if (emailError) {
                    setError(emailError);
                    setLoading(false);
                    return;
                }

                const passwordError = validatePassword(password);
                if (passwordError) {
                    setError(passwordError);
                    setLoading(false);
                    return;
                }

                if (password !== confirmPassword) {
                    setError('Passwords do not match. Please confirm your password again to match the input password above.');
                    setLoading(false);
                    return;
                }

                const response = await AuthService.register(email, password);
                setSuccess(response.message);
                setNeedsVerification(true);
                
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            console.error('Auth error:', error);
            
            if (error.message.includes('verify your email') || error.message.includes('verification')) {
                setNeedsVerification(true);
            }
            
            setError(error.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await AuthService.resendVerification(email);
            setSuccess('Verification email sent! Please check your inbox.');
        } catch (error) {
            setError(error.message || 'Failed to resend verification email');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleMode = () => {
        setError('');
        setSuccess('');
        setNeedsVerification(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        
        if (mode === 'login') {
            navigate('/register');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center gap-6">
            <img 
                src={WelcomeLogo}
                alt="Welcome Logo"
                className="w-140 object-contain mr-6"
            />
            <div className="w-140 rounded-3xl shadow-md bg-white p-6 flex items-center justify-center">
                <form onSubmit={handleSubmit} className="w-full m-10">
                    <h2 className="justify-center flex font-bold text-2xl font-title">
                        {mode === 'login' ? 'Log In' : 'Sign Up'}
                    </h2>

                    {error && (
                        <div className="my-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-[10px] text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="my-2 p-3 bg-green-100 border border-green-400 text-green-700 rounded-[10px] text-sm">
                            {success}
                        </div>
                    )}

                    {needsVerification && (
                        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-[10px] text-sm">
                            <p>Please check your email to verify your account.</p>
                            <button
                                type="button"
                                onClick={handleResendVerification}
                                disabled={loading}
                                className="mt-2 text-blue-600 hover:text-blue-800 underline text-sm"
                            >
                                Resend verification email
                            </button>
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="font-normal">Email</label> <br />
                        <input 
                            className="w-full h-8 p-1 border rounded-[10px] placeholder-gray-400 px-2.5 text-sm font-normal"
                            type="email"
                            value={email}
                            placeholder="Your school email"
                            required
                            disabled={loading}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label className="font-normal">Password</label><br />
                        <input
                            className="w-full h-8 p-1 border rounded-[10px] placeholder-gray-400 px-2.5 text-sm font-normal"
                            type="password" 
                            value={password}
                            placeholder="Your password"
                            required
                            disabled={loading}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {mode === 'login' && (
                            <div className="mt-1 text-right">
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        alert('Redirect to forgot password page or open modal');
                                    }}
                                    className="text-sm text-gray-600 hover:underline cursor-pointer font-normal"
                                >
                                    Forgot Password?
                                </a>
                            </div>
                        )}
                    </div>
                    
                    {mode === 'register' && (
                        <div className="mb-3">
                            <label className="font-normal">Confirm Password</label>
                            <input 
                                className="w-full h-8 p-1 border rounded-[10px] placeholder-gray-400 px-2.5 text-sm font-normal"
                                type="password"
                                value={confirmPassword}
                                placeholder="Confirm Password"
                                required
                                disabled={loading}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    )}
                    
                    <div className="flex justify-center mt-8">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="main-button font-title disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Register')}
                        </button>
                    </div>
                    
                    <div className="text-center mt-5 font-normal">
                        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                        <a 
                            className="main-text-w-hover mx-1 hover:underline"
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleToggleMode();
                            }}
                        >
                            {mode === 'login' ? 'Sign Up' : 'Log In'}
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginRegisterForm;