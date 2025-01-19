// import { motion } from 'framer-motion';
// import { Loader, Lock, Mail, User } from 'lucide-react';
// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {useAuthStore} from '../../store/authStore';
// import PasswordStrengthMeter from '../../components/base/PasswordStrengthMeter';
// import Input from '../../components/base/Input';
// import ErrorThrower from '../../components/base/ErrorThrower';
// const SignUpPage = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [nameError, setNameError] = useState('');
//   const [emailError, setEmailError] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const navigate = useNavigate();

//   const { signup, error, isLoading } = useAuthStore();
//   const validateName = (name) => {
//     if (!name) {
//       return 'Name is required';
//     }
//     return '';
//   };

//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!email) {
//       return 'Email is required';
//     }
//     if (!emailRegex.test(email)) {
//       return 'Please enter a valid email address';
//     }
//     return '';
//   };

//   const validatePassword = (password) => {
//     if (!password) {
//       return 'Password is required';
//     }
//     if (password.length < 6) {
//       return 'Password must be at least 6 characters long';
//     }
//     return '';
//   };

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     const nameErr = validateName(name);
//     const emailErr = validateEmail(email);
//     const passwordErr = validatePassword(password);

//     setNameError(nameErr);
//     setEmailError(emailErr);
//     setPasswordError(passwordErr);

//     if (nameErr || emailErr || passwordErr) {
//       return;
//     }
//     try {
//       await signup(email, password, name);
//       navigate('/verify-email');
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className='relative max-w-md w-[95%] rounded-[20px_70px] p-2'
//     >
//       <div className='  w-full ring-0 shadow-glow-primary rounded-[20px_70px] ring-cyber-purple'>
//         <div className=' w-full bg-plain-black-background rounded-[20px_70px] dark:bg-plain-black-background bg-opacity-50 glass-panel shadow-glow-secondary dark:shadow-glow-secondary overflow-hidden'>
//           <div className='p-5 pt-0'>
//             <h2 className='h3 text-text-subdued dark:text-dark-text font-share-tech-mono text-center'>
//               Create Account
//             </h2>

//             <form onSubmit={handleSignUp}>
//               <Input
//                 classNames='mb-2'
//                 icon={User}
//                 type='text'
//                 classNamesForInputTag='h-10 pl-10 w-full'
//                 placeholder='Full Name'
//                 value={name}
//                 onChange={(e) => {
//                   setName(e.target.value);
//                   setNameError('');
//                 }}
//                 error={nameError}
//               />
//               {nameError && <ErrorThrower error={nameError} />}
//               <Input
//                 icon={Mail}
//                 type='email'
//                 classNames='mb-1'
//                 classNamesForInputTag='h-10 pl-10 w-full'
//                 placeholder='Email Address'
//                 value={email}
//                 onChange={(e) => {
//                   setEmail(e.target.value);
//                   setEmailError('');
//                 }}
//                 error={emailError}
//               />
//               {emailError && <ErrorThrower error={emailError} />}
//               <Input
//                 icon={Lock}
//                 type='password'
//                 classNames='mb-0'
//                 classNamesForInputTag='h-10 pl-10 w-full'
//                 placeholder='Password'
//                 value={password}
//                 onChange={(e) => {
//                   setPassword(e.target.value);
//                   setPasswordError('');
//                 }}
//                 error={passwordError}
//               />
//               {passwordError && <ErrorThrower error={passwordError} />}
//               <div className='w-[100%] mb-2 mx-auto'>
//                 <PasswordStrengthMeter password={password} />
//               </div>
//               {/* {error && <ErrorThrower error={error} />} */}
//               <div className='flex flex-col gap-3 justify-center items-center w-[100%]'>
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className=' transition duration-200 '
//                   type='submit'
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <Loader className='w-6 h-6 animate-spin  mx-auto' />
//                   ) : (
//                     'Sign Up'
//                   )}
//                 </motion.button>
//               </div>
//             </form>
//           </div>
//           <div className='px-8 py-0  bg-opacity-50 flex justify-center'>
//             <p className='text-sm text-dark-text-subdued'>
//               Already have an account?
//               <Link
//                 to='/login'
//                 className='text-primary pl-1 duration-slow dark:text-primary-dark hover:underline'
//               >
//                 Login
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };
// export default SignUpPage;

import { motion } from 'framer-motion';
import { Loader, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordStrengthMeter from '../../components/base/PasswordStrengthMeter';
import Input from '../../components/base/Input';
import ErrorThrower from '../../components/base/ErrorThrower';
import RealTechsLogo from '../../assets/img/Real-Techs-Logo.webp'; // Replace with your logo
import Electronics from '../../assets/img/electronics.webp'; // Replace with your image
import { useAuthStore } from '../../store/authStore';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthStore();

  const validateName = (name) => {
    if (!name) {
      return 'Full Name is required';
    }
    return '';
  };

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
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setNameError(nameErr);
    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (nameErr || emailErr || passwordErr) {
      return;
    }

    try {
      await signup(email, password, name);
      navigate('/verify-email');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='flex flex-col md:flex-row max-w-5xl w-full bg-white shadow-lg rounded-lg overflow-hidden'>
        {/* Left Panel */}
        <div className='md:w-1/2 flex flex-col justify-center bg-gradient-to-r from-btn-primary to-blue-600 text-white p-6'>
          <h1 className='text-4xl font-bold mb-4'>Welcome to RealTechs!</h1>
          <p className='text-lg'>
            Join our platform today and start exploring powerful ERP solutions.
          </p>
          <div
            className='mt-8 hidden md:block bg-cover bg-center bg-no-repeat'
            style={{
              backgroundImage: `url(${Electronics})`,
              height: '250px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          ></div>
        </div>

        {/* Right Panel */}
        <div className='md:w-1/2 p-6'>
          <div className='text-center'>
            <img
              src={RealTechsLogo}
              alt='RealTechs Logo'
              className='mx-auto w-32'
            />
          </div>

          <h2 className='text-2xl font-semibold text-gray-800 mt-4 text-center'>
            Create Your Account
          </h2>

          <form className='mt-6 space-y-1' onSubmit={handleSignUp}>
            {/* Full Name Input */}
            <div>
              <Input
                classNames='w-full relative mb-3'
                icon={User}
                type='text'
                placeholder='Full Name'
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError('');
                }}
                error={nameError}
              />
              {nameError && <ErrorThrower error={nameError} />}
            </div>

            {/* Email Input */}
            <div>
              <Input
                classNames='w-full relative mb-3'
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
                classNames='w-full relative mb-3'
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

            {/* Password Strength Meter */}
            <div className='w-full'>
              <PasswordStrengthMeter password={password} />
            </div>

            {/* Error Messages */}
            {error && <ErrorThrower error={error} />}

            {/* Sign-Up Button */}
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
                'Sign Up'
              )}
            </motion.button>
          </form>

          {/* Already Have an Account */}
          <div className='text-center mt-2'>
            <p className='text-sm text-gray-600'>
              Already have an account?{' '}
              <Link
                to='/login'
                className='text-text-primary hover:text-text-primary/90 font-medium'
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
