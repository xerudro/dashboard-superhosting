import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Lock, Upload, Edit2, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { profileSchema, passwordSchema } from '../lib/validation';
import type { z } from 'zod';
import { useAuth } from '../lib/auth';
import { Database } from '../lib/db';

interface UserService {
  id: string;
  name: string;
  type: 'hosting' | 'vps' | 'domain';
  status: 'active' | 'pending' | 'expired';
  expiryDate: string;
  price: number;
}

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { user } = useAuth();
  
  const [userProfile, setUserProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=150&h=150&q=80'
  });

  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [services] = useState<UserService[]>([
    {
      id: '1',
      name: 'Stellar Standard',
      type: 'hosting',
      status: 'active',
      expiryDate: '2024-12-31',
      price: 7
    },
    {
      id: '2',
      name: 'example.com',
      type: 'domain',
      status: 'active',
      expiryDate: '2024-12-31',
      price: 12
    },
    {
      id: '3',
      name: 'Nitro VPS',
      type: 'vps',
      status: 'active',
      expiryDate: '2024-12-31',
      price: 18
    }
  ]);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) {
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        const db = Database.getInstance();
        await db.initialize();
        
        const profile = await db.getProfile(user.id);
        
        setUserProfile({
          name: profile.name || user.name || '',
          email: user.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
          avatar: profile.avatar_url || userProfile.avatar
        });
      } catch (error) {
        console.error('Failed to load profile:', error);
        toast.error('Failed to load profile data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [user, navigate]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setIsLoading(true);
      const db = Database.getInstance();
      await db.initialize();
      
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          await db.updateProfile(user.id, {
            avatar_url: reader.result as string
          });

          setUserProfile(prev => ({
            ...prev,
            avatar: reader.result as string
          }));
          
          toast.success('Profile picture updated successfully');
        } catch (error) {
          console.error('Failed to update avatar:', error);
          toast.error('Failed to update profile picture');
        } finally {
          setIsLoading(false);
        }
      };

      reader.onerror = () => {
        toast.error('Failed to read image file');
        setIsLoading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Failed to process image:', error);
      toast.error('Failed to update profile picture');
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});

      const validatedData = profileSchema.parse(userProfile);
      const db = Database.getInstance();
      await db.initialize();
      
      await db.updateProfile(user.id, {
        name: validatedData.name,
        phone: validatedData.phone,
        address: validatedData.address
      });

      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    
    try {
      setIsLoading(true);
      setErrors({});

      const validatedData = passwordSchema.parse(passwordForm);
      const db = Database.getInstance();
      await db.initialize();

      const { error } = await db.getClient().auth.updateUser({
        password: validatedData.newPassword
      });

      if (error) throw error;

      setShowPasswordChange(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      toast.success('Password updated successfully');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: UserService['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'expired':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in to view your profile</h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-orangered hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8">
              <div className="relative">
                <div className="w-32 h-32 mx-auto relative">
                  <img
                    src={userProfile.avatar}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                  <label className="absolute bottom-0 right-0 bg-orangered hover:bg-red-600 text-white p-2 rounded-full cursor-pointer transition-colors">
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          disabled={isLoading}
                        />
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={userProfile.name}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                        className={`w-full bg-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orangered`}
                        disabled={isLoading}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orangered`}
                        disabled={isLoading}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={userProfile.phone}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                        className={`w-full bg-gray-800 border ${errors.phone ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orangered`}
                        disabled={isLoading}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Address
                      </label>
                      <textarea
                        value={userProfile.address}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, address: e.target.value }))}
                        className={`w-full bg-gray-800 border ${errors.address ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orangered`}
                        rows={3}
                        disabled={isLoading}
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                      )}
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={handleProfileUpdate}
                        className="flex-1 bg-orangered hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Save
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setErrors({});
                        }}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center text-gray-300">
                      <User className="h-5 w-5 text-orangered mr-3" />
                      {userProfile.name}
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Mail className="h-5 w-5 text-orangered mr-3" />
                      {userProfile.email}
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Phone className="h-5 w-5 text-orangered mr-3" />
                      {userProfile.phone || 'Not set'}
                    </div>
                    <div className="flex items-center text-gray-300">
                      <MapPin className="h-5 w-5 text-orangered mr-3" />
                      {userProfile.address || 'Not set'}
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                      disabled={isLoading}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => setShowPasswordChange(true)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                  disabled={isLoading}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Your Services
              </h2>
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-gray-800/50 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center">
                        <span className="text-xl font-semibold text-white">
                          {service.name}
                        </span>
                        <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                      </div>
                      <div className="mt-2 text-gray-400">
                        Type: {service.type.toUpperCase()}
                      </div>
                      <div className="text-gray-400">
                        Expires: {service.expiryDate}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-4">
                      <span className="text-2xl font-bold text-white">
                        €{service.price}
                        <span className="text-sm text-gray-400">/mo</span>
                      </span>
                      <button className="bg-orangered hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors">
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Modal */}
        {showPasswordChange && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-white mb-6">
                Change Password
              </h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className={`w-full bg-gray-800 border ${errors.currentPassword ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orangered`}
                    disabled={isLoading}
                  />
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className={`w-full bg-gray-800 border ${errors.newPassword ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orangered`}
                    disabled={isLoading}
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={`w-full bg-gray-800 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orangered`}
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-orangered hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Update Password'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordChange(false);
                      setErrors({});
                      setPasswordForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;