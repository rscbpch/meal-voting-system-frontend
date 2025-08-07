import React from "react";
import { useState } from "react";
import WelcomeLogo from '../assets/WelcomeLogo.png';
const LoginRegisterForm = ({ mode }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (mode === 'login') {
            alert('Loging in with email');
        } else {
            if (password !== confirmPassword) {
                alert('Password does not match');
                return;
            }
            alert ('Registering with email');
        }

        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center gap-6">
            <img 
                src={WelcomeLogo}
                alt="Welcome Logo"
                className="w-140 object-contain mr-6"
            />
            <div className="w-140 h-120 rounded-3xl shadow-md bg-white p-6 flex items-center justify-center">
                <form onSubmit={handleSubmit} className="w-full m-10">
                    <h2 className="justify-center flex font-bold text-2xl">
                        {mode === 'login' ? 'Log In' : 'Register'}
                    </h2>
                    <div style={{ marginBottom: '1rem' }}>
                    <label>Email</label> <br />
                    <input 
                        className="w-full p-1 border rounded-2xl placeholder-gray-400"
                        type="email"
                        value={email}
                        placeholder="Your school email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>
                    <div style={{ marginBottom: '1rem'}}>
                        <label>Password</label><br />
                        <input
                            className="w-full p-1 border rounded-2xl placeholder-gray-400"
                            type="password" 
                            value={password}
                            placeholder="Your password"
                            required
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
                                    className="text-sm text-gray-600 hover:underline cursor-pointer"
                                >
                                    Forgot Password?
                                </a>
                            </div>
                        )}
                    </div>
                    { mode === 'register' && (
                            <div style={{ marginBottom: '1rem'}}>
                                <label>Confirm Password</label>
                                <input 
                                    className="w-full p-1 border rounded-2xl placeholder-gray-400"
                                    type="password"
                                    value={confirmPassword}
                                    placeholder="Confirm Password"
                                    required
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                    )}
                    <div className="flex justify-center mt-8">
                        <button className="bg-[#386641] text-white rounded-2xl p-1 w-25">
                            { mode === 'login' ? 'Login' : 'Register'}
                        </button>
                    </div>
                    <div className="text-center mt-5">
                        { mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                        <a 
                            className="text-[#386641] mx-1 hover:underline cursor-pointer"
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                alert('ot dg dak ey');
                            }}
                        >
                            { mode === 'login' ? 'Sign Up' : 'Log In'}
                        </a>
                    </div>

                </form>
            </div>
        </div>
    )
}
export default LoginRegisterForm;
