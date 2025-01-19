import { create } from 'zustand';
import { postData, getData, putData, deleteData } from '../services/apiService';
import axios from 'axios';
import axiosInstance from '../services/axiosInstance';
import toast from 'react-hot-toast';
('react-hot-toast');

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  message: null,
  setUser: (user) =>
    set({ user: user, isAuthenticated: true, isLoading: false, error: null }),
  clearUser: () =>
    set({ user: null, isAuthenticated: false, isLoading: false, error: null }),
  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getData('/auth/profile');
      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message,
      });
    }
  },
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      await postData(
        '/auth/register',
        { email, password, name },
        'Registration successful, Please verify your email'
      );
      set({ isLoading: false, message: 'Registration successful' });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await postData(
        '/auth/login',
        { email, password },
        'Login successful'
      );
      set({
        user: user,
        isAuthenticated: true,
        isLoading: false,
        message: 'Login successful',
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      // Use Axios to send the logout request
      await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
      toast.success('Logout successful');

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        message: 'Logout successful',
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  verifyEmail: async (verificationToken) => {
    set({ isLoading: true, error: null });
    try {
      await postData(
        '/auth/verify-email',
        { verificationToken },
        'Email verified successfully'
      );
      set({ isLoading: false, message: 'Email verified successfully' });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  resendVerification: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await postData(
        '/auth/resend-verification',
        { email },
        'Verification email resent successfully'
      );
      set({
        isLoading: false,
        message: 'Verification email resent successfully',
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await postData(
        '/auth/forgot-password',
        { email },
        'Password reset email sent successfully, please check your inbox.'
      );
      set({
        isLoading: false,
        message:
          'Password reset email sent successfully, please check your inbox.',
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  resetPassword: async (token, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      await postData(
        `/auth/reset-password/${token}`,
        { newPassword },
        'Password reset successfully'
      );
      set({ isLoading: false, message: 'Password reset successfully' });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  changePassword: async (currentPassword, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      await putData(
        `/auth/change-password`,
        { currentPassword, newPassword },
        'Password changed successfully'
      );
      set({ isLoading: false, message: 'Password changed successfully' });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  updateProfile: async (name, phoneNumber) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await putData(
        `/auth/update-profile`,
        { name, phoneNumber },
        'Profile updated successfully'
      );
      set({
        user: updatedUser,
        isLoading: false,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  updateProfileImage: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      // const updatedUser = await putData(
      //   `/auth/update-profile-image`,
      //   formData,
      //   'Profile image updated successfully'
      // );
      
      const updatedUser = await axiosInstance.put(
        `/auth/update-profile-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      set({
        user: updatedUser,
        isLoading: false,
        message: 'Profile image updated successfully',
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  deleteProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      await deleteData(`/auth/delete-profile`, 'Profile deleted successfully');
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        message: 'Profile deleted successfully',
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
}));
