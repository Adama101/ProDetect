'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase/client';
import { Loader2, AlertCircle, CheckCircle, Camera, User, Mail, Phone, Building, MapPin, Briefcase } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function ProfilePage() {
  const { user, profile, updateProfile, updatePassword, updateEmail } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    organizationCountry: '',
    organizationSector: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [emailData, setEmailData] = useState({
    newEmail: '',
    password: '',
  });

  // Initialize form data from profile
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: user?.email || '',
        phone: profile.phone || '',
        organization: profile.organization || '',
        organizationCountry: profile.organization_country || '',
        organizationSector: profile.organization_sector || '',
      });
      
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile, user]);

  // Handle profile update
  const handleProfileUpdate = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        organization: formData.organization,
        organization_country: formData.organizationCountry,
        organization_sector: formData.organizationSector,
      });
      
      setSuccess('Profile updated successfully');
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }
    
    try {
      await updatePassword(passwordData.newPassword);
      
      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setSuccess('Password updated successfully');
    } catch (error: any) {
      setError(error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email update
  const handleEmailUpdate = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await updateEmail(emailData.newEmail);
      
      // Clear form
      setEmailData({
        newEmail: '',
        password: '',
      });
      
      setSuccess('Email update initiated. Please check your new email for confirmation.');
    } catch (error: any) {
      setError(error.message || 'Failed to update email');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      // Update user profile with avatar URL
      await updateProfile({
        avatar_url: data.publicUrl,
      });
      
      setAvatarUrl(data.publicUrl);
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading your avatar.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (profile) {
      return `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase();
    } else if (user) {
      const nameParts = user.email?.split('@')[0].split(/[._-]/) || [];
      return nameParts.map(part => part[0]?.toUpperCase() || '').join('').substring(0, 2);
    }
    return 'PD';
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="relative group">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl || undefined} alt={profile?.first_name ? `${profile.first_name} ${profile.last_name}` : "User Avatar"} />
            <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
          </Avatar>
          <label 
            htmlFor="avatar-upload" 
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Camera className="h-6 w-6 text-white" />
            <span className="sr-only">Upload new avatar</span>
          </label>
          <input 
            id="avatar-upload" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleAvatarUpload}
            disabled={uploading}
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>
        
        <div>
          <h1 className="text-3xl font-bold">{profile?.first_name} {profile?.last_name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          {profile?.organization && (
            <p className="text-sm text-muted-foreground mt-1">
              {profile.organization} • {profile.organization_sector}
            </p>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email & Password
          </TabsTrigger>
          <TabsTrigger value="organization" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Organization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert variant="default" className="bg-green-900 border-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName} 
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName} 
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  value={formData.email} 
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  To change your email address, go to the Email & Password tab.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              
              <Button 
                onClick={handleProfileUpdate} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Email</CardTitle>
              <CardDescription>
                Update your email address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newEmail">New Email Address</Label>
                <Input 
                  id="newEmail" 
                  type="email"
                  value={emailData.newEmail} 
                  onChange={(e) => setEmailData({...emailData, newEmail: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emailPassword">Current Password</Label>
                <Input 
                  id="emailPassword" 
                  type="password"
                  value={emailData.password} 
                  onChange={(e) => setEmailData({...emailData, password: e.target.value})}
                />
              </div>
              
              <Button 
                onClick={handleEmailUpdate} 
                disabled={isLoading || !emailData.newEmail || !emailData.password}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Email'
                )}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  type="password"
                  value={passwordData.currentPassword} 
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  type="password"
                  value={passwordData.newPassword} 
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  value={passwordData.confirmPassword} 
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                />
              </div>
              
              <Button 
                onClick={handlePasswordUpdate} 
                disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>
                Update your organization information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="organization">Organization Name</Label>
                <Input 
                  id="organization" 
                  value={formData.organization} 
                  onChange={(e) => setFormData({...formData, organization: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organizationCountry">Country</Label>
                  <Input 
                    id="organizationCountry" 
                    value={formData.organizationCountry} 
                    onChange={(e) => setFormData({...formData, organizationCountry: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organizationSector">Sector</Label>
                  <Input 
                    id="organizationSector" 
                    value={formData.organizationSector} 
                    onChange={(e) => setFormData({...formData, organizationSector: e.target.value})}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleProfileUpdate} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}