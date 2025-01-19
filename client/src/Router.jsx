// Import Statements
import React, { Suspense, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoadingSpinner from './components/animations/loader/LoadingSpinner';

// Layouts
import UserLayout from './layouts/UserLayout';
import UserAuthLayout from './layouts/UserAuthLayout';
import AdminLayout from './layouts/AdminLayout';

// Protected Routes
import ProtectedRoute from './routes/ProtectedRoute';
import RedirectAuthenticatedUsers from './routes/RedirectAuthenticatedUsers';
import AdminProtectedRoute from './routes/AdminProtectedRoute';

// User Auth Pages
import LoginPage from './pages/authPages/LoginPage';
import SignUpPage from './pages/authPages/SignUpPage';
import ForgotPasswordPage from './pages/authPages/ForgotPasswordPage';
import ResetPasswordPage from './pages/authPages/ResetPasswordPage';
import EmailVerificationPage from './pages/authPages/EmailVerificationPage';
import ProductList from './pages/productPages/ProductList';
import ProductDetails from './pages/productPages/ProductDetails';
import ProductCreate from './pages/productPages/ProductCreate';
import ProductEdit from './pages/productPages/ProductEdit';
import AdminDashboard from './pages/adminPages/AdminDashboard';
import EmployeeDashboard from './pages/employeePages/EmployeeDashboard';
import EmployeeList from './pages/employeePages/EmployeeList';
import EmployeeDetails from './pages/employeePages/EmployeeDetails';
import EmployeeCreate from './pages/employeePages/EmployeeCreate';
import EmployeeEdit from './pages/employeePages/EmployeeEdit';
import NotificationList from './pages/notifications/NotificationList';
import ProfilePage from './pages/profilePages/ProfilePage';

export default function Router() {
  const { checkAuth, isCheckingAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 100);
    checkAuth(); 

    return () => clearTimeout(timeout);
  }, [checkAuth]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Common Routes */}
        <Route element={<UserLayout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/products'
            element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            }
          />
          <Route
            path='/products/:id'
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/notifications'
            element={
              <ProtectedRoute>
                <NotificationList />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Auth Routes */}
        <Route element={<UserAuthLayout />}>
          <Route
            path='/login'
            element={
              <RedirectAuthenticatedUsers>
                <LoginPage />
              </RedirectAuthenticatedUsers>
            }
          />
          <Route
            path='/signup'
            element={
              <RedirectAuthenticatedUsers>
                <SignUpPage />
              </RedirectAuthenticatedUsers>
            }
          />
          <Route
            path='/forget-password'
            element={
              <RedirectAuthenticatedUsers>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUsers>
            }
          />
          <Route
            path='/reset-password/:token'
            element={<ResetPasswordPage />}
          />
          <Route
            path='/verify-email'
            element={
              <RedirectAuthenticatedUsers>
                {' '}
                <EmailVerificationPage />
              </RedirectAuthenticatedUsers>
            }
          />
        </Route>
        {/* Admin Routes */}
        <Route
          path='/admin'
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path='products' element={<ProductList />} />
          <Route path='profile' element={<ProfilePage />} />
          <Route path='products/:id' element={<ProductDetails />} />
          <Route path='products/create' element={<ProductCreate />} />
          <Route path='products/edit/:id' element={<ProductEdit />} />
          <Route path='employees' element={<EmployeeList />} />
          <Route path='employees/:id' element={<EmployeeDetails />} />
          <Route path='employees/create' element={<EmployeeCreate />} />
          <Route path='employees/edit/:id' element={<EmployeeEdit />} />
        </Route>
        {/* Custom 404 Page */}
        <Route path='*' element={<h1>404</h1>} />
      </Routes>
    </Suspense>
  );
}
