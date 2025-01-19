import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {useAuthStore} from '../../store/authStore';
import toast from 'react-hot-toast';
import ErrorThrower from '../../components/base/ErrorThrower';

const EmailVerificationPage = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [resendError, setResendError] = useState('');

  const { error, isLoading, verifyEmail, resendVerification, message } =
    useAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || '';
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== '');
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    try {
      await verifyEmail(verificationCode);
      navigate('/');
      toast.success('Email verified successfully, Redirecting to Home page');
    } catch (error) {
      console.log(error);
    }
  };

  const handleResendVerification = async () => {
    setResendError('');
    try {
      await resendVerification();
      toast.success('Verification code resent successfully');
      setResendTimer(60);
    } catch (error) {
      setResendError(error.message);
    }
  };
  useEffect(() => {
    let timerId;
    if (resendTimer > 0) {
      timerId = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [resendTimer]);

  useEffect(() => {
    if (code.every((digit) => digit !== '')) {
      handleSubmit(new Event('submit'));
    }
  }, [code]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='max-w-xl w-[95%] md:w-[70%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] bg-white backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden mx-auto'
    >
      <div className='bg-white lg:p-10 xs:p-9 p-7 rounded-none shadow-glow-secondary dark:shadow-glow-secondary overflow-hidden'>
        <div className='w-full bg-white bg-opacity-50 rounded-2xl'>
          <h2 className='lg:text-3xl text-2xl text-center text-nowrap font-bold text-black '>
            Verify Your Email
          </h2>
          <p className='text-center text-gray-700 mb-6'>
            Enter the 6-digit code sent to your email address.
          </p>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='flex justify-between gap-1 sm:gap-3'>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type='text'
                  maxLength='1'
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className='text-dark-text w-10 h-10 mx-auto sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-md border border-dark-background bg-dark-background placeholder-shown:pl-10 px-2 sm:px-3 py-1 sm:py-2 ring-[0.5px] ring-white focus:outline-none focus:ring-1 focus:ring-dark-primary focus:ring-offset-1 duration-fast focus:ring-offset-dark-primary text-center flex items-center justify-center'
                />
              ))}
            </div>
            {error && <ErrorThrower error={error} />}
            {resendError && <ErrorThrower error={resendError} />}
            <div className='flex items-center justify-between'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type='submit'
                className='bg-btn-primary w-full p-3 rounded-lg'
                disabled={isLoading || code.some((digit) => !digit)}
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default EmailVerificationPage;
