import React, { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/global/Navbar';
import { useAuthStore } from '../store/authStore';

const UserLayout = () => {
  const { isAuthenticated } = useAuthStore();

  const memoizedNavbar = useMemo(
    () => <Navbar isAuthenticated={isAuthenticated} />,
    [isAuthenticated]
  );

  return (
    <div className='bg-[#efefef]'>
      {/* Navbar */}
      {memoizedNavbar}
      {/* Main Content Area */}
      <main className='relative'>
        {/* Main Page Outlet */}
        <Outlet />
      </main>

    </div>
  );
};

export default UserLayout;
