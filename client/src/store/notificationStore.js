import { create } from 'zustand';
import {  getData, putData, deleteData } from '../services/apiService';
const useNotificationStore = create((set, get) => ({
    notifications: [],
    isLoading: false,
    error: null,
    fetchNotifications: async () => {
         set({ isLoading: true, error: null });
        try {
           const data = await getData('/notifications')
            set({ notifications: data.notifications, isLoading: false });
        } catch (error) {
            set({ notifications: [], isLoading: false, error: error.message });
            throw error
        }
    },
    markAsRead: async (id) => {
      set({ isLoading: true, error: null })
        try {
           await putData(`/notifications/${id}`, null, 'Notification marked as read');
            const updatedNotifications = get().notifications.map(notification =>
                 notification._id === id ? { ...notification, status: 'sent'} : notification
            );
            set({ notifications: updatedNotifications, isLoading: false });
        } catch (error) {
           set({ isLoading: false, error: error.message });
            throw error
        }
    },
   markAllAsRead: async () => {
         set({ isLoading: true, error: null });
          try {
           await  putData(`/notifications`, null, 'All notifications marked as read')
                const updatedNotifications = get().notifications.map(notification => ({ ...notification, status: 'sent' }));
            set({ notifications: updatedNotifications, isLoading: false });
          } catch (error) {
                set({ isLoading: false, error: error.message });
              throw error;
          }
   },
     clearNotifications: async () => {
      set({ isLoading: true, error: null });
        try {
            await deleteData(`/notifications`, 'Notifications cleared');
            set({ notifications: [], isLoading: false });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error
        }
    }
}));

export default useNotificationStore;