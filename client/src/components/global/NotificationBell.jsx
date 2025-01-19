import React from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationBell = ({ notifications }) => {
  const unreadCount = notifications?.filter(
    (notification) => notification.status !== 'sent'
  ).length;

  return (
    <Link
      to='/notifications'
      className='relative inline-flex items-center hover:text-gray-300'
    >
      <Bell className='h-5 w-5' />
      {unreadCount > 0 && (
        <span className='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full'>
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;
