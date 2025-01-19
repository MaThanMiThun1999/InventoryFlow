import { useState } from 'react';
import { motion } from 'framer-motion';
import {useAuthStore} from '../../store/authStore';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/base/Input';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import ErrorThrower from '../../components/base/ErrorThrower';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const { resetPassword, error, isLoading } = useAuthStore();
  const { token } = useParams();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
      return 'Confirm Password is required';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordErr = validatePassword(password);
    const confirmPasswordErr = validateConfirmPassword(
      password,
      confirmPassword
    );

    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmPasswordErr);

    if (passwordErr || confirmPasswordErr) {
      return;
    }
    try {
      await resetPassword(token, password);
      toast.success(
        'Password reset successfully, redirecting to login page...'
      );
      setTimeout(() => {
        navigate('/login');
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='max-w-xl w-[95%] bg-gray-800  bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden'
    >
      <div className='bg-plain-black-background dark:bg-plain-black-background bg-opacity-50 glass-panel rounded-none shadow-glow-secondary dark:shadow-glow-secondary overflow-hidden'>
        <div className='lg:p-8 p-2'>
          <h2 className='text-3xl font-bold mb-6 text-center text-white bg-clip-text'>
            Reset Password
          </h2>
          <form onSubmit={handleSubmit}>
            <Input
              icon={Lock}
              type='password'
              placeholder='New Password'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
              }}
              error={passwordError}
              required
            />
            {passwordError && <ErrorThrower error={passwordError} />}

            <Input
              icon={Lock}
              type='password'
              placeholder='Confirm New Password'
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmPasswordError('');
              }}
              error={confirmPasswordError}
              required
            />
            {confirmPasswordError && (
              <ErrorThrower error={confirmPasswordError} />
            )}

            {error && <ErrorThrower error={error} />}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type='submit'
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Set New Password'}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};
export default ResetPasswordPage;
