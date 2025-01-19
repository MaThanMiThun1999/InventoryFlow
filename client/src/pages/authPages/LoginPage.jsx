import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/base/Input';
import { useAuthStore } from '../../store/authStore';
import ErrorThrower from '../../components/base/ErrorThrower';
import Electronics from '../../assets/img/electronics.webp';
import RealTechsLogo from '../../assets/img/Real-Techs-Logo.webp';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);
    if (emailErr || passwordErr) {
      return;
    }
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className='min-h-screen  flex items-center justify-center'>
      <div className='flex flex-col md:flex-row max-w-5xl w-full bg-white shadow-lg rounded-lg overflow-hidden'>
        {/* Left Panel */}
        <div className='md:w-1/2 flex flex-col justify-center bg-gradient-to-r from-btn-primary to-blue-600 text-white p-8'>
          <h1 className='text-4xl font-bold mb-4'>Welcome Back!</h1>
          <p className='text-lg'>
            Sign in to your account and continue exploring our ERP platform.
          </p>
          <div
            className='mt-8 hidden  md:block bg-cover bg-center bg-no-repeat'
            style={{
              backgroundImage: `url(${Electronics})`,
              height: '250px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          ></div>
        </div>

        {/* Right Panel */}
        <div className='md:w-1/2 p-8'>
          <div className='text-center'>
            <img src={RealTechsLogo} alt='RealTechs Logo' className='mx-auto w-32' />
          </div>

          <h2 className='text-2xl font-semibold text-gray-800 mt-4 text-center'>
            Login to Your Account
          </h2>

          <form className='mt-6 space-y-4' onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <Input
                icon={Mail}
                type='email'
                placeholder='Email Address'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                error={emailError}
              />
              {emailError && <ErrorThrower error={emailError} />}
            </div>

            {/* Password Input */}
            <div>
              <Input
                icon={Lock}
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                error={passwordError}
              />
              {passwordError && <ErrorThrower error={passwordError} />}
            </div>

            {error && <ErrorThrower error={error} />}

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type='submit'
              disabled={isLoading}
              className='w-full py-3 rounded-lg bg-btn-primary text-white font-semibold hover:bg-btn-primary/80 transition duration-200 disabled:bg-gray-300 flex items-center justify-center'
            >
              {isLoading ? (
                <Loader className='w-5 h-5 animate-spin' />
              ) : (
                'Login'
              )}
            </motion.button>
          </form>

          {/* Forgot Password */}
          <div className='text-center mt-4'>
            <Link
              to='/forget-password'
              className='text-sm text-gray-600 hover:underline'
            >
              Forgot Password?
            </Link>
          </div>

          {/* Signup Link */}
          <div className='text-center mt-6'>
            <p className='text-sm text-gray-600'>
              Don't have an account?{' '}
              <Link
                to='/signup'
                className='text-text-primary hover:text-text-primary/90 font-medium'
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
