import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import useNotificationStore from '../../store/notificationStore';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { notifications, fetchNotifications } = useNotificationStore();

  const [openNavbar, setOpenNavbar] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setOpenNavbar(!openNavbar);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [fetchNotifications, isAuthenticated]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Overlay for mobile menu */}
      <div
        onClick={() => setOpenNavbar(false)}
        aria-hidden='true'
        className={`fixed inset-0 bg-gray-800/40 z-30 ${
          openNavbar ? 'flex lg:hidden' : 'hidden'
        }`}
      />

      <header className='sticky top-0 left-0 w-full bg-gray-800 border-b border-b-gray-100 dark:border-b-gray-800 z-40'>
        <nav className='relative mx-auto flex justify-between items-center w-full px-5 sm:px-10 md:px-12 lg:px-20 h-20'>
          {/* Brand Name */}
          <div className='flex items-center min-w-max'>
            <Link
              to='/'
              className='text-xl font-semibold text-gray-800 dark:text-gray-200'
            >
              <span className='relative after:absolute after:inset-0 after:rotate-3 after:border after:border-emerald-200 text-white p-1 dark:text-white'>
                InventoryFlow
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='lg:flex items-center text-lg font-semibold space-x-10 hidden'>
            {isAuthenticated ? (
              <>
                {user && user.role === 'admin' && (
                  <Link
                    to='/admin'
                    className='text-gray-200 dark:text-gray-200'
                  >
                    Admin
                  </Link>
                )}
                <Link to='/' className='text-gray-200 dark:text-gray-200'>
                  Home
                </Link>
                <Link
                  to='/products'
                  className='text-gray-200 dark:text-gray-200'
                >
                  Products
                </Link>
                {/* Dropdown Menu */}
                <div className='relative' ref={menuRef}>
                  <button
                    className='flex items-center text-gray-200 dark:text-gray-200'
                    onClick={toggleDropdown}
                  >
                    <User className='h-5 w-5 mr-1' />
                    Profile
                  </button>
                  {dropdownOpen && (
                    <div className='absolute right-0 mt-5 bg-gray-900 rounded-md shadow-lg p-2 z-10'>
                      <Link
                        to='/profile'
                        className='block px-8 py-3 text-sm text-gray-300 hover:bg-gray-700'
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className='flex gap-2 items-center w-full px-8 py-3 text-sm text-gray-300 hover:bg-gray-700'
                      >
                        <LogOut className='h-4 w-4' /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to='/login' className='text-gray-800 dark:text-gray-200'>
                  Login
                </Link>
                <Link to='/signup' className='text-gray-800 dark:text-gray-200'>
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className='lg:hidden flex items-center gap-x-4'>
            <button onClick={toggleNavbar} aria-label='Toggle menu'>
              {openNavbar ? (
                <X className='h-6 w-6 text-white' />
              ) : (
                <Menu className='h-6 w-6 text-white' />
              )}
            </button>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: openNavbar ? 1 : 0,
                y: openNavbar ? 0 : -10,
              }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`absolute top-20 left-0 w-[calc(100vw-2rem)] mx-4 bg-gray-800/95 text-white rounded-b-lg shadow-lg transform ${
                openNavbar ? 'block' : 'hidden'
              }`}
            >
              {isAuthenticated ? (
                <>
                  {user && user.role === 'admin' && (
                    <Link to='/admin' className='block px-4 py-4 text-sm'>
                      Admin Dashboard
                    </Link>
                  )}
                  <Link to='/products' className='block px-4 py-4 text-sm'>
                    Products
                  </Link>
                  <Link to='/profile' className='block px-4 py-4 text-sm'>
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className='block px-4 py-4 text-sm'
                  >
                    <LogOut className='inline h-4 w-4 mr-2' /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to='/login' className='block px-4 py-4 text-sm'>
                    Login
                  </Link>
                  <Link to='/signup' className='block px-4 py-4 text-sm'>
                    Sign Up
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
