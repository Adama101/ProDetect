'use client';

import { useState, FormEvent } from "react";
import Link from "next/link";
import { ProDetectLogo } from '@/components/icons/logo';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth/auth-provider";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in both email and password');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await signIn(email, password);
      // Redirect is handled in the auth provider
    } catch (error: any) {
      setError(error.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center bg-black text-white">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <ProDetectLogo className="h-20 w-auto" />
          <h1 className="text-2xl font-semibold tracking-tight text-white">Welcome back</h1>
          <p className="text-sm text-gray-400">
            Enter your credentials to access your account
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label className="block text-sm font-medium text-white mb-1">Email Address</Label>
            <Input 
              type="email" 
              placeholder="johnny@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-[#19b59f] focus:ring-2 focus:ring-[#19b59f] focus:outline-none" 
            />
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-white mb-1">Password</Label>
            <Input 
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
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
                className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-[#19b59f] focus:ring-[#19b59f] focus:ring-2" 
              />
              <Label htmlFor="remember" className="text-sm text-white">
                Remember me
              </Label>
            </div>
            <Link href="/forgot-password" className="text-sm text-[#19b59f] hover:text-[#006b81] underline">
              Forgot password?
            </Link>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full rounded-md bg-[#19b59f] px-4 py-2 text-white hover:bg-[#006b81] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

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