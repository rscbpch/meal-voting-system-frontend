
import { useNavigate } from 'react-router-dom';
import LogoWhite from '../../assets/LogoWhite.svg';

const SignIn = () => {
    const navigate = useNavigate();
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <span
                className="fixed top-6 left-6 cursor-pointer text-[#757575] font-semibold hover:text-[#429818] z-50"
                onClick={() => navigate("/")}
            >
                Back to home
            </span>
            <div className="relative w-full max-w-md px-6 py-12">
                <div className="flex justify-center">
                    <img src={LogoWhite} alt="Logo" className="h-36" />
                </div>
                <div className="backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-[#E5E7EB] flex flex-col items-center text-center">
                    <div className='mb-6'>
                        <h1 className="text-2xl font-extrabold mb-1 title-font">Welcome back</h1>
                        <p className="text-sm">Sign in to vote for you favorite food</p>
                    </div>
                    <div className="space-y-3 w-full flex flex-col items-center">
                        <button 
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-sm px-4 py-2 w-full font-medium border h-11 transition-colors duration-200 border-[#E5E7EB] bg-white hover:bg-[#F5F5F5]" 
                            type="button"
                        >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M23.49 12.27c0-.78-.07-1.52-.21-2.27H12v4.3h6.48c-.28 1.48-1.12 2.73-2.38 3.58v2.99h3.84c2.25-2.07 3.55-5.11 3.55-8.6z"/>
                                    <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.84-2.99c-1.07.72-2.44 1.16-4.11 1.16-3.15 0-5.82-2.12-6.77-4.98H1.27v3.13C3.25 21.3 7.31 24 12 24z"/>
                                    <path fill="#FBBC05" d="M5.23 14.29c-.25-.72-.39-1.49-.39-2.29s.14-1.57.39-2.29V6.58H1.27A11.94 11.94 0 0 0 0 12c0 1.93.46 3.75 1.27 5.42l3.96-3.13z"/>
                                    <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.81l3.42-3.42C17.96 1.01 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.58l3.96 3.13C6.18 6.89 8.85 4.77 12 4.77z"/>
                                </svg>
                                Continue with Google
                        </button>
                        <button 
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-sm px-4 py-2 w-full font-medium border h-11 transition-colors duration-200 border-[#E5E7EB] bg-white hover:bg-[#F5F5F5]" 
                            type="button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="#F25022" d="M1 1h10v10H1z"/>
                                <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                                <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                                <path fill="#FFB900" d="M13 13h10v10H13z"/>
                            </svg>
                            Continue with Microsoft
                        </button>
                    </div>
                    <div className="flex items-center w-full my-6">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-sm text-gray-500 bg-white px-2">Or</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <p>
                        Continue as <a href="/staff-login" className="text-[#429818] hover:text-[#386641] no-underline hover:underline hover:decoration-[0.5px] underline-offset-2 transition-all duration-150">Canteen staff</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignIn;