'use client';

import { Metadata } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

// Note: Since we're using 'use client', we can't export metadata from this component
// You'll need to move the metadata to a parent server component or layout

// UserAuthForm component
function UserAuthForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Basic validation
        if (!email || !password) {
            alert('Please fill in both email and password');
            return;
        }

        setIsLoading(true);
        
        try {
            // Here you would typically make an API call to authenticate
            // For now, we'll just simulate a login and redirect
            console.log('Login attempt:', { email, password });
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // On successful login, redirect to home page
            router.push('/');
            
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-medium text-white mb-1">Email Address</label>
                <input 
                    type="email" 
                    placeholder="johnny@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-[#19b59f] focus:ring-2 focus:ring-[#19b59f] focus:outline-none" 
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-white mb-1">Password</label>
                <input 
                    type="password" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-[#19b59f] focus:ring-2 focus:ring-[#19b59f] focus:outline-none" 
                />
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <input 
                        type="checkbox" 
                        id="remember" 
                        className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-[#19b59f] focus:ring-[#19b59f] focus:ring-2" 
                    />
                    <label htmlFor="remember" className="text-sm text-white">
                        Remember me
                    </label>
                </div>
                <Link href="" className="text-sm text-[#19b59f] hover:text-[#006b81] underline">
                    Forgot password?
                </Link>
            </div>

            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full rounded-md bg-[#19b59f] px-4 py-2 text-white hover:bg-[#006b81] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Logging in...' : 'Log In'}
            </button>
        </form>
    );
}

export default function LoginPage() {
    return (
        <div className="container flex h-screen w-full flex-col items-center justify-center bg-black text-white">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-white">Welcome back</h1>
                    <p className="text-sm text-gray-400">
                        Enter your credentials to access your account
                    </p>
                </div>
                <UserAuthForm />
                <p className="px-8 text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <Link
                        href="/register"
                        className="text-[#19b59f] underline underline-offset-4 hover:text-[#19b59f]"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}