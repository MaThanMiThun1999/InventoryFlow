import React, { useEffect, useState } from 'react';
import useNotificationStore from '../../store/notificationStore';
import { formatCustomDate, formatRelativeTime } from '../../utils/date';
import { Button } from '../../components/base/Button';
const NotificationList = () => {
  const {
    notifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useNotificationStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchNotifications();
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchNotifications]);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('failed to mark all notification as read', error);
    }
  };
  const handleClearNotifications = async () => {
    try {
      await clearNotifications();
    } catch (error) {
      console.error('failed to clear notifications', error);
    }
  };

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  if (!notifications || notifications.length === 0) {
    return <p>No notifications found.</p>;
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Notifications</h1>
      <div className='bg-white rounded-lg shadow-md p-4'>
        {notifications?.length > 0 && (
          <div className='flex justify-end gap-2 mb-2'>
            <Button onClick={handleMarkAllAsRead}>Mark All as Read</Button>
            <Button
              onClick={handleClearNotifications}
              classNames='bg-red-500 hover:bg-red-600'
            >
              Clear All
            </Button>
          </div>
        )}
        {notifications?.map((notification) => (
          <div
            key={notification._id}
            className={`p-4 mb-2 rounded-md border ${
              notification.status === 'pending'
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700'
            } `}
          >
            <div className='flex justify-between items-start'>
              <p className='font-semibold'>{notification.message}</p>
              {notification.status === 'pending' && (
                <button
                  className='text-sm bg-blue-500 text-white px-2 rounded hover:bg-blue-600'
                  onClick={() => markAsRead(notification._id)}
                >
                  Mark as Read
                </button>
              )}
            </div>
            <div className='flex justify-between items-center text-xs text-gray-500 mt-2'>
              <p>{formatRelativeTime(notification.createdAt)}</p>
              <p>{formatCustomDate(notification.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
