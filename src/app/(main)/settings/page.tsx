"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ProfileData {
  firstName: string;
  lastName: string;
  country: string;
  address: string;
  role: string;
  avatar: string;
}

interface EditFormData {
  firstName: string;
  lastName: string;
  country: string;
  address: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ShowPasswords {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

const ProfileSettings = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'jane',
    lastName: 'Cooper',
    country: 'United Kingdom',
    address: '3891 Ranchview Dr. Richardson, California 62639',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  });

  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);

  const [editFormData, setEditFormData] = useState<EditFormData>({
    firstName: '',
    lastName: '',
    country: '',
    address: '',
  });

  const [passwordFormData, setPasswordFormData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState<ShowPasswords>({
    current: false,
    new: false,
    confirm: false,
  });

  const handleEditProfile = (): void => {
    setEditFormData({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      country: profileData.country,
      address: profileData.address,
    });
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = (): void => {
    setProfileData({
      ...profileData,
      ...editFormData,
    });
    setIsEditProfileOpen(false);
  };

  const handleCancelEdit = (): void => {
    setEditFormData({
      firstName: '',
      lastName: '',
      country: '',
      address: '',
    });
    setIsEditProfileOpen(false);
  };

  const handleChangePassword = (): void => {
    setIsChangePasswordOpen(true);
  };

  const handleSavePassword = (): void => {
    // Password change logic here
    console.log('Password changed');
    setPasswordFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsChangePasswordOpen(false);
  };

  const handleCancelPassword = (): void => {
    setPasswordFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsChangePasswordOpen(false);
  };

  const togglePasswordVisibility = (field: keyof ShowPasswords): void => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="">
      <div className="bg-white p-8 rounded-2xl shadow-sm">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={profileData.avatar}
                alt="Profile"
                width={1000}
                height={1000}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profileData.firstName.charAt(0).toUpperCase() + profileData.firstName.slice(1)} {profileData.lastName}
                </h2>
                <p className="text-gray-500">{profileData.role}</p>
              </div>
            </div>
            <button
              onClick={handleEditProfile}
              className="flex items-center gap-2 text-gray-600 border py-1 px-3 cursor-pointer rounded-lg hover:text-gray-900 transition-colors"
            >
              <span className="text-sm font-medium">Edit</span>
              <Image src={"/icons/EditIcon.png"} width={20} height={20} alt='Edit icons' className='' />
            </button>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
            <button
              onClick={handleEditProfile}
              className="flex items-center gap-2 text-gray-600 border py-1 px-3 cursor-pointer rounded-lg hover:text-gray-900 transition-colors"
            >
              <span className="text-sm font-medium">Edit</span>
              <Image src={"/icons/EditIcon.png"} width={20} height={20} alt='Edit icons' className='' />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                First Name
              </label>
              <div className="bg-indigo-50 rounded-lg px-4 py-3 text-gray-700">
                {profileData.firstName}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Last Name
              </label>
              <div className="bg-indigo-50 rounded-lg px-4 py-3 text-gray-700">
                {profileData.lastName}
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-4">Address</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Country Name
              </label>
              <div className="bg-indigo-50 rounded-lg px-4 py-3 text-gray-700">
                {profileData.country}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Address
              </label>
              <div className="bg-indigo-50 rounded-lg px-4 py-3 text-gray-700">
                {profileData.address}
              </div>
            </div>
          </div>
        </div>

        {/* Password Settings Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Password Settings</h2>
            <button
              onClick={handleEditProfile}
              className="flex items-center gap-2 text-gray-600 border py-1 px-3 cursor-pointer rounded-lg hover:text-gray-900 transition-colors"
            >
              <span className="text-sm font-medium">Edit</span>
              <Image src={"/icons/EditIcon.png"} width={20} height={20} alt='Edit icons' className='' />
            </button>
          </div>
          <button
            onClick={handleChangePassword}
            className="text-gray-900 hover:text-indigo-600 transition-colors"
          >
            Change password
          </button>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl p-0">
          <div className="p-6">
            <DialogHeader className="flex flex-row items-center justify-between mb-6">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Edit Profile
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    First Name
                  </label>
                  <Input
                    placeholder="Enter first name here.."
                    value={editFormData.firstName}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, firstName: e.target.value })
                    }
                    className="w-full bg-indigo-50 border-0 rounded-lg px-4 py-3 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Last Name
                  </label>
                  <Input
                    placeholder="Enter last name here.."
                    value={editFormData.lastName}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, lastName: e.target.value })
                    }
                    className="w-full bg-indigo-50 border-0 rounded-lg px-4 py-3 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Country Name
                  </label>
                  <Input
                    placeholder="Enter country name here.."
                    value={editFormData.country}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, country: e.target.value })
                    }
                    className="w-full bg-indigo-50 border-0 rounded-lg px-4 py-3 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Address
                  </label>
                  <Input
                    placeholder="Enter address name here.."
                    value={editFormData.address}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, address: e.target.value })
                    }
                    className="w-full bg-indigo-50 border-0 rounded-lg px-4 py-3 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 border-0 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-semibold"
                >
                  Send Changes
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl p-0">
          <div className="p-6">
            <DialogHeader className="flex flex-row items-center justify-between mb-6">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Change Password
              </DialogTitle>
              <button
                onClick={handleCancelPassword}
                className="w-8 h-8 rounded-full bg-gray-600 hover:bg-gray-700 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </DialogHeader>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.current ? 'text' : 'password'}
                    placeholder="Enter current password here.."
                    value={passwordFormData.currentPassword}
                    onChange={(e) =>
                      setPasswordFormData({
                        ...passwordFormData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full bg-indigo-50 border-0 rounded-lg px-4 py-3 pr-10 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.new ? 'text' : 'password'}
                    placeholder="Enter new password here.."
                    value={passwordFormData.newPassword}
                    onChange={(e) =>
                      setPasswordFormData({
                        ...passwordFormData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full bg-indigo-50 border-0 rounded-lg px-4 py-3 pr-10 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    placeholder="Enter confirm password here.."
                    value={passwordFormData.confirmPassword}
                    onChange={(e) =>
                      setPasswordFormData({
                        ...passwordFormData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full bg-indigo-50 border-0 rounded-lg px-4 py-3 pr-10 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  onClick={handleCancelPassword}
                  variant="outline"
                  className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 border-0 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePassword}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-semibold"
                >
                  Send Changes
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSettings;