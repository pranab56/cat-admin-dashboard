"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import CustomLoading from '../../../components/Loading/CustomLoading';
import { useChangePasswordMutation, useEditProfileMutation, useGetProfileQuery } from "../../../features/settings/settingsApi";
import { baseURL } from '../../../utils/BaseURL';

// Interface definitions
interface EditFormData {
  profile: string | File;
  fullName: string;
  email: string;
  role: string;
  phone: string;
}

interface PasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ShowPasswords {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

interface ProfileData {
  profile: string;
  fullName: string;
  email: string;
  role: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: ProfileData;
}

interface ApiError {
  data?: {
    message: string;
  };
  status?: number;
}

interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

const ProfileSettings = () => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);

  // API hooks
  const { data: profileResponse, isLoading, refetch } = useGetProfileQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useEditProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const [editFormData, setEditFormData] = useState<EditFormData>({
    profile: '',
    fullName: '',
    email: '',
    role: '',
    phone: '',
  });

  const [previewImage, setPreviewImage] = useState<string>('');

  const [passwordFormData, setPasswordFormData] = useState<PasswordFormData>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState<ShowPasswords>({
    current: false,
    new: false,
    confirm: false,
  });

  const [apiMessage, setApiMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Set profile data when API response is available
  useEffect(() => {
    if (profileResponse?.data) {
      setEditFormData({
        profile: profileResponse.data.profile || '',
        fullName: profileResponse.data.fullName || '',
        email: profileResponse.data.email || '',
        role: profileResponse.data.role || '',
        phone: profileResponse.data.phone || '',
      });
      setPreviewImage(profileResponse.data.profile || '');
    }
  }, [profileResponse]);

  const showMessage = (type: 'success' | 'error', message: string) => {
    setApiMessage({ type, message });
    setTimeout(() => setApiMessage(null), 5000);
  };

  const handleEditProfile = (): void => {
    if (profileResponse?.data) {
      setEditFormData({
        profile: profileResponse.data.profile || '',
        fullName: profileResponse.data.fullName || '',
        email: profileResponse.data.email || '',
        role: profileResponse.data.role || '',
        phone: profileResponse.data.phone || '',
      });
      setPreviewImage(profileResponse.data.profile || '');
    }
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = async (): Promise<void> => {
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add profile image
      if (editFormData.profile instanceof File) {
        formData.append('profile', editFormData.profile);
      }

      // Add other fields
      formData.append('fullName', editFormData.fullName);
      formData.append('email', editFormData.email);
      formData.append('role', editFormData.role);
      formData.append('phone', editFormData.phone);

      const response = await updateProfile(formData).unwrap() as ApiResponse;

      if (response.success) {
        showMessage('success', response.message || 'Profile updated successfully');
        setIsEditProfileOpen(false);
        refetch(); // Refresh the profile data
      } else {
        showMessage('error', response.message || 'Failed to update profile');
      }
    } catch (error: unknown) {
      console.error('Update error:', error);
      const apiError = error as ApiError;
      showMessage('error', apiError?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancelEdit = (): void => {
    // Reset form data to current profile data
    if (profileResponse?.data) {
      setEditFormData({
        profile: profileResponse.data.profile || '',
        fullName: profileResponse.data.fullName || '',
        email: profileResponse.data.email || '',
        role: profileResponse.data.role || '',
        phone: profileResponse.data.phone || '',
      });
      setPreviewImage(profileResponse.data.profile || '');
    }
    setIsEditProfileOpen(false);
  };

  const handleChangePassword = (): void => {
    setIsChangePasswordOpen(true);
  };

  const handleSavePassword = async (): Promise<void> => {
    // Validate passwords
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      showMessage('error', 'New password and confirm password do not match');
      return;
    }

    if (passwordFormData.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      const passwordData: ChangePasswordRequest = {
        oldPassword: passwordFormData.oldPassword,
        newPassword: passwordFormData.newPassword,
      };

      const response = await changePassword(passwordData).unwrap() as ApiResponse;

      if (response.success) {
        showMessage('success', response.message || 'Password changed successfully');
        setPasswordFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setIsChangePasswordOpen(false);
      } else {
        showMessage('error', response.message || 'Failed to change password');
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      showMessage('error', apiError?.data?.message || 'Failed to change password');
    }
  };

  const handleCancelPassword = (): void => {
    setPasswordFormData({
      oldPassword: '',
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the file object
      setEditFormData({
        ...editFormData,
        profile: file,
      });

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return <CustomLoading />
  }

  const profileData = profileResponse?.data as ProfileData | undefined;

  return (
    <div className="">
      {/* API Message Alert */}
      {apiMessage && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg ${apiMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
          {apiMessage.message}
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-sm">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={profileData?.profile ? `${baseURL}/${profileData.profile}` : '/placeholder.png'}
                alt="Profile"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profileData?.fullName || 'User'}
                </h2>
                <p className="text-gray-500 capitalize">{profileData?.role || 'User'}</p>
                <p className="text-gray-500 text-sm">{profileData?.email}</p>
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
                Full Name
              </label>
              <div className="bg-indigo-50 rounded-lg px-4 py-3 text-gray-700">
                {profileData?.fullName || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email
              </label>
              <div className="bg-indigo-50 rounded-lg px-4 py-3 text-gray-700">
                {profileData?.email || 'N/A'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Role
              </label>
              <div className="bg-indigo-50 rounded-lg px-4 py-3 text-gray-700 capitalize">
                {profileData?.role || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Phone
              </label>
              <div className="bg-indigo-50 rounded-lg px-4 py-3 text-gray-700">
                {profileData?.phone || 'N/A'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Account Status
              </label>
              <div className="bg-indigo-50 rounded-lg px-4 py-3 text-gray-700">
                {profileData?.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Member Since
              </label>
              <div className="bg-indigo-50 rounded-lg px-4 py-3 text-gray-700">
                {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Password Settings Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Password Settings</h2>
            <button
              onClick={handleChangePassword}
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

      {/* Edit Profile Dialog - Personal Information */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl p-0">
          <div className="p-6">
            <DialogHeader className="flex flex-row items-center justify-between mb-6">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Edit Personal Information
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              {/* Image Upload */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <Image
                    src={previewImage ? (previewImage.startsWith('data:') ? previewImage : `${baseURL}/${previewImage}`) : '/placeholder.png'}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                  />
                </div>
                <label className="cursor-pointer">
                  <span className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors">
                    Change Image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name
                  </label>
                  <Input
                    placeholder="Enter full name here.."
                    value={editFormData.fullName}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, fullName: e.target.value })
                    }
                    className="w-full bg-indigo-50 border-0 rounded-lg px-4 py-3 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter email here.."
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, email: e.target.value })
                    }
                    className="w-full bg-indigo-50 border-0 rounded-lg px-4 py-3 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Role
                  </label>
                  <Input
                    placeholder="Enter role here.."
                    value={editFormData.role}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, role: e.target.value })
                    }
                    className="w-full bg-indigo-50 border-0 rounded-lg px-4 py-3 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone
                  </label>
                  <Input
                    placeholder="Enter phone number here.."
                    value={editFormData.phone}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, phone: e.target.value })
                    }
                    className="w-full bg-indigo-50 border-0 rounded-lg px-4 py-3 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  disabled={isUpdating}
                  className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 border-0 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  disabled={isUpdating}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-semibold"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
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
                    value={passwordFormData.oldPassword}
                    onChange={(e) =>
                      setPasswordFormData({
                        ...passwordFormData,
                        oldPassword: e.target.value,
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
                  disabled={isChangingPassword}
                  className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 border-0 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePassword}
                  disabled={isChangingPassword}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-semibold"
                >
                  {isChangingPassword ? 'Changing...' : 'Save Changes'}
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