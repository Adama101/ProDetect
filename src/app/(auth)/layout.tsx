import type { ReactNode } from 'react';
import { ProDetectLogo } from '@/components/icons/logo';
import Image from 'next/image';
import widget from '../public/auth-widgets.png'; // Ensure image is in /public

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen w-full bg-black text-white">
            <div className="container relative min-h-screen grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                {/* Left side */}
                <div className="relative hidden h-full flex-col bg-black text-white lg:flex items-center justify-start px-1 pt-16 pb-12 space-y-4 border-r border-gray-700">
                    <ProDetectLogo className="h-30 w-auto" />
                    <p className="text-md text-center font-medium max-w-auto px-4">
                        Advanced Fraud Detection, AML Compliance, and Risk Management Platform
                    </p>
                    <Image
                        src={widget}
                        alt="ProDetect preview"
                        className="rounded-lg"
                        width={700}
                        height={800}
                        priority
                    />
                </div>

                {/* Right side (auth form) */}
                <div className="lg:p-8 flex items-center justify-center">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
