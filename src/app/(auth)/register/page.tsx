import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Register - ProDetect",
    description: "Create a ProDetect account",
};

const africanCountries = [
    "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde",
    "Cameroon", "Central African Republic", "Chad", "Comoros", "Congo (Brazzaville)",
    "Congo (Kinshasa)", "Côte d'Ivoire", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea",
    "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Kenya",
    "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius",
    "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "São Tomé and Príncipe",
    "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan",
    "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"
];

export default function RegisterPage() {
    return (
        <div className="container flex h-full min-h-screen w-full flex-col items-center justify-center py-12 bg-black text-white">
            <div className="mx-auto w-full max-w-3xl space-y-6">
                <div className="flex flex-col text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-white">Create an account</h1>
                    <p className="text-sm text-gray-400">
                        Enter your details below to create your account
                    </p>
                </div>

                <form className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">First Name</label>
                            <input
                                type="text"
                                placeholder="John"
                                className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-[#007b94] focus:ring-2 focus:ring-[#007b94] focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Last Name</label>
                            <input
                                type="text"
                                placeholder="Ukana"
                                className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-[#007b94] focus:ring-2 focus:ring-[#007b94] focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="johnny@gmail.com"
                            className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-[#007b94] focus:ring-2 focus:ring-[#007b94] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-[#007b94] focus:ring-2 focus:ring-[#007b94] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-1">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-[#007b94] focus:ring-2 focus:ring-[#007b94] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Phone Number</label>
                        <div className="flex items-stretch gap-2">
                            <select className="rounded-md border border-gray-600 bg-gray-800 px-2 py-2 text-sm text-white focus:border-[#007b94] focus:ring-2 focus:ring-[#007b94] focus:outline-none">
                                <option value="+234">🇳🇬 +234</option>
                                <option value="+254">🇰🇪 +254</option>
                                <option value="+27">🇿🇦 +27</option>
                                <option value="+20">🇪🇬 +20</option>
                            </select>
                            <input
                                type="tel"
                                placeholder="8123456789"
                                className="flex-1 rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-[#007b94] focus:ring-2 focus:ring-[#007b94] focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Organisation Name</label>
                            <input
                                type="text"
                                placeholder="PayStack"
                                className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-[#007b94] focus:ring-2 focus:ring-[#007b94] focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Organisation Country</label>
                            <select className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-[#007b94] focus:ring-2 focus:ring-[#007b94] focus:outline-none">
                                <option value="" className="text-gray-400">Select...</option>
                                {africanCountries.map((country) => (
                                    <option key={country} value={country} className="text-white bg-gray-800">{country}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Organisation Sector</label>
                            <select className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-[#007b94] focus:ring-2 focus:ring-[#007b94] focus:outline-none">
                                <option value="" className="text-gray-400">Select...</option>
                                <option value="Finance" className="text-white bg-gray-800">Finance</option>
                                <option value="Health" className="text-white bg-gray-800">Health</option>
                                <option value="Education" className="text-white bg-gray-800">Education</option>
                                <option value="Government" className="text-white bg-gray-800">Government</option>
                            </select>
                        </div>
                        {/* <div>
                            <label className="block text-sm font-medium text-white mb-1">How did you hear about us?</label>
                            <select className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-[#007b94] focus:ring-2 focus:ring-[#007b94] focus:outline-none">
                                <option value="" className="text-gray-400">Select...</option>
                                <option value="Google" className="text-white bg-gray-800">Google</option>
                                <option value="Social Media" className="text-white bg-gray-800">Social Media</option>
                                <option value="Referral" className="text-white bg-gray-800">Referral</option>
                            </select>
                        </div> */}
                    </div>

                    <div className="flex items-start space-x-2 pt-2">
                        <input
                            type="checkbox"
                            id="terms"
                            className="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-800 text-[#007b94] focus:ring-[#007b94] focus:ring-2"
                        />
                        <label htmlFor="terms" className="text-sm text-white">
                            I have read and agree to the{" "}
                            <a href="#" className="text-[#19b59f] underline hover:text-[#006b81]">Terms and Services</a> and{" "}
                            <a href="#" className="text-[#19b59f] underline hover:text-[#006b81]">Privacy Policy</a>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-md bg-[#19b59f] px-4 py-2 text-white hover:bg-[#006b81] transition-colors font-medium"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#19b59f] underline underline-offset-4 hover:text-[#006b81]">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}