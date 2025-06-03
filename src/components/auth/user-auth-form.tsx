"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

// Schemas
const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
});

const registerSchema = z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    organisationName: z.string().min(1),
    industry: z.string().min(1),
    organisationSize: z.string().min(1),
    country: z.string().min(1),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    isRegister?: boolean;
}

export function UserAuthForm({
    className,
    isRegister = false,
    ...props
}: UserAuthFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isMounted, setIsMounted] = React.useState(false);
    const [savedEmail, setSavedEmail] = React.useState("");

    // Form setup
    const form = useForm<z.infer<typeof registerSchema | typeof loginSchema>>({
        resolver: zodResolver(isRegister ? registerSchema : loginSchema),
        defaultValues: isRegister
            ? {
                fullName: "",
                email: "",
                password: "",
                confirmPassword: "",
                organisationName: "",
                industry: "",
                organisationSize: "",
                country: "",
            }
            : {
                email: savedEmail, // Will be populated after mount
                password: "",
            },
    });

    // Client-side only effect
    React.useEffect(() => {
        setIsMounted(true);
        
        // Safe window access
        if (typeof window !== 'undefined') {
            // Example: Get saved email from localStorage for login convenience
            const email = window.localStorage.getItem('lastUsedEmail');
            if (email && !isRegister) {
                setSavedEmail(email);
                form.setValue('email', email);
            }
        }
    }, [form, isRegister]);

    async function onSubmit(values: any) {
        setIsLoading(true);
        await new Promise((res) => setTimeout(res, 1000));
        
        // Safe window access for storing auth data
        if (typeof window !== 'undefined') {
            // Store email for convenience on next login
            window.localStorage.setItem('lastUsedEmail', values.email);
            
            // You could store other auth data like tokens here
            if (!isRegister) {
                // Example: Store an auth token from your API response
                // window.localStorage.setItem('authToken', response.token);
            }
        }
        
        setIsLoading(false);

        toast({
            title: isRegister ? "Registration successful" : "Login successful",
            description: isRegister
                ? "Your account has been created."
                : "Welcome back to ProDetect.",
        });

        router.push("/");
    }

    // This function could handle social login that needs window

    return (
        <div className={`grid gap-6 ${className}`} {...props}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 max-h-[85vh] overflow-y-auto pr-1"
                >
                    {isRegister ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {([
                                ["fullName", "Full Name"],
                                ["email", "Email"],
                                ["password", "Password", "password"],
                                ["confirmPassword", "Confirm Password", "password"],
                                ["organisationName", "Organisation Name"],
                                ["industry", "Industry"],
                                ["organisationSize", "Organisation Size"],
                                ["country", "Country"],
                            ] as const).map(([name, label, type = "text"]) => (
                                <FormField
                                    key={name}
                                    control={form.control}
                                    name={name}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white">{label}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type={type}
                                                    placeholder={label}
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                    ) : (
                        <>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="you@example.com"
                                                type="email"
                                                autoComplete="email"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Your password"
                                                autoComplete="current-password"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}

                    <Button className="w-full mt-4" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isRegister ? "Register" : "Login"}
                    </Button>
                    
                    {/* Optional: Social login buttons that need window */}
                    {isMounted && (
                        <div className="mt-4 flex flex-col gap-2">
                            {/* <Button 
                                type="button" 
                                variant="destructive" 
                                onClick={() => handleSocialLogin('google')}
                                disabled={isLoading}
                            >
                                Continue with Google
                            </Button> */}
                        </div>
                    )}
                </form>
            </Form>
            
            {/* Remember me checkbox that uses localStorage */}
            {!isRegister && isMounted && (
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="remember"
                        className="h-4 w-4"
                        onChange={(e) => {
                            if (typeof window !== 'undefined') {
                                if (e.target.checked) {
                                    // Save preference
                                    window.localStorage.setItem('rememberLogin', 'true');
                                } else {
                                    // Remove preference
                                    window.localStorage.removeItem('rememberLogin');
                                }
                            }
                        }}
                        defaultChecked={
                            typeof window !== 'undefined' && 
                            window.localStorage.getItem('rememberLogin') === 'true'
                        }
                    />
                    <label htmlFor="remember" className="text-sm text-gray-300">
                        Remember me
                    </label>
                </div>
            )}
        </div>
    );
}