import { motion } from 'framer-motion';
import { useState } from 'react';
import {useAuthStore} from '../../store/authStore';
import Input from '../../components/base/Input';
import { ArrowLeft, Loader, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import ErrorThrower from '../../components/base/ErrorThrower';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { isLoading, forgotPassword, error } = useAuthStore();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    setEmailError(emailErr);
    if (emailErr) {
      return;
    }
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='rounded-2xl max-w-xl w-[95%] mx-auto'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=' bg-white backdrop-filter backdrop-blur-xl rounded-t-2xl shadow-xl overflow-hidden'
      >
        <div className=' w-full bg-bg-white bg-opacity-50 glass-panel rounded-none shadow-glow-secondary dark:shadow-glow-secondary overflow-hidden'>
          <div className='lg:p-8 p-5'>
            <h2 className='lg:text-3xl text-2xl text-center mb-3 text-nowrap font-bold text-black'>
              Forgot Your Password?
            </h2>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <p className='text-gray-700 mb-6 text-center'>
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>
                <Input
                  icon={Mail}
                  type='email'
                  placeholder='Email Address'
                  value={email}
                  autoFocus
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  required
                  error={emailError}
                />
                {emailError && <ErrorThrower error={emailError} />}
                {error && <ErrorThrower error={error} />}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type='submit'
                  className='bg-btn-primary w-full p-3 rounded-lg'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className='size-6 animate-spin mx-auto' />
                  ) : (
                    'Send Reset Link'
                  )}
                </motion.button>
              </form>
            ) : (
              <div className='text-center'>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className='w-16 h-16 bg-dark-primary dark:bg-cyber-purple rounded-full flex items-center justify-center mx-auto mb-4'
                >
                  <Mail className='h-8 w-8 text-white' />
                </motion.div>
                <p className='text-gray-300 mb-6'>
                  If an account exists for {email}, you will receive a password
                  reset link shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      <div className='px-8 py-4 bg-gray-900/85 border-b-[1px] rounded-b-2xl flex-center'>
        <Link
          to={'/login'}
          className='text-sm text-text-primary duration-300 hover:underline flex items-center'
        >
          <ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
        </Link>
      </div>
    </div>
  );
};
export default ForgotPasswordPage;
