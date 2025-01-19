// // src/store/notificationStore.js
// import { create } from 'zustand';
// import axiosInstance from '../services/axiosInstance';
// import { handleError, handleResponse } from '../utils/responseHandler';

// export const useNotificationStore = create((set, get) => ({
//   notifications: [],
//   isLoading: false,
//   error: null,
//   unreadCount: 0,

//   fetchNotifications: async () => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await axiosInstance.get('/notifications'); // Replace with actual endpoint
//       if (response?.data.success) {
//         handleResponse(response, (data) => {
//           set({
//             notifications: data.notifications,
//             unreadCount: data.notifications.filter(
//               (notification) => notification.status === 'pending'
//             ).length,
//           });
//         });
//       } else {
//         set({ error: response?.data?.message });
//         handleResponse(response);
//       }
//     } catch (error) {
//       set({ error: handleError(error) });
//     } finally {
//       set({ isLoading: false });
//     }
//   },
//   markNotificationAsRead: async (notificationId) => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await axiosInstance.put(
//         `/notifications/${notificationId}`,
//         {
//           status: 'sent',
//         }
//       );
//       if (response?.data.success) {
//         handleResponse(response, () => {
//           set((state) => ({
//             notifications: state.notifications.map((notification) =>
//               notification._id === notificationId
//                 ? { ...notification, status: 'sent' }
//                 : notification
//             ),
//           }));
//           set({
//             unreadCount: get().unreadCount > 0 ? get().unreadCount - 1 : 0,
//           });
//         });
//       } else {
//         set({ error: response?.data?.message });
//         handleResponse(response);
//       }
//     } catch (error) {
//       set({ error: handleError(error) });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   markAllNotificationsAsRead: async () => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await axiosInstance.put(`/notifications`, {
//         status: 'sent',
//       });
//       if (response?.data.success) {
//         handleResponse(response, () => {
//           set((state) => ({
//             notifications: state.notifications.map((notification) => ({
//               ...notification,
//               status: 'sent',
//             })),
//           }));
//           set({ unreadCount: 0 });
//         });
//       } else {
//         set({ error: response?.data?.message });
//         handleResponse(response);
//       }
//     } catch (error) {
//       set({ error: handleError(error) });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   clearNotifications: async () => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await axiosInstance.delete(`/notifications`);
//       if (response?.data.success) {
//         handleResponse(response, () =>
//           set({ notifications: [], unreadCount: 0 })
//         );
//       } else {
//         set({ error: response?.data?.message });
//         handleResponse(response);
//       }
//     } catch (error) {
//       set({ error: handleError(error) });
//     } finally {
//       set({ isLoading: false });
//     }
//   },
// }));
// src/store/notificationStore.js
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