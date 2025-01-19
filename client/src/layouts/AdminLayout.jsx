import React, { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/base/SideBar';
import { motion } from 'framer-motion';

const AdminLayout = () => {
  return (
    <div className='flex bg-background dark:bg-dark-background min-h-screen overflow-x-hidden text-black dark:text-dark-text'>
      {/* Sidebar */}
      <Sidebar />
      <div className='flex-1 flex flex-col'>
        <main className='container max-w-7xl mx-auto p-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;