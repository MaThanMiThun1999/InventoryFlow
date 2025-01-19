// src/layouts/UserLayout.js
import React, { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import ParticlesBackground from '../components/base/ParticlesBackground';
import Navbar from '../components/global/Navbar';
import { useAuthStore } from '../store/authStore';

const UserLayout = () => {
  const { isAuthenticated } = useAuthStore();

  // Memoize the Navbar to prevent re-renders when isAuthenticated does not change
  const memoizedNavbar = useMemo(
    () => <Navbar isAuthenticated={isAuthenticated} />,
    [isAuthenticated]
  );

  return (
    // bg-background dark:bg-dark-background text-text dark:text-text-subdued min-h-screen  overflow-hidden
    // <div className="bg-[#0A0F18]">
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
