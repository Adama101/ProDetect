'use client';

import { useState, FormEvent } from "react";
import Link from "next/link";
import { ProDetectLogo } from '@/components/icons/logo';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth/auth-provider";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    organization: '',
    organizationCountry: '',
    organizationSector: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!agreedToTerms) {
      setError('You must agree to the Terms and Services');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await signUp(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        organization: formData.organization,
        organizationCountry: formData.organizationCountry,
        organizationSector: formData.organizationSector,
      });
      // Redirect is handled in the auth provider
    } catch (error: any) {
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-full min-h-screen w-full flex-col items-center justify-center py-12 bg-black text-white">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Create an account</h1>
          <p className="text-sm text-gray-400">
            Enter your details below to create your account
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className="block text-sm font-medium text-white mb-1">First Name</Label>
              <Input
                type="text"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-[#007b94] focus:ring-2 focus:ring-[#007b94] focus:outline-none"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-white mb-1">Last Name</Label>
              <Input
                type="text"
                name="lastName"
                placeholder="Ukana"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-[#007b94] focus:ring-2 focus:ring-[#007b94] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-white mb-1">Email Address</Label>
            <Input
              type="email"
              name="email"
              placeholder="johnny@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-[#007b94] focus:ring-2 focus:ring-[#007b94] focus:outline-none"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-white mb-1">Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-[#007b94] focus:ring-2 focus:ring-[#007b94] focus:outline-none"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-1">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-[#007b94] focus:ring-2 focus:ring-[#007b94] focus:outline-none"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-white mb-1">Phone Number</Label>
            <Input
              type="tel"
              name="phone"
              placeholder="e.g., +234 8123456789"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-[#007b94] focus:ring-2 focus:ring-[#007b94] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className="block text-sm font-medium text-white mb-1">Organisation Name</Label>
              <Input
                type="text"
                name="organization"
                placeholder="PayStack"
                value={formData.organization}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-[#007b94] focus:ring-2 focus:ring-[#007b94] focus:outline-none"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-white mb-1">Organisation Country</Label>
              <Select 
                value={formData.organizationCountry} 
                onValueChange={(value) => handleSelectChange('organizationCountry', value)}
              >
                <SelectTrigger className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-[#007b94] focus:ring-2 focus:ring-[#007b94] focus:outline-none">
                  <SelectValue placeholder="Select..." className="text-gray-400" />
                </SelectTrigger>
                <SelectContent>
                  {africanCountries.map((country) => (
                    <SelectItem key={country} value={country} className="text-white bg-gray-800">{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
            <div>
              <Label className="block text-sm font-medium text-white mb-1">Organisation Sector</Label>
              <Select 
                value={formData.organizationSector} 
                onValueChange={(value) => handleSelectChange('organizationSector', value)}
              >
                <SelectTrigger className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-[#007b94] focus:ring-2 focus:ring-[#007b94] focus:outline-none">
                  <SelectValue placeholder="Select..." className="text-gray-400" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Finance" className="text-white bg-gray-800">Finance</SelectItem>
                  <SelectItem value="Health" className="text-white bg-gray-800">Health</SelectItem>
                  <SelectItem value="Education" className="text-white bg-gray-800">Education</SelectItem>
                  <SelectItem value="Government" className="text-white bg-gray-800">Government</SelectItem>
                  <SelectItem value="Technology" className="text-white bg-gray-800">Technology</SelectItem>
                  <SelectItem value="Manufacturing" className="text-white bg-gray-800">Manufacturing</SelectItem>
                  <SelectItem value="Retail" className="text-white bg-gray-800">Retail</SelectItem>
                  <SelectItem value="Other" className="text-white bg-gray-800">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-start space-x-2 pt-2">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
              className="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-800 text-[#007b94] focus:ring-[#007b94] focus:ring-2"
            />
            <Label htmlFor="terms" className="text-sm text-white">
              I have read and agree to the{" "}
              <a href="#" className="text-[#19b59f] underline hover:text-[#006b81]">Terms and Services</a> and{" "}
              <a href="#" className="text-[#19b59f] underline hover:text-[#006b81]">Privacy Policy</a>
            </Label>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !agreedToTerms}
            className="w-full rounded-md bg-[#19b59f] px-4 py-2 text-white hover:bg-[#006b81] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-[#19b59f] underline underline-offset-4 hover:text-[#006b81]">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}