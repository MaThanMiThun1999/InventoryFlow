// src/store/profileStore.js
import { create } from 'zustand';
import { postData, getData, putData } from '../services/apiService';
import axiosInstance from '../services/axiosInstance';
export const useProfileStore = create((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  getProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getData('/auth/profile');
      set({ profile: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  updateProfile: async (name, phoneNumber) => {
    set({ isLoading: true, error: null });
    try {
      const data = await putData(
        '/auth/update-profile',
        { name, phoneNumber },
        'Profile updated successfully.'
      );
      set({ profile: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateProfileImage: async (file) => {
    console.log('file: ', file);
    set({ isLoading: true, error: null });
    const formData = new FormData();
    console.log('formData: ', formData);
    formData.append('profileImage', file);
    try {
      // const data = await putData(
      //   '/auth/update-profile-image',
      //   formData,
      //   'Profile image updated successfully.'
      // );

      const data = await axiosInstance.put(
        '/auth/update-profile-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      set((state) => ({
        profile: { ...state.profile, profileImage: data.profileImage },
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
