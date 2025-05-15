'use client'

import React, { useState } from 'react';
import { Mail, Lock, User, EyeOff, Eye, Loader2 } from 'lucide-react';
import { login, signup } from "./actions";


const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);

    const [isLoading, setIsLoading] = useState(false);



    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.target); // Get form data from event
        try {
            const result = isLogin ? await login(formData) : await signup(formData);
            if (result?.error) {
                setError(result.error);
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">

                {error && (
                    <div className="text-red-500 text-center mb-4">
                        {error}
                    </div>
                )}

                {/* Header */}
                <div className="text-center">
                    <h1 className='font-serif text-3xl font-extrabold bg-gradient-to-r from-[#9ec0dc] to-[#5a338d] text-transparent bg-clip-text'>Bantr</h1>

                    <h2 className="text-2xl font-bold text-gray-900 transition-all duration-300">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {!isLogin && (
                        <div className="relative">
                            <label htmlFor="name" className="sr-only">
                                Full Name
                            </label>
                            <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                placeholder="Full Name"
                            />



                        </div>
                    )}

                    <div className="relative">
                        <label htmlFor="email" className="sr-only">
                            Email address
                        </label>
                        <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            placeholder="Email address"
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            placeholder="Password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-3 right-3"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>

                    {isLogin && (
                        <div className="flex items-center justify-end">
                            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                                Forgot your password?
                            </button>
                        </div>
                    )}


                    {/* login action buttons */}
                    {isLogin ? (
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:bg-indigo-400"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className='animate-spin' />
                            ) : (
                                <p>Sign In</p>
                            )
                            }

                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:bg-indigo-400"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className='animate-spin' />
                            ) : (
                                <p>Create Account</p>
                            )
                            }
                        </button>
                    )}

                </form>

                {/* Social Login */}
                <div className="mt-6">
                    {/* <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div> */}

                    {/* <div className="mt-6 grid grid-cols-2 gap-3">
                        <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200">
                            Google
                        </button>
                        <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200">
                            GitHub
                        </button>
                    </div> */}
                </div>

            </div>
        </div>
    );
};

export default LoginPage;


