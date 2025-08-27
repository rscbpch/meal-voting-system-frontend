import { useNavigate } from 'react-router-dom';
import LogoWhite from '../../assets/LogoWhite.svg';

const StaffLogin = () => {
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
                <div className='backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-[#E5E7EB] flex flex-col items-center text-center'>
                    <div className='mb-6'>
                        <h1 className="text-2xl font-extrabold mb-1 title-font">Welcome back</h1>
                        <p className="text-sm">Login as Canteen staff to manage your dashboard</p>
                    </div>
                    <div className='space-y-4 w-full flex flex-col'>
                        <div className="flex flex-col w-full">
                            <label className="text-left mb-1 text-sm font-medium">Email</label>
                            <input 
                                className='w-full h-10 border border-[#E5E7EB] rounded-[10px] placeholder-gray-400 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#429818] transition-all duration-150'
                                type='email'
                                // value={}
                                placeholder='Enter your email'
                                required
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="text-left mb-1 text-sm font-medium">Password</label>
                            <input 
                                className='w-full h-10 border border-[#E5E7EB] rounded-[10px] placeholder-gray-400 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#429818] transition-all duration-150'
                                type='password'
                                // value={}
                                placeholder='Enter your password'
                                required
                            />
                        </div>
                        <div className="flex justify-center w-full">
                            <button
                                onClick={() => navigate('/')}
                                className="cursor-pointer px-6 py-2 rounded-[10px] font-semibold bg-[#429818] text-white hover:bg-[#3E7B27] transition-colors"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default StaffLogin;