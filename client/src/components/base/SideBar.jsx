// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import {
//   Home,
//   ShoppingBag,
//   Users,
//   Bell,
//   ChevronDown,
//   ChevronUp,
//   Menu,
//   X,
//   Settings,
//   PlusCircle,
//   List,
//   ClipboardList,
//   Edit2,
// } from 'lucide-react';
// import { motion } from 'framer-motion';
// import clsx from 'clsx';

// const Sidebar = () => {
//   const location = useLocation();
//   const [isSubMenuOpen, setIsSubMenuOpen] = useState({});
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const toggleSubMenu = (label) => {
//     setIsSubMenuOpen((prev) => ({
//       ...prev,
//       [label]: !prev[label],
//     }));
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen((prev) => !prev);
//   };

//   const navItems = [
//     {
//       label: 'Dashboard',
//       to: '/admin',
//       icon: <Home className='w-4 h-4' />,
//     },
//     {
//       label: 'Products',
//       to: '/admin/products',
//       icon: <ShoppingBag className='w-4 h-4' />,
//       subMenu: [
//         {
//           label: 'Product Categories',
//           to: '/admin/products',
//           icon: <List className='w-4 h-4' />,
//         },
//         {
//           label: 'Add New Product',
//           to: '/admin/products/create',
//           icon: <PlusCircle className='w-4 h-4' />,
//         },
//       ],
//     },
//     {
//       label: 'Employees',
//       to: '/admin/employees',
//       icon: <Users className='w-4 h-4' />,
//       subMenu: [
//         {
//           label: 'Employee List',
//           to: '/admin/employees',
//           icon: <ClipboardList className='w-4 h-4' />,
//         },
//         {
//           label: 'Add New Employee',
//           to: '/admin/employees/create',
//           icon: <PlusCircle className='w-4 h-4' />,
//         },
//       ],
//     },
//     // {
//     //   label: 'Notifications',
//     //   to: '/notifications',
//     //   icon: <Bell className='w-4 h-4' />,
//     // },
//     {
//       label: 'Settings',
//       to: '#',
//       icon: <Settings className='w-4 h-4' />,
//       subMenu: [
//         {
//           label: 'Profile Settings',
//           to: '/admin/profile',
//           icon: <Edit2 className='w-4 h-4' />,
//         },
//         {
//           label: 'Switch Employee',
//           to: '/',
//           icon: <Users className='w-4 h-4' />,
//         },
//       ],
//     },
//   ];

//   return (
//     <aside
//       className={clsx(
//         'bg-gray-800 dark:bg-gray-900 text-white shadow-md z-30 transition-all duration-300',
//         isSidebarOpen ? 'w-64' : 'w-16'
//       )}
//     >
//       {/* Sidebar Header */}
//       <div className='p-4 flex justify-between items-center'>
//         {isSidebarOpen && (
//           <h2 className='text-xl font-semibold'>Admin Panel</h2>
//         )}
//         <button
//           onClick={toggleSidebar}
//           className='text-white focus:outline-none'
//           aria-label='Toggle Sidebar'
//         >
//           {isSidebarOpen ? (
//             <X className='w-6 h-6' />
//           ) : (
//             <Menu className='w-6 h-6' />
//           )}
//         </button>
//       </div>

//       {/* Navigation Menu */}
//       <nav className='mt-4 space-y-2'>
//         {navItems.map((item, index) => (
//           <React.Fragment key={index}>
//             <Link
//               onClick={(e) => {
//                 e.preventDefault();
//                 toggleSubMenu(item.label);
//               }}
//               aria-expanded={!!isSubMenuOpen[item.label]}
//               to={item.to}
//               className={clsx(
//                 'flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800 transition-all',
//                 location.pathname === item.to
//                   ? 'bg-gray-700 dark:bg-gray-800'
//                   : '',
//                 isSidebarOpen ? 'justify-start' : 'justify-center'
//               )}
//             >
//               <span>{item.icon}</span>
//               {isSidebarOpen && <span>{item.label}</span>}
//               {item.subMenu && isSidebarOpen && (
//                 <span>
//                   <span className='ml-auto cursor-pointer'>
//                     {isSubMenuOpen[item.label] ? (
//                       <ChevronUp className='w-4  h-4 ' />
//                     ) : (
//                       <ChevronDown className='w-4 h-4' />
//                     )}
//                   </span>
//                 </span>
//               )}
//             </Link>

//             {/* Submenu */}
//             {item.subMenu && isSubMenuOpen[item.label] && (
//               <motion.div
//                 initial={{ opacity: 0, y: -5 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.2, ease: 'easeOut' }}
//                 className='mx-4 space-y-1'
//               >
//                 {item.subMenu.map((subItem, subIndex) => (
//                   <Link
//                     key={subIndex}
//                     to={subItem.to}
//                     className={clsx(
//                       'flex items-center p-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800',
//                       location.pathname === subItem.to
//                         ? 'bg-gray-700 dark:bg-gray-800'
//                         : ''
//                     )}
//                   >
//                     <span className='mr-2'>{subItem.icon}</span>
//                     {isSidebarOpen && <span>{subItem.label}</span>}
//                   </Link>
//                 ))}
//               </motion.div>
//             )}
//           </React.Fragment>
//         ))}
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;


import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  ShoppingBag,
  Users,
  Bell,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Settings,
  PlusCircle,
  List,
  ClipboardList,
  Edit2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Sidebar = () => {
  const location = useLocation();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSubMenu = (label) => {
    setIsSubMenuOpen((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const navItems = [
    {
      label: 'Dashboard',
      to: '/admin',
      icon: <Home className='w-5 h-5' />,
    },
    {
      label: 'Products',
      to: '/admin/products',
      icon: <ShoppingBag className='w-5 h-5' />,
      subMenu: [
        {
          label: 'Product Categories',
          to: '/admin/products',
          icon: <List className='w-4 h-4' />,
        },
        {
          label: 'Add New Product',
          to: '/admin/products/create',
          icon: <PlusCircle className='w-4 h-4' />,
        },
      ],
    },
    {
      label: 'Employees',
      to: '/admin/employees',
      icon: <Users className='w-5 h-5' />,
      subMenu: [
        {
          label: 'Employee List',
          to: '/admin/employees',
          icon: <ClipboardList className='w-4 h-4' />,
        },
        {
          label: 'Add New Employee',
          to: '/admin/employees/create',
          icon: <PlusCircle className='w-4 h-4' />,
        },
      ],
    },
    {
      label: 'Settings',
      to: '#',
      icon: <Settings className='w-5 h-5' />,
      subMenu: [
        {
          label: 'Profile Settings',
          to: '/admin/profile',
          icon: <Edit2 className='w-4 h-4' />,
        },
        {
          label: 'Switch Employee',
          to: '/',
          icon: <Users className='w-4 h-4' />,
        },
      ],
    },
  ];

  return (
    <aside
      className={clsx(
        'bg-gray-800 dark:bg-gray-900 text-white shadow-md z-30 transition-all duration-300',
        isSidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Sidebar Header */}
      <div className='p-4 flex justify-between items-center'>
        {isSidebarOpen && (
          <h2 className='text-xl font-semibold'>Admin Panel</h2>
        )}
        <button
          onClick={toggleSidebar}
          className='text-white focus:outline-none'
          aria-label='Toggle Sidebar'
        >
          {isSidebarOpen ? (
            <X className='w-6 h-6' />
          ) : (
            <Menu className='w-6 h-6' />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className='mt-4 space-y-2'>
        {navItems.map((item, index) => (
          <React.Fragment key={index}>
            <Link
              to={item.to}
              aria-expanded={!!isSubMenuOpen[item.label]}
              onClick={(e) => item.subMenu && toggleSubMenu(item.label)}
              className={clsx(
                'flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800 transition-all',
                location.pathname === item.to ||
                  item.subMenu?.some((sub) => sub.to === location.pathname)
                  ? 'bg-gray-700 dark:bg-gray-800'
                  : '',
                isSidebarOpen ? 'justify-start' : 'justify-center'
              )}
            >
              <span>{item.icon}</span>
              {isSidebarOpen && <span>{item.label}</span>}
              {item.subMenu && isSidebarOpen && (
                <span className='ml-auto cursor-pointer'>
                  {isSubMenuOpen[item.label] ? (
                    <ChevronUp className='w-4 h-4' />
                  ) : (
                    <ChevronDown className='w-4 h-4' />
                  )}
                </span>
              )}
            </Link>

            {/* Submenu */}
            {item.subMenu && isSubMenuOpen[item.label] && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className='mx-4 space-y-1'
              >
                {item.subMenu.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    to={subItem.to}
                    className={clsx(
                      'flex items-center p-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800 transition-all',
                      location.pathname === subItem.to
                        ? 'bg-gray-700 dark:bg-gray-800'
                        : ''
                    )}
                    aria-label={subItem.label}
                  >
                    <span className='mr-2'>{subItem.icon}</span>
                    {isSidebarOpen && <span>{subItem.label}</span>}
                  </Link>
                ))}
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
