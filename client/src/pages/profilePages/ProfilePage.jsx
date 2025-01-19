import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import ModernInput from '../../components/base/ModernInput';
import OptimizedImage from '../../components/base/OptimizedImage';
import FileInputButton from '../../components/global/FileInputButton';
import ProgressBar from '../../components/global/ProgressBar';
import ErrorThrower from '../../components/base/ErrorThrower';
import PasswordStrengthMeter from '../../components/base/PasswordStrengthMeter';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
const ProfilePage = () => {
  const {
    user,
    updateProfile,
    updateProfileImage,
    changePassword,
    deleteProfile,
    logout,
    error,
    isLoading,
    message,
  } = useAuthStore();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);
  const [updateError, setUpdateError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [passwordStrengthError, setPasswordStrengthError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhoneNumber(user.phoneNumber || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(name, phoneNumber);
      toast.success('Profile updated successfully');
      setUpdateError('');
    } catch (error) {
      setUpdateError(error);
    }
  };
  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };
  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
      return 'Confirm Password is required';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const passwordErr = validatePassword(newPassword);
    const confirmPassErr = validateConfirmPassword(
      newPassword,
      confirmNewPassword
    );

    setPasswordStrengthError(passwordErr);
    setConfirmPasswordError(confirmPassErr);

    if (passwordErr || confirmPassErr) {
      return;
    }
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setPasswordStrengthError('');
      setConfirmPasswordError('');
      setPasswordError('');
      toast.success('Password changed successfully');
    } catch (error) {
      setPasswordError(error);
      console.error('Password change error', error);
    }
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };
  const handleUpdateProfileImage = async (e) => {
    e.preventDefault();
    if (!file) return;
    try {
      await updateProfileImage(file, setProgress);
      setFile(null);
      setProgress(0);
      toast.success('Profile Image updated successfully');
    } catch (error) {
      console.error('Failed to update profile image', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteProfile();
      navigate('/login');
      toast.success('Account Deleted successfully');
    } catch (error) {
      console.error('Failed to delete profile', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Profile</h1>
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='flex flex-col md:flex-row'>
          <div className='md:w-1/3 md:pr-4 flex flex-col items-center gap-4'>
            <OptimizedImage
              src={user?.profileImage}
              alt='Profile Image'
              className='h-48 w-48 rounded aspect-square object-cover'
            />
            {/* <form onSubmit={handleUpdateProfileImage}>
              <FileInputButton
                fileInputRef={fileInputRef}
                onFileInputClick={handleFileInputClick}
                onFileChange={handleFileChange}
                isUploading={isLoading}
                acceptFileType={'image/*'}
              />
              {progress > 0 && <ProgressBar progress={progress} />}
              <div className='mt-2'>
                {file && (
                  <button
                    type='submit'
                    className='bg-blue-500 text-white rounded px-2 py-1 hover:bg-blue-600 disabled:opacity-50'
                  >
                    Update Profile Image
                  </button>
                )}
              </div>
            </form> */}
            <div className='mt-4'>
              <button
                onClick={handleLogout}
                className='bg-red-500 text-white p-2 rounded hover:bg-red-600'
              >
                Logout
              </button>
            </div>
            <div className='mt-4'>
              {isLoading ? (
                <button
                  type='button'
                  className='bg-red-500 text-white p-2 rounded hover:bg-red-600'
                >
                  <Loader2 className='animate-spin' /> Deleting
                </button>
              ) : (
                <button
                  onClick={handleDeleteAccount}
                  className='bg-red-500 text-white p-2 rounded hover:bg-red-600'
                >
                  Delete Account
                </button>
              )}
            </div>
          </div>
          <div className='md:w-2/3'>
            <form onSubmit={handleUpdateProfile} className='space-y-4'>
              <ModernInput
                id='profile-name'
                name='name'
                type='text'
                label='Full Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <ModernInput
                id='profile-phone'
                name='phoneNumber'
                type='text'
                label='Phone Number'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />

              {updateError && <ErrorThrower error={updateError} />}
              <div className='flex justify-end'>
                {isLoading ? (
                  <button
                    type='button'
                    className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
                  >
                    <Loader2 className='animate-spin' /> Updating
                  </button>
                ) : (
                  <button
                    type='submit'
                    className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
                  >
                    Update Profile
                  </button>
                )}
              </div>
            </form>
            <div className='mt-8 border-t pt-4 '>
              <h2 className='text-lg font-semibold mb-2'>Change Password</h2>
              <form onSubmit={handleChangePassword} className='space-y-4'>
                <ModernInput
                  id='current-password'
                  name='currentPassword'
                  type='password'
                  label='Current Password'
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />

                <ModernInput
                  id='new-password'
                  name='newPassword'
                  type='password'
                  label='New Password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <ModernInput
                  id='confirm-password'
                  name='confirmPassword'
                  type='password'
                  label='Confirm New Password'
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
                <div className='w-[100%] mb-2 mx-auto'>
                  <PasswordStrengthMeter password={newPassword} />
                </div>
                {passwordStrengthError && (
                  <ErrorThrower error={passwordStrengthError} />
                )}
                {confirmPasswordError && (
                  <ErrorThrower error={confirmPasswordError} />
                )}
                {passwordError && <ErrorThrower error={passwordError} />}

                <div className='flex justify-end'>
                  {isLoading ? (
                    <button
                      type='button'
                      className='bg-blue-500 text-white p-2 rounded disabled:opacity-50'
                    >
                      <Loader2 className='animate-spin' /> Changing Password
                    </button>
                  ) : (
                    <button
                      type='submit'
                      className='bg-blue-500 text-white p-2 rounded disabled:opacity-50'
                    >
                      Change Password
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
