import React from "react";
import { useState } from "react";


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
    };
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-lg h-[500px] w-full mx-auto p-6 rounded shadow-md bg-white flex items-center justify-center">
                <form onSubmit={handleSubmit} className="w-full">
                    <h2 className="justify-center flex font-bold text-2xl">Login</h2>
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
                    </div>
                    <div className="flex justify-center mt-2">
                        <button className="bg-[#386641] text-white rounded-2xl p-1 w-25">Login</button>
                    </div>
                    <div className="text-center mt-5">
                        Don't have an account?
                        <a 
                            className="text-[#386641] mx-1 hover:underline cursor-pointer"
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                alert('Goo ga ga');
                            }}
                        >
                            Sing Up
                        </a>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default LoginRegisterForm;
